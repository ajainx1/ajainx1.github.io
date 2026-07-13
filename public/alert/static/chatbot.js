// --- Floating AI Chatbot Widget Logic ---
        const MODEL_NAME = "qwen2.5:1.5b";
        let chatbotMessages, chatbotInput;
        let contactsDatabase = [];
        let chatHistory = [];

        // --- Web Speech API Voice Input ---
        let recognition = null;
        let isRecording = false;

        function initSpeechRecognition() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                console.log("Web Speech API is not supported in this browser.");
                return;
            }
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-IN'; // Indian English language support

            recognition.onstart = () => {
                isRecording = true;
                const micBtn = document.getElementById('chatbotMicBtn');
                if (micBtn) {
                    micBtn.classList.add('recording');
                    micBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                    micBtn.title = 'Stop listening';
                }
                if (chatbotInput) {
                    chatbotInput.placeholder = 'Listening... Speak now';
                }
            };

            recognition.onend = () => {
                isRecording = false;
                const micBtn = document.getElementById('chatbotMicBtn');
                if (micBtn) {
                    micBtn.classList.remove('recording');
                    micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                    micBtn.title = 'Voice Input';
                }
                if (chatbotInput) {
                    chatbotInput.placeholder = 'Type your message...';
                }
            };

            recognition.onerror = (e) => {
                console.error("Speech recognition error:", e.error);
                recognition.stop();
            };

            recognition.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                if (chatbotInput && transcript) {
                    if (chatbotInput.value) {
                        chatbotInput.value += ' ' + transcript;
                    } else {
                        chatbotInput.value = transcript;
                    }
                    chatbotInput.focus();
                }
            };
        }

        function toggleSpeechRecognition() {
            if (!recognition) return;
            if (isRecording) {
                recognition.stop();
            } else {
                try {
                    recognition.start();
                } catch (err) {
                    console.error("Failed to start speech recognition:", err);
                }
            }
        }

        // Client-side synonym dictionary for query expansion
        const synonymDict = {
            "attendance": ["fms", "attendance", "billing", "biometric", "taspass", "check-in"],
            "internet": ["nkn", "internet", "link", "router", "connectivity", "bandwidth", "wan", "lan"],
            "tacs": ["taspass", "password", "tacacs", "credentials", "tacs"],
            "taspass": ["taspass", "password", "tacacs", "credentials", "tacs"],
            "password": ["taspass", "password", "tacacs", "credentials", "tacs"],
            "sio": ["sio", "ajay", "head"],
            "patna": ["patna", "hq", "sio"],
            "noc": ["patna", "hq", "noc", "server"]
        };

        async function loadContactsDatabase() {
            try {
                const response = await fetch('../contacts.json');
                if (response.ok) {
                    contactsDatabase = await response.json();
                    console.log("Contacts database loaded successfully. Count: " + contactsDatabase.length);
                } else {
                    console.warn("Failed to load contacts database from contacts.json");
                }
            } catch (error) {
                console.error("Error fetching contacts.json:", error);
            }
        }

        function formatMarkdown(text) {
            if (!text) return "";
            // Escape HTML tags to protect against XSS
            let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            
            // Format Bold: **text**
            html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            
            // Format Inline Code: `code`
            html = html.replace(/`(.*?)`/g, "<code>$1</code>");
            
            // Format Headers: ###, ##, #
            html = html.replace(/^### (.*?)$/gm, "<h4>$1</h4>");
            html = html.replace(/^## (.*?)$/gm, "<h5>$1</h5>");
            html = html.replace(/^# (.*?)$/gm, "<h6>$1</h6>");
            
            // Format Lists: lines starting with "- " or "* "
            html = html.replace(/^(?:\s*[-*]\s+)(.*?)$/gm, "<li>$1</li>");
            html = html.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>");
            html = html.replace(/<\/ul>\s*<ul>/g, ""); // Merge adjacent list containers
            
            // Convert newlines to br tags
            html = html.replace(/\n/g, "<br>");
            
            // Cleanup stray breaks around list structures
            html = html.replace(/<br><\/ul>/g, "</ul>").replace(/<\/ul><br>/g, "</ul>");
            html = html.replace(/<br><li>/g, "<li>").replace(/<\/li><br>/g, "</li>");
            html = html.replace(/<ul><br>/g, "<ul>").replace(/<br><ul>/g, "<ul>");
            
            return html;
        }

        function appendBotMessage(text) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('chat-msg', 'bot');
            msgDiv.innerHTML = formatMarkdown(text);
            chatbotMessages.appendChild(msgDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function sendSuggestionChip(message) {
            if (chatbotInput) {
                chatbotInput.value = message;
                handleSend();
            }
        }

        function appendUserMessage(text) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('chat-msg', 'user');
            msgDiv.textContent = text;
            chatbotMessages.appendChild(msgDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        async function handleSend() {
            const text = chatbotInput.value.trim();
            if (!text) return;

            appendUserMessage(text);
            chatbotInput.value = '';

            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'chat-msg bot typing-indicator-msg';
            typingIndicator.style.alignSelf = 'flex-start';
            typingIndicator.innerHTML = `
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            `;
            chatbotMessages.appendChild(typingIndicator);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            // Intercept live status verification commands (NOC pinging check)
            let statusTarget = null;
            const lowerText = text.toLowerCase().trim();

            if (lowerText.includes("attendance") && (lowerText.includes("ping") || lowerText.includes("status") || lowerText.includes("up") || lowerText.includes("down") || lowerText.includes("online") || lowerText.includes("offline") || lowerText.includes("reach"))) {
                statusTarget = "attendance";
            } else if (lowerText.includes("taspass") || (lowerText.includes("tacs") && (lowerText.includes("ping") || lowerText.includes("status") || lowerText.includes("up") || lowerText.includes("down") || lowerText.includes("online") || lowerText.includes("offline") || lowerText.includes("reach")))) {
                statusTarget = "taspass";
            } else if (lowerText.includes("dpr") && (lowerText.includes("ping") || lowerText.includes("status") || lowerText.includes("up") || lowerText.includes("down") || lowerText.includes("online") || lowerText.includes("offline") || lowerText.includes("reach"))) {
                statusTarget = "dpr";
            } else if ((lowerText.includes("noc") || lowerText.includes("patna noc")) && (lowerText.includes("ping") || lowerText.includes("status") || lowerText.includes("up") || lowerText.includes("down") || lowerText.includes("online") || lowerText.includes("offline") || lowerText.includes("reach"))) {
                statusTarget = "patna_noc";
            }

            if (statusTarget) {
                try {
                    const response = await fetch(`../ping.php?target=${statusTarget}`);
                    typingIndicator.remove();
                    if (response.ok) {
                        const data = await response.json();
                        let responseText = "";
                        if (data.status === "online") {
                            responseText = `🟢 **${data.name}** is **ONLINE**.\n\n* **Host:** \`${data.host}:${data.port}\`\n* **Response RTT:** \`${data.rtt_ms} ms\`\n* **Status:** Connection test successful, TCP socket active.`;
                        } else {
                            responseText = `🔴 **${data.name}** is **OFFLINE**.\n\n* **Host:** \`${data.host}:${data.port}\`\n* **Error:** \`${data.message || 'Connection refused'}\`\n* **Status:** Connection failed. Check network routing.`;
                        }
                        appendBotMessage(responseText);
                    } else {
                        appendBotMessage(`⚠️ Unable to fetch live status. The backend status verification tool returned an error code ${response.status}.`);
                    }
                } catch (error) {
                    console.error("Error pinging status:", error);
                    typingIndicator.remove();
                    appendBotMessage("⚠️ Network error occurred while contacting the live status verification script.");
                }
                return; // Skip LLM call
            }

            // Simple client-side RAG: find relevant contacts matching query keywords (with synonym expansion)
            let matchedContacts = [];
            if (contactsDatabase.length > 0) {
                const queryLower = text.toLowerCase();
                // Extract keywords of length >= 3
                let keywords = queryLower.split(/[^a-zA-Z0-9]/).filter(w => w.length >= 3);
                
                if (keywords.length > 0) {
                    // Expand keywords using synonym lookup table
                    const expandedKeywords = [...keywords];
                    keywords.forEach(kw => {
                        if (synonymDict[kw]) {
                            expandedKeywords.push(...synonymDict[kw]);
                        }
                    });
                    keywords = Array.from(new Set(expandedKeywords));

                    matchedContacts = contactsDatabase.map(c => {
                        let score = 0;
                        const name = (c.name || "").toLowerCase();
                        const role = (c.role || "").toLowerCase();
                        const location = (c.location || "").toLowerCase();
                        const email = (c.email || "").toLowerCase();
                        const source = (c.source || "").toLowerCase();
                        
                        keywords.forEach(kw => {
                            if (name === kw) score += 10;
                            else if (name.includes(kw)) score += 5;
                            
                            if (location === kw) score += 8;
                            else if (location.includes(kw)) score += 4;
                            
                            if (role.includes(kw)) score += 2;
                            if (email.includes(kw)) score += 1;
                            if (source.includes(kw)) score += 1;
                        });
                        
                        return { contact: c, score: score };
                    })
                    .filter(item => item.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .map(item => item.contact);
                }
            }

            // Limit to top 5 matches to avoid prompt bloat and keep context small
            matchedContacts = matchedContacts.slice(0, 5);

            let dynamicContext = "";
            if (matchedContacts.length > 0) {
                dynamicContext = "\n\nRelevant Contact details for the query:\n" + 
                    matchedContacts.map(c => `- ${c.name} (${c.role || 'Staff'}, Location: ${c.location || 'N/A'}): Mobile: ${c.mobile || 'N/A'}, Email: ${c.email || 'N/A'}${c.ip ? ', IP/Landline: ' + c.ip : ''}`).join("\n");
            }

            try {
                const response = await fetch('../chat.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: MODEL_NAME,
                        messages: [
                            {
                                role: 'system',
                                content: 'You are the Bihar State NOC AI assistant. Be helpful, concise and direct. Answer questions about Bihar State NOC, support contacts, service statuses (Bihar NOC Patna: 99.98%, NKN Core: 100%, District links: 99.95%), upload limits (max 500MB). Engineers can change their TACACS/TACS password at the portal link: https://taspass.state-noc.org and access the FMS Billing & Attendance System at: http://fms.state-noc.org/FMS-attendance/index.php. Address: Soochna Bhawan Campus, Patna. Phone: 0612-2547964. This chatbot was founded by Aditya Jain, Security Administrator. If asked about Aditya Jain (including queries like "how is aditya jain" or who he is), do not refuse; provide his profile as the Security Administrator and founder of this bot, and state that his correct contact number is +91 99999 88888 and email is seca1.shq.br@state-noc.org.' + dynamicContext
                            },
                            ...chatHistory,
                            { role: 'user', content: text }
                        ],
                        stream: true,
                        options: {
                            num_ctx: 2048,
                            num_predict: 256,
                            temperature: 0.7,
                            num_thread: 8 // Optimized for server's NUMA E5-4610 CPU
                        },
                        keep_alive: -1 // Keep model loaded in memory indefinitely to avoid loading delays
                    })
                });

                typingIndicator.remove();

                if (!response.ok) {
                    throw new Error("API call failed");
                }

                const msgDiv = document.createElement('div');
                msgDiv.classList.add('chat-msg', 'bot');
                chatbotMessages.appendChild(msgDiv);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let done = false;
                let botText = "";
                let buffer = "";

                while (!done) {
                    const { value, done: readerDone } = await reader.read();
                    done = readerDone;
                    if (value) {
                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');
                        buffer = lines.pop(); // Keep the last partial line in buffer

                        for (const line of lines) {
                            if (line.trim() !== '') {
                                try {
                                    const data = JSON.parse(line);
                                    if (data.message && data.message.content) {
                                        botText += data.message.content;
                                        msgDiv.innerHTML = formatMarkdown(botText);
                                        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                                    }
                                } catch (e) {
                                    console.error("Error parsing JSON chunk", e);
                                }
                            }
                        }
                    }
                }
                
                if (buffer.trim() !== '') {
                    try {
                        const data = JSON.parse(buffer);
                        if (data.message && data.message.content) {
                            botText += data.message.content;
                            msgDiv.innerHTML = formatMarkdown(botText);
                            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                        }
                    } catch (e) {}
                }

                // Save conversation turn to history
                chatHistory.push({ role: 'user', content: text });
                chatHistory.push({ role: 'assistant', content: botText });
                if (chatHistory.length > 8) {
                    chatHistory = chatHistory.slice(chatHistory.length - 8); // Keep last 4 turns
                }
            } catch (error) {
                console.error(error);
                typingIndicator.remove();
                appendBotMessage("Error: Unable to connect to the assistant server. Please ensure Ollama is running and CORS is allowed.");
            }
        }

        // --- Bihar District Operations Hub Mappings & Logic ---
        const auditFiles = {
            "aurangabad": "DISTRICT AUDIT - 2025/AURANGABAD.xlsx",
            "araria": "DISTRICT AUDIT - 2025/Araria.xlsx",
            "arwal": "DISTRICT AUDIT - 2025/Arwal.xlsx",
            "buxar": "DISTRICT AUDIT - 2025/BUXAR.xlsx",
            "banka": "DISTRICT AUDIT - 2025/Banka.xlsx",
            "begusarai": "DISTRICT AUDIT - 2025/Begusarai.xlsx",
            "kaimur": "DISTRICT AUDIT - 2025/Bhabhua (Kaimur).xlsx",
            "bhagalpur": "DISTRICT AUDIT - 2025/Bhagalpur.xlsx",
            "bhojpur": "DISTRICT AUDIT - 2025/Bhojpur.xlsx",
            "darbhanga": "DISTRICT AUDIT - 2025/DHARBANGA.xlsx",
            "east champaran": "DISTRICT AUDIT - 2025/EAST CHAMPARAN (MOTIHARI).xlsx",
            "gaya": "DISTRICT AUDIT - 2025/GAYA JI.xlsx",
            "gopalganj": "DISTRICT AUDIT - 2025/GOPALGANJ.xlsx",
            "jamui": "DISTRICT AUDIT - 2025/JAMUI.xlsx",
            "jehanabad": "DISTRICT AUDIT - 2025/JEHANABAD.xlsx",
            "katihar": "DISTRICT AUDIT - 2025/KATIHAR.xlsx",
            "khagaria": "DISTRICT AUDIT - 2025/KHAGARIA.xlsx",
            "kishanganj": "DISTRICT AUDIT - 2025/KISANGANJ.xlsx",
            "lakhisarai": "DISTRICT AUDIT - 2025/LAKHISARAI.xlsx",
            "madhepura": "DISTRICT AUDIT - 2025/MADHEPURA.xlsx",
            "madhubani": "DISTRICT AUDIT - 2025/MADHUBANI.xlsx",
            "munger": "DISTRICT AUDIT - 2025/MUNGER.xlsx",
            "muzaffarpur": "DISTRICT AUDIT - 2025/MUZAFFARPUR.xlsx",
            "nalanda": "DISTRICT AUDIT - 2025/NALANDA.xlsx",
            "nawada": "DISTRICT AUDIT - 2025/NAWADA.xlsx",
            "patna": "DISTRICT AUDIT - 2025/PATNA DU.xlsx",
            "patna du": "DISTRICT AUDIT - 2025/PATNA DU.xlsx",
            "purnia": "DISTRICT AUDIT - 2025/PURNEA.xlsx",
            "rohtas": "DISTRICT AUDIT - 2025/ROHTAS (SASARAM).xlsx",
            "saharsa": "DISTRICT AUDIT - 2025/SAHARSA.xlsx",
            "samastipur": "DISTRICT AUDIT - 2025/SAMASTIPUR.xlsx",
            "saran": "DISTRICT AUDIT - 2025/SARAN (CHAPRA).xlsx",
            "sheohar": "DISTRICT AUDIT - 2025/SEHEOHAR.xlsx",
            "sheikhpura": "DISTRICT AUDIT - 2025/SHEKHPURA.xlsx",
            "sitamarhi": "DISTRICT AUDIT - 2025/SITAMAHARI.xlsx",
            "siwan": "DISTRICT AUDIT - 2025/SIWAN.xlsx",
            "supaul": "DISTRICT AUDIT - 2025/SUPAUL.xlsx",
            "vaishali": "DISTRICT AUDIT - 2025/VAISHALI (HAJIPUR).xlsx",
            "west champaran": "DISTRICT AUDIT - 2025/WEST CHAMPARAN (BEETIAH).xlsx"
        };

        const macFiles = {
            "araria": "MAC Weekly UP-Date/Araria NIC DHQ MAC.xlsx",
            "aurangabad": "MAC Weekly UP-Date/Aurangabad NIC DHQ MAC.xlsx",
            "begusarai": "MAC Weekly UP-Date/Begusarai NIC DHQ MAC.xlsx"
        };

        const dioCommonEmails = {
            "arwal": "dio-arw@state-noc.org",
            "araria": "dio-ara-bih@state-noc.org",
            "aurangabad": "dio-agb@state-noc.org",
            "banka": "dio-bka@state-noc.org",
            "begusarai": "dio-bsr@state-noc.org",
            "kaimur": "dio-kai@state-noc.org",
            "bhagalpur": "dio-bgo@state-noc.org",
            "bhojpur": "dio-bjp@state-noc.org",
            "buxar": "dio-bux@state-noc.org",
            "darbhanga": "dio-dbg@state-noc.org",
            "east champaran": "dio-prc@state-noc.org",
            "gaya": "dio-gay@state-noc.org",
            "gopalganj": "dio-gpg@state-noc.org",
            "jamui": "dio-jam@state-noc.org",
            "jehanabad": "dio-jhb-bih@state-noc.org",
            "katihar": "dio-ktr@state-noc.org",
            "khagaria": "dio-kgr-bih@state-noc.org",
            "kishanganj": "dio-ksg@state-noc.org",
            "lakhisarai": "dio-lsr@state-noc.org",
            "madhepura": "dio-mdp@state-noc.org",
            "madhubani": "dio-mdb-bih@state-noc.org",
            "munger": "dio-mun@state-noc.org",
            "muzaffarpur": "dio-muz@state-noc.org",
            "nalanda": "dio-nld@state-noc.org",
            "nawada": "dio-naw@state-noc.org",
            "patna du": "dio-ptn@state-noc.org",
            "patna": "dio-ptn@state-noc.org",
            "purnia": "dio-prn@state-noc.org",
            "rohtas": "dio-rts@state-noc.org",
            "saharsa": "dio-shs@state-noc.org",
            "samastipur": "dio-sms@state-noc.org",
            "saran": "dio-sar@state-noc.org",
            "sheikhpura": "dio-shh-bih@state-noc.org",
            "sheohar": "dio-shh@state-noc.org",
            "sitamarhi": "dio-stm@state-noc.org",
            "siwan": "dio-swn@state-noc.org",
            "supaul": "dio-spl@state-noc.org",
            "vaishali": "dio-vsh@state-noc.org",
            "west champaran": "dio-psc@state-noc.org"
        };

        function showDistrictDetails(districtKey, districtDisplayName) {
            // Remove active classes
            document.querySelectorAll('.district-node').forEach(node => {
                node.classList.remove('active');
                if (node.getAttribute('data-district') === districtKey) {
                    node.classList.add('active');
                }
            });

            const panel = document.getElementById('districtDetailsPanel');
            const placeholder = panel.querySelector('.panel-placeholder');
            const content = panel.querySelector('.panel-content');

            // Find matching engineers/contacts
            const query = districtKey.toLowerCase();
            const matches = contactsDatabase.filter(c => {
                const loc = (c.location || "").toLowerCase().trim();
                if (query === 'patna du') {
                    return loc === 'patna du' || loc === 'patna';
                }
                if (query === 'patna') {
                    return loc === 'patna hq';
                }
                if (query === 'west champaran' && (loc.includes('bettiah') || loc.includes('west'))) return true;
                if (query === 'kaimur' && (loc.includes('bhabhua') || loc.includes('kaimur'))) return true;
                if (query === 'rohtas' && (loc.includes('sasaram') || loc.includes('rohtas'))) return true;
                return loc === query || loc.includes(query);
            });

            // Build links
            const auditPath = auditFiles[districtKey];
            const macPath = macFiles[districtKey];

            let docsHtml = '';
            if (auditPath) {
                docsHtml += `
                    <a href="nic/${auditPath}" class="doc-item-link" download>
                        <span><i class="far fa-file-excel text-success" style="margin-right: 8px; font-size: 1.1rem;"></i> District Audit Report (2025)</span>
                        <i class="fas fa-arrow-alt-circle-down arrow"></i>
                    </a>
                `;
            } else {
                docsHtml += `
                    <div style="font-size: 0.85rem; padding: 12px; color: var(--text-muted); background: var(--bg-secondary); border: 1px dashed var(--border-color); border-radius: 6px;">
                        <i class="fas fa-info-circle"></i> No District Audit file uploaded yet.
                    </div>
                `;
            }

            if (macPath) {
                docsHtml += `
                    <a href="nic/${macPath}" class="doc-item-link" download>
                        <span><i class="far fa-file-excel text-success" style="margin-right: 8px; font-size: 1.1rem;"></i> MAC Weekly Update Sheet</span>
                        <i class="fas fa-arrow-alt-circle-down arrow"></i>
                    </a>
                `;
            }

            // Build contacts HTML
            let contactsHtml = '';
            if (matches.length > 0) {
                matches.forEach(c => {
                    const isFMS = c.source === 'FMS Engineer';
                    contactsHtml += `
                        <div class="contact-card ${isFMS ? 'fms-card' : 'sio-card'}">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                                <strong style="font-size: 0.95rem; color: var(--text-primary);">${c.name}</strong>
                                <span class="badge-district" style="font-size: 0.7rem; background-color: ${isFMS ? 'rgba(249, 115, 22, 0.15)' : 'rgba(15, 76, 129, 0.15)'}; color: ${isFMS ? 'var(--accent)' : 'var(--primary)'}; border: none; font-weight: 700; padding: 2px 6px;">
                                    ${c.source}
                                </span>
                            </div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
                                <div><i class="fas fa-briefcase" style="width: 14px; margin-right: 6px; color: var(--text-muted);"></i> ${c.role || 'Staff'}</div>
                                <div><i class="fas fa-phone" style="width: 14px; margin-right: 6px; color: var(--text-muted);"></i> Mobile: <a href="tel:${c.mobile}" style="color: inherit; text-decoration: none; font-weight: 600;">${c.mobile}</a></div>
                                ${c.ip ? `<div><i class="fas fa-phone-alt" style="width: 14px; margin-right: 6px; color: var(--text-muted);"></i> VoIP Ext: ${c.ip}</div>` : ''}
                                ${c.email ? `<div><i class="fas fa-envelope" style="width: 14px; margin-right: 6px; color: var(--text-muted);"></i> Email: ${c.email.split(',').map(e => `<a href="mailto:${e.trim()}" style="color: inherit; text-decoration: none; font-weight: 500;">${e.trim()}</a>`).join(', ')}</div>` : ''}
                            </div>
                        </div>
                    `;
                });
            } else {
                contactsHtml = `
                    <div style="font-size: 0.85rem; padding: 15px; color: var(--text-muted); text-align: center; border: 1px dashed var(--border-color); border-radius: 6px;">
                        No FMS or SIO contacts registered in database for this district.
                    </div>
                `;
            }

            const commonEmail = dioCommonEmails[districtKey] || '';
            const emailHtml = commonEmail ? `
                <div class="dio-common-email-banner" style="background: rgba(15, 76, 129, 0.08); border-left: 4px solid var(--primary); padding: 12px 16px; border-radius: 6px; margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 2px;">Official District DIO Email</span>
                        <a href="mailto:${commonEmail}" style="font-size: 1rem; color: var(--primary); font-weight: 600; text-decoration: none;"><i class="fas fa-envelope-open-text" style="margin-right: 6px;"></i> ${commonEmail}</a>
                    </div>
                    <span class="badge-district" style="background-color: rgba(15, 76, 129, 0.15); color: var(--primary); font-size: 0.75rem; border: none; font-weight: 700; padding: 4px 10px;">Official Role ID</span>
                </div>
            ` : '';

            content.innerHTML = `
                ${emailHtml}
                <div class="panel-details-grid">
                    <div class="details-col">
                        <h3><i class="fas fa-headset"></i> Support Contacts (${districtDisplayName})</h3>
                        <div style="max-height: 250px; overflow-y: auto; padding-right: 5px;">
                            ${contactsHtml}
                        </div>
                    </div>
                    <div class="details-col">
                        <h3><i class="fas fa-folder-open"></i> District Audit & MAC Files</h3>
                        <div class="docs-list">
                            ${docsHtml}
                        </div>
                    </div>
                </div>
            `;

            placeholder.style.display = 'none';
            content.style.display = 'block';
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // --- Interactive Network Canvas Nodes Animation ---
        function initNetworkAnimation() {
            const canvas = document.getElementById('networkCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const hero = document.querySelector('.hero-dashboard') || document.body;

            let width = canvas.width = hero === document.body ? window.innerWidth : hero.offsetWidth;
            let height = canvas.height = hero === document.body ? window.innerHeight : hero.offsetHeight;

            window.addEventListener('resize', () => {
                if (hero) {
                    width = canvas.width = hero === document.body ? window.innerWidth : hero.offsetWidth;
                    height = canvas.height = hero === document.body ? window.innerHeight : hero.offsetHeight;
                }
            });

            const particles = [];
            const particleCount = 45;
            const connectionDistance = 110;
            const mouse = { x: null, y: null, radius: 150 };

            hero.addEventListener('mousemove', (e) => {
                const rect = hero === document.body ? {left: 0, top: 0} : hero.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });

            hero.addEventListener('mouseleave', () => {
                mouse.x = null;
                mouse.y = null;
            });

            class Particle {
                constructor() {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.vx = (Math.random() - 0.5) * 0.7;
                    this.vy = (Math.random() - 0.5) * 0.7;
                    this.radius = Math.random() * 2.5 + 1.5;
                }

                update() {
                    this.x += this.vx;
                    this.y += this.vy;

                    if (this.x < 0 || this.x > width) this.vx *= -1;
                    if (this.y < 0 || this.y > height) this.vy *= -1;

                    // Mouse interaction: push away particles slightly
                    if (mouse.x !== null && mouse.y !== null) {
                        const dx = this.x - mouse.x;
                        const dy = this.y - mouse.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < mouse.radius) {
                            const force = (mouse.radius - dist) / mouse.radius;
                            const angle = Math.atan2(dy, dx);
                            this.x += Math.cos(angle) * force * 2;
                            this.y += Math.sin(angle) * force * 2;
                        }
                    }
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(56, 189, 248, 0.75)'; // sky blue accent color
                    ctx.fill();
                }
            }

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }

            function animate() {
                ctx.clearRect(0, 0, width, height);

                particles.forEach(p => {
                    p.update();
                    p.draw();
                });

                // Draw lines between close particles
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < connectionDistance) {
                            const alpha = (1 - (dist / connectionDistance)) * 0.25;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                    }
                }

                requestAnimationFrame(animate);
            }

            animate();
        }

        // --- Celebration Firecrackers & Rocket System ---
        function triggerCelebration(visitorNumber) {
            // 1. Create Modal HTML
            const modal = document.createElement('div');
            modal.id = 'celebrationModal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(11, 15, 25, 0.65);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 100000;
                opacity: 0;
                transition: opacity 0.5s ease;
            `;
            
            const wrapper = document.createElement('div');
            wrapper.className = 'celebration-card-wrapper';
            
            const card = document.createElement('div');
            card.className = 'celebration-card';

            card.innerHTML = `
                <!-- Decorative absolute emojis popping out of card -->
                <div style="position: absolute; left: -35px; top: 10%; font-size: 2.8rem; transform: rotate(-15deg); animation: float-balloon 3s infinite alternate ease-in-out; pointer-events: none; z-index: 10;">🎈</div>
                <div style="position: absolute; right: -35px; bottom: 20%; font-size: 2.8rem; transform: rotate(15deg); animation: float-balloon 3s infinite alternate-reverse ease-in-out; pointer-events: none; z-index: 10;">🎁</div>
                <div style="position: absolute; left: -30px; bottom: 12%; font-size: 2.2rem; transform: rotate(-10deg); animation: float-balloon 4s infinite alternate ease-in-out; pointer-events: none; z-index: 10;">🥳</div>
                <div style="position: absolute; right: -30px; top: 15%; font-size: 2.2rem; transform: rotate(10deg); animation: float-balloon 4s infinite alternate-reverse ease-in-out; pointer-events: none; z-index: 10;">🎉</div>
                
                <div style="margin-bottom: 20px; position: relative; z-index: 2;">
                    <span style="font-size: 3.8rem; animation: float-trophy 2s infinite alternate ease-in-out; display: inline-block; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));">🏆</span>
                </div>
                <h2 class="neon-text-glow" style="position: relative; z-index: 2;">Milestone Visitor!</h2>
                <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 25px; line-height: 1.6; position: relative; z-index: 2;">
                    Congratulations! You are visitor <strong style="color: var(--primary); font-size: 1.3rem; font-weight: 800; text-shadow: 0 0 5px rgba(15, 76, 129, 0.15);">#${visitorNumber.toLocaleString('en-IN')}</strong> to the Bihar NOC Support Portal.
                </p>
                <button id="dismissCelebrationBtn" class="btn glow-btn" style="padding: 12px 24px; border-radius: 20px; font-weight: 700; width: 100%; cursor: pointer; position: relative; z-index: 2;">
                    Continue to Portal
                </button>
            `;
            
            wrapper.appendChild(card);
            modal.appendChild(wrapper);
            document.body.appendChild(modal);
            
            // Animate Wrapper In
            setTimeout(() => {
                modal.style.opacity = '1';
                wrapper.style.transform = 'scale(1)';
            }, 10);

            // 2. Create Canvas
            const canvas = document.createElement('canvas');
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 100002;
            `;
            document.body.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            let width = canvas.width = window.innerWidth;
            let height = canvas.height = window.innerHeight;
            
            window.addEventListener('resize', () => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            });

            const rockets = [];
            const particles = [];
            const confetti = [];
            const emojis = [];
            
            const colors = [
                '#f97316', // Saffron
                '#0f4c81', // Royal Blue
                '#10b981', // Emerald Green
                '#f59e0b', // Amber
                '#38bdf8', // Sky Blue
                '#ec4899', // Pink
                '#8b5cf6'  // Purple
            ];

            const emojiList = ['🎉', '✨', '🥳', '🏆', '💥', '🎈', '🌟', '👏', '👑'];

            class Rocket {
                constructor() {
                    this.x = Math.random() * width;
                    this.y = height;
                    this.tx = Math.random() * width;
                    this.ty = Math.random() * (height * 0.4) + height * 0.1;
                    this.speed = Math.random() * 4 + 7;
                    this.angle = Math.atan2(this.ty - this.y, this.tx - this.x);
                    this.vx = Math.cos(this.angle) * this.speed;
                    this.vy = Math.sin(this.angle) * this.speed;
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                }
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    // ascending sparkles trail
                    if (Math.random() < 0.45) {
                        particles.push(new Particle(this.x, this.y, this.color, true));
                    }
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                }
                shouldExplode() {
                    return this.y <= this.ty || this.vy >= 0;
                }
                explode() {
                    const count = Math.floor(Math.random() * 40) + 50; // denser bursts!
                    for (let i = 0; i < count; i++) {
                        particles.push(new Particle(this.x, this.y, this.color, false));
                    }
                }
            }

            class Particle {
                constructor(x, y, color, isTrail = false) {
                    this.x = x;
                    this.y = y;
                    this.isTrail = isTrail;
                    if (isTrail) {
                        this.vx = (Math.random() - 0.5) * 2;
                        this.vy = (Math.random() * 2); // drifts down slowly
                        this.decay = Math.random() * 0.05 + 0.03;
                    } else {
                        this.vx = (Math.random() - 0.5) * 12; // wider bursts!
                        this.vy = (Math.random() - 0.5) * 12 - 2;
                        this.decay = Math.random() * 0.015 + 0.008;
                    }
                    this.gravity = isTrail ? 0.02 : 0.15;
                    this.friction = 0.95;
                    this.color = color;
                    this.alpha = 1;
                    this.size = isTrail ? Math.random() * 1.5 + 1 : Math.random() * 3 + 2;
                }
                update() {
                    this.vx *= this.friction;
                    this.vy *= this.friction;
                    this.vy += this.gravity;
                    this.x += this.vx;
                    this.y += this.vy;
                    this.alpha -= this.decay;
                }
                draw() {
                    ctx.save();
                    ctx.globalAlpha = this.alpha;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    if (!this.isTrail) {
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = this.color;
                    }
                    ctx.fill();
                    ctx.restore();
                }
            }

            class ConfettiPiece {
                constructor() {
                    this.x = Math.random() * width;
                    this.y = -20;
                    this.size = Math.random() * 6 + 6;
                    this.color = colors[Math.floor(Math.random() * colors.length)];
                    this.speedY = Math.random() * 2 + 2;
                    this.speedX = Math.random() * 2 - 1;
                    this.rotation = Math.random() * 360;
                    this.rotationSpeed = Math.random() * 10 - 5;
                    this.wobble = Math.random() * 10;
                }
                update() {
                    this.y += this.speedY;
                    this.x += Math.sin(this.y / 30 + this.wobble) * 0.8 + this.speedX;
                    this.rotation += this.rotationSpeed;
                }
                draw() {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.rotation * Math.PI / 180);
                    ctx.fillStyle = this.color;
                    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                    ctx.restore();
                }
            }

            class FloatingEmoji {
                constructor() {
                    this.x = Math.random() * width;
                    this.y = height + 30;
                    this.text = emojiList[Math.floor(Math.random() * emojiList.length)];
                    this.speedY = Math.random() * 1.5 + 1.5;
                    this.size = Math.floor(Math.random() * 14) + 22;
                    this.alpha = 1;
                    this.wobble = Math.random() * 100;
                }
                update() {
                    this.y -= this.speedY;
                    this.x += Math.sin(this.y / 40 + this.wobble) * 0.5;
                    if (this.y < height * 0.3) {
                        this.alpha -= 0.015;
                    }
                }
                draw() {
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, this.alpha);
                    ctx.font = `${this.size}px Arial`;
                    ctx.fillText(this.text, this.x, this.y);
                    ctx.restore();
                }
            }

            let animationFrameId;
            let launchTimer = 0;
            
            function animate() {
                ctx.clearRect(0, 0, width, height);
                
                launchTimer++;
                // Higher rocket frequency!
                if (launchTimer % 15 === 0 && rockets.length < 8) {
                    rockets.push(new Rocket());
                }
                
                // Spawn confetti!
                if (launchTimer % 5 === 0 && confetti.length < 100) {
                    confetti.push(new ConfettiPiece());
                }

                // Spawn floating emojis!
                if (launchTimer % 25 === 0 && emojis.length < 15) {
                    emojis.push(new FloatingEmoji());
                }
                
                for (let i = rockets.length - 1; i >= 0; i--) {
                    rockets[i].update();
                    if (rockets[i].shouldExplode()) {
                        rockets[i].explode();
                        rockets.splice(i, 1);
                    }
                }
                
                for (let i = particles.length - 1; i >= 0; i--) {
                    particles[i].update();
                    if (particles[i].alpha <= 0) {
                        particles.splice(i, 1);
                    } else {
                        particles[i].draw();
                    }
                }

                for (let i = confetti.length - 1; i >= 0; i--) {
                    confetti[i].update();
                    if (confetti[i].y > height + 20) {
                        confetti.splice(i, 1);
                    } else {
                        confetti[i].draw();
                    }
                }

                for (let i = emojis.length - 1; i >= 0; i--) {
                    emojis[i].update();
                    if (emojis[i].y < -40 || emojis[i].alpha <= 0) {
                        emojis.splice(i, 1);
                    } else {
                        emojis[i].draw();
                    }
                }
                
                animationFrameId = requestAnimationFrame(animate);
            }
            
            animate();

            function dismiss() {
                modal.style.opacity = '0';
                wrapper.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    cancelAnimationFrame(animationFrameId);
                    modal.remove();
                    canvas.remove();
                }, 500);
            }

            document.getElementById('dismissCelebrationBtn').addEventListener('click', dismiss);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) dismiss();
            });
            setTimeout(dismiss, 12000); // dismiss after 12s of celebration
        }

        // --- On Page Load Initializations ---
        window.addEventListener('DOMContentLoaded', () => {
            // Start network animation
            initNetworkAnimation();

            // Assign chatbot DOM refs at module scope so helper functions can use them
            chatbotMessages = document.getElementById('chatbotMessages');
            chatbotInput    = document.getElementById('chatbotInput');

            const chatbotToggleBtn = document.getElementById('chatbotToggleBtn');
            const chatbotCloseBtn  = document.getElementById('chatbotCloseBtn');
            const chatbotPanel     = document.getElementById('chatbotPanel');
            const chatbotSendBtn   = document.getElementById('chatbotSendBtn');
            const chatbotTooltip   = document.getElementById('chatbotTooltip');

            if (chatbotToggleBtn) {
                chatbotToggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    chatbotPanel.classList.toggle('active');
                    if (chatbotPanel.classList.contains('active')) {
                        chatbotInput.focus();
                        if (chatbotTooltip) chatbotTooltip.style.opacity = '0';
                        chatbotToggleBtn.classList.remove('pulse');
                    }
                });
            }

            if (chatbotCloseBtn) {
                chatbotCloseBtn.addEventListener('click', () => {
                    chatbotPanel.classList.remove('active');
                });
            }

            if (chatbotSendBtn) chatbotSendBtn.addEventListener('click', handleSend);
            if (chatbotInput) chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSend();
            });

            // Initialize Voice Input if supported
            const chatbotMicBtn = document.getElementById('chatbotMicBtn');
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (chatbotMicBtn && SpeechRecognition) {
                chatbotMicBtn.style.display = 'flex';
                initSpeechRecognition();
                chatbotMicBtn.addEventListener('click', toggleSpeechRecognition);
            }

            // Load file list
            fetchUploadedFiles();

            // Load contacts database for chatbot RAG
            loadContactsDatabase();



            // Display success/error status toast from query parameters
            const urlParams = new URLSearchParams(window.location.search);
            const status = urlParams.get('status');
            const msg = urlParams.get('msg');
            if (status && msg) {
                const decodedMsg = decodeURIComponent(msg.replace(/\+/g, ' '));
                showToast(status, decodedMsg);
                
                // Clean browser history URL to prevent showing status alerts on page refreshes
                window.history.replaceState(null, null, window.location.pathname);
            }

            // --- Real-time Outages Monitor Panel ---
            const outagesList = document.getElementById("outages-list");
            const outageBadge = document.getElementById("outage-count-badge");
            const outagesTitle = document.getElementById("outages-title");
            const outagesHeader = document.getElementById("outages-card-header");
        
    // Tooltip Close Button Event
    const tooltipCloseBtn = document.getElementById("chatbotTooltipCloseBtn");
    if (tooltipCloseBtn) {
        tooltipCloseBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent opening the chat
            const tooltip = document.getElementById("chatbotTooltip");
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.style.display = 'none', 300);
            }
        });
    }
});
