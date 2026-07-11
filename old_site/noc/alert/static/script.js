// Fetch Interceptor for Static Deployment on GitHub Pages
(() => {
  const originalFetch = window.fetch;
  window.fetch = async function(url, options) {
    if (typeof url === 'string' && url.includes('api.php')) {
      const params = new URLSearchParams(url.split('?')[1] || '');
      const endpoint = params.get('endpoint');
      
      if (endpoint && endpoint.startsWith('status')) {
        return originalFetch('monitor_data.json');
      }
      if (endpoint && endpoint.startsWith('trigger-active-outages')) {
        return new Response(JSON.stringify({ success: true, active_outages: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (endpoint && endpoint.startsWith('hosts/ping')) {
        return new Response(JSON.stringify({ success: true, status: 'UP', latency_ms: Math.floor(Math.random() * 20) + 5 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (endpoint && endpoint.startsWith('hosts/mute')) {
        return new Response(JSON.stringify({ success: true, message: 'Host muted successfully' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (endpoint && endpoint.startsWith('diagnostics/tracert')) {
        const ip = params.get('ip') || '10.xx.xx.8';
        const hops = [
          `1  1ms  1ms  1ms  10.0.0.1`,
          `2  5ms  4ms  4ms  10.xx.xx.1`,
          `3  12ms  11ms  10ms  ${ip}`
        ];
        return new Response(JSON.stringify({ success: true, output: hops.join('\n') }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    return originalFetch(url, options);
  };
})();

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements Cache
    const shqGrid = document.getElementById("hosts-grid-shq");
    const dhqGrid = document.getElementById("hosts-grid-dhq");
    const intdGrid = document.getElementById("hosts-grid-intd");
    const intsGrid = document.getElementById("hosts-grid-ints");
    const upsGrid = document.getElementById("hosts-grid-ups");
    const apGrid = document.getElementById("hosts-grid-ap");
    const ssbGrid = document.getElementById("hosts-grid-ssb");
    const pacGrid = document.getElementById("hosts-grid-pac");
    const statTotal = document.getElementById("stat-total");
    const statUp = document.getElementById("stat-up");
    const statDown = document.getElementById("stat-down");
    const statUptime = document.getElementById("stat-uptime");
    const statTemp = document.getElementById("stat-temp");
    const lastCheckedTime = document.getElementById("last-checked-time");
    

    
    const terminalLogs = document.getElementById("terminal-logs");
    const whatsappLogs = document.getElementById("whatsapp-logs");
    const chkAutoscroll = document.getElementById("chk-autoscroll");
    const toastContainer = document.getElementById("toast-container");
    const clockElement = document.getElementById("digital-clock");
    const themeToggle = document.getElementById("theme-toggle");

    // Generate a unique session token for this browser tab to track active viewers
    const tabId = Math.random().toString(36).substring(2, 15);

    // Outage Alert Hover Trigger Logic
    let lastHoverTriggerTime = 0;
    const hoverBadge = document.getElementById("ticker-label-badge");

    if (hoverBadge) {
        hoverBadge.style.cursor = "pointer";
        hoverBadge.addEventListener("mouseenter", () => {
            const badgeText = hoverBadge.textContent || "";
            // Only trigger if there is an active outage (badge says "Outage Alerts")
            if (!badgeText.includes("Outage")) {
                return;
            }
            
            const now = Date.now();
            if (now - lastHoverTriggerTime < 15000) {
                console.log("Hover trigger cooldown active.");
                return; // 15-second cooldown
            }
            
            lastHoverTriggerTime = now;
            
            // Visual loading state
            const originalHTML = hoverBadge.innerHTML;
            const originalBG = hoverBadge.style.backgroundColor;
            
            hoverBadge.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Broadcasting WhatsApp...`;
            hoverBadge.style.backgroundColor = "#d97706"; // Saffron-orange loading
            
            fetch("api.php?endpoint=trigger-active-outages")
                .then(res => res.json())
                .then(data => {
                    console.log("Hover alerts dispatch response:", data);
                    hoverBadge.innerHTML = `<i class="fas fa-check-circle"></i> Alerts Dispatched`;
                    hoverBadge.style.backgroundColor = "#16a34a"; // Emerald-green success
                    
                    showToast(`WhatsApp alerts successfully broadcast to SIO and district engineers!`, "success");
                    
                    setTimeout(() => {
                        hoverBadge.innerHTML = originalHTML;
                        hoverBadge.style.backgroundColor = originalBG;
                    }, 4000);
                })
                .catch(err => {
                    console.error("Failed to trigger hover alerts:", err);
                    showToast("Failed to dispatch WhatsApp alerts.", "error");
                    hoverBadge.innerHTML = originalHTML;
                    hoverBadge.style.backgroundColor = originalBG;
                });
        });
    }

    // Search and Filters
    const inputSearch = document.getElementById("input-search");
    const filterButtons = document.querySelectorAll(".filter-btn");
    
    // Modal Elements
    const diagnosticsModal = document.getElementById("diagnostics-modal");
    const modalClose = document.getElementById("modal-close");
    const modalStatusBadge = document.getElementById("modal-status-badge");
    const modalTitleDesc = document.getElementById("modal-title-desc");
    const modalTitleIp = document.getElementById("modal-title-ip");
    const modalStatLatency = document.getElementById("modal-stat-latency");
    const modalStatLastPing = document.getElementById("modal-stat-last-ping");
    const modalStatMonitoring = document.getElementById("modal-stat-monitoring");

    // Tabs switcher for Logs Card
    const tabButtons = document.querySelectorAll(".log-tab-btn");
    if (tabButtons && terminalLogs && whatsappLogs) {
        tabButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                tabButtons.forEach(b => {
                    b.classList.remove("active");
                    b.style.color = "var(--text-muted)";
                    b.style.borderBottomColor = "transparent";
                });
                
                btn.classList.add("active");
                btn.style.color = "var(--text-primary)";
                btn.style.borderBottomColor = "var(--accent)";
                
                const activeTab = btn.dataset.tab;
                if (activeTab === "system") {
                    terminalLogs.style.display = "block";
                    whatsappLogs.style.display = "none";
                } else {
                    terminalLogs.style.display = "none";
                    whatsappLogs.style.display = "block";
                }
            });
        });
    }
    const modalSparklineHistory = document.getElementById("modal-sparkline-history");
    const modalConsoleStdout = document.getElementById("modal-console-stdout");
    
    const modalBtnPing = document.getElementById("modal-btn-ping");
    const modalBtnMute = document.getElementById("modal-btn-mute");
    const modalBtnTracert = document.getElementById("modal-btn-tracert");

    // Local Variables
    let currentHostsState = {};
    let allHostsData = [];
    let activeHostIp = null;
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    window.searchQuery = searchParam ? searchParam.trim() : "";
    if (searchParam) {
        inputSearch.value = searchParam.trim();
    }
    window.activeFilter = "all";
    let chartInstance = null;
    let isFirstLoad = true;

    // ==========================================
    // Voice Alert Engine (Web Speech API)
    // ==========================================
    let voiceAlertsEnabled = localStorage.getItem('voiceAlerts') === 'true';
    let selectedGender = localStorage.getItem('voiceGender') || 'female';
    let selectedSpeed = parseFloat(localStorage.getItem('voiceSpeed') || '1.0');
    let previousHostStates = {}; // Tracks IP -> status for transition detection
    let voiceInitialized = false; // Skip first cycle announcements
    const speechQueue = []; // Queue for sequential announcements
    let isSpeaking = false;
    let availableVoices = [];

    const voiceToggleBtn = document.getElementById('voice-alert-toggle');
    const voiceIcon = document.getElementById('voice-alert-icon');
    const voiceLabel = document.getElementById('voice-alert-label');
    const voiceGenderSelector = document.getElementById('voice-gender-selector');
    const voiceBtnFemale = document.getElementById('voice-btn-female');
    const voiceBtnMale = document.getElementById('voice-btn-male');
    const voiceBtnSpeed = document.getElementById('voice-btn-speed');

    // Load available system voices
    function loadVoices() {
        availableVoices = window.speechSynthesis.getVoices();
    }
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Clean description specifically for Text-to-Speech (TTS) pronunciation
    function cleanDescriptionForSpeech(desc) {
        if (!desc) return '';
        let speechText = desc;
        
        // Expand abbreviations common in NIC NOC
        speechText = speechText.replace(/\bW\.(?=\w)/gi, 'West ');
        speechText = speechText.replace(/\bE\.(?=\w)/gi, 'East ');
        speechText = speechText.replace(/\bW\.Champaran\b/gi, 'West Champaran');
        speechText = speechText.replace(/\bE\.Champaran\b/gi, 'East Champaran');
        
        // Normalize word separations (replace underscores, slashes, dashes with spaces)
        speechText = speechText.replace(/[_\-\/]+/g, ' ');
        
        // Map common technical acronyms to spoken words
        speechText = speechText.replace(/\b(ASR1002|ASR1001|ASR)\b/gi, 'Router');
        
        // Remove specific tech specs/model numbers that sound ugly in TTS
        speechText = speechText.replace(/\b(2960X|2960S|2960|3560|3750|3850|9200|9300|C2960|2960plus|MX480|MX960|EX4300|EX4200)\b/gi, '');
        
        // Remove extra spaces
        speechText = speechText.replace(/\s+/g, ' ').trim();
        
        return speechText;
    }

    // Find best matching voice for the selected gender, prioritizing Indian accents for local names
    function getVoiceForGender(gender) {
        if (availableVoices.length === 0) return null;

        // Native / high quality Indian and English voices
        const femalePatterns = ['heera', 'neerja', 'kalpana', 'veena', 'swara', 'madhur', 'zira', 'female', 'woman', 'susan', 'hazel', 'linda', 'samantha', 'victoria', 'karen', 'moira', 'fiona', 'google us english', 'google uk english female'];
        const malePatterns = ['ravi', 'hemant', 'rishi', 'harsh', 'david', 'male', 'man', 'mark', 'james', 'daniel', 'richard', 'alex', 'fred', 'google uk english male'];

        const patterns = gender === 'female' ? femalePatterns : malePatterns;

        // 1. Try to find en-IN (Indian English) or hi-IN (Hindi) voice matching the gender patterns first
        // This gives the absolute best pronunciation for Indian district names (like Madhubani, Buxar, etc.)
        for (const pattern of patterns) {
            const match = availableVoices.find(v =>
                v.name.toLowerCase().includes(pattern) && 
                (v.lang.startsWith('en-IN') || v.lang.startsWith('hi-IN'))
            );
            if (match) return match;
        }

        // 2. Try any en-IN or hi-IN voice matching the gender
        const localVoices = availableVoices.filter(v => v.lang.startsWith('en-IN') || v.lang.startsWith('hi-IN'));
        if (localVoices.length > 0) {
            const match = localVoices.find(v => {
                const name = v.name.toLowerCase();
                if (gender === 'female') {
                    return name.includes('female') || name.includes('heera') || name.includes('neerja') || name.includes('kalpana') || name.includes('veena') || name.includes('swara') || name.includes('madhur');
                } else {
                    return name.includes('male') || name.includes('ravi') || name.includes('hemant') || name.includes('rishi') || name.includes('harsh');
                }
            });
            if (match) return match;
            return localVoices[0]; // fallback to first local voice
        }

        // 3. Try standard English (US/UK) voices matching the gender pattern
        for (const pattern of patterns) {
            const match = availableVoices.find(v =>
                v.name.toLowerCase().includes(pattern) && v.lang.startsWith('en')
            );
            if (match) return match;
        }

        // 4. Try any English voice
        const enVoices = availableVoices.filter(v => v.lang.startsWith('en'));
        if (enVoices.length > 0) {
            if (gender === 'male' && enVoices.length > 1) {
                const maleVoice = enVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('rishi'));
                return maleVoice || enVoices[1];
            }
            return enVoices[0];
        }

        // 5. Fallback to first available voice
        return availableVoices[0];
    }

    function updateVoiceToggleUI() {
        if (voiceAlertsEnabled) {
            voiceToggleBtn.classList.add('voice-active');
            voiceIcon.className = 'fas fa-volume-up';
            voiceLabel.textContent = 'Voice On';
            voiceGenderSelector.classList.add('enabled');
        } else {
            voiceToggleBtn.classList.remove('voice-active');
            voiceIcon.className = 'fas fa-volume-mute';
            voiceLabel.textContent = 'Voice Off';
            voiceGenderSelector.classList.remove('enabled');
        }
    }

    function updateGenderUI() {
        voiceBtnFemale.classList.toggle('active', selectedGender === 'female');
        voiceBtnMale.classList.toggle('active', selectedGender === 'male');
    }

    function updateSpeedUI() {
        voiceBtnSpeed.textContent = selectedSpeed.toFixed(2) === '0.85' ? '0.8x' : selectedSpeed.toFixed(1) + 'x';
        voiceBtnSpeed.title = `Voice Speed: ${selectedSpeed.toFixed(2)}x (Click to cycle)`;
    }

    updateVoiceToggleUI();
    updateGenderUI();
    updateSpeedUI();

    voiceToggleBtn.addEventListener('click', () => {
        voiceAlertsEnabled = !voiceAlertsEnabled;
        localStorage.setItem('voiceAlerts', voiceAlertsEnabled);
        updateVoiceToggleUI();
        
        if (voiceAlertsEnabled) {
            speakAlert('Voice alerts activated. You will now hear real-time link status announcements.');
            showToast('🔊 Voice Alerts Enabled', 'success');
        } else {
            window.speechSynthesis.cancel();
            speechQueue.length = 0;
            isSpeaking = false;
            showToast('🔇 Voice Alerts Disabled', 'info');
        }
    });

    // Gender button click handlers
    voiceBtnFemale.addEventListener('click', () => {
        if (selectedGender === 'female') return;
        selectedGender = 'female';
        localStorage.setItem('voiceGender', 'female');
        updateGenderUI();
        speakAlert('Female voice selected.');
        showToast('♀ Female Voice Selected', 'info');
    });

    voiceBtnMale.addEventListener('click', () => {
        if (selectedGender === 'male') return;
        selectedGender = 'male';
        localStorage.setItem('voiceGender', 'male');
        updateGenderUI();
        speakAlert('Male voice selected.');
        showToast('♂ Male Voice Selected', 'info');
    });

    // Speed toggle click handler
    voiceBtnSpeed.addEventListener('click', () => {
        const speeds = [1.0, 1.25, 1.5, 0.85];
        let nextIdx = (speeds.indexOf(selectedSpeed) + 1) % speeds.length;
        if (nextIdx === -1) nextIdx = 0;
        selectedSpeed = speeds[nextIdx];
        localStorage.setItem('voiceSpeed', selectedSpeed);
        updateSpeedUI();
        speakAlert(`Speed set to ${selectedSpeed}x`);
        showToast(`⚡ Voice Speed: ${selectedSpeed}x`, 'info');
    });

    function speakAlert(text) {
        if (!voiceAlertsEnabled || !('speechSynthesis' in window)) return;
        speechQueue.push(text);
        processQueue();
    }

    function processQueue() {
        if (isSpeaking || speechQueue.length === 0) return;
        isSpeaking = true;
        const text = speechQueue.shift();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = selectedSpeed;
        utterance.volume = 1.0;
        utterance.lang = 'en-IN';

        // Set gender-specific voice and pitch
        const voice = getVoiceForGender(selectedGender);
        if (voice) {
            utterance.voice = voice;
        }
        utterance.pitch = selectedGender === 'female' ? 1.1 : 0.85;

        utterance.onend = () => {
            isSpeaking = false;
            processQueue();
        };
        utterance.onerror = () => {
            isSpeaking = false;
            processQueue();
        };
        window.speechSynthesis.speak(utterance);
    }

    function detectStateTransitions(hosts) {
        if (!voiceInitialized) {
            // First cycle: just record states, don't announce
            hosts.forEach(h => { previousHostStates[h.ip] = h.status; });
            voiceInitialized = true;
            return;
        }

        const downTransitions = [];
        const upTransitions = [];

        hosts.forEach(h => {
            const prevStatus = previousHostStates[h.ip];
            if (prevStatus && prevStatus !== h.status && h.category !== 'SSB') {
                if (h.status === 'DOWN') {
                    downTransitions.push(h.description);
                } else if (h.status === 'UP') {
                    upTransitions.push(h.description);
                }
            }
            previousHostStates[h.ip] = h.status;
        });

        // Announce DOWN transitions with clean speech pronunciation
        downTransitions.forEach(desc => {
            const cleanDesc = cleanDescriptionForSpeech(desc);
            speakAlert(`Alert! Link down. ${cleanDesc} is now offline. Please check the device.`);
        });

        // Announce UP transitions with clean speech pronunciation
        upTransitions.forEach(desc => {
            const cleanDesc = cleanDescriptionForSpeech(desc);
            speakAlert(`Link recovered. ${cleanDesc} is now back online.`);
        });
    }

    // Clock
    function updateClock() {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString();
    }
    updateClock();
    setInterval(updateClock, 1000);

    // Toast System
    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        
        let icon = "info-circle";
        if (type === "success") icon = "check-circle";
        if (type === "error") icon = "exclamation-triangle";
        if (type === "warning") icon = "bell-slash";
        
        toast.innerHTML = `<i class="fas fa-${icon}"></i><span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(100%)";
            toast.style.transition = "all 0.4s ease";
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // Chart.js Init
    function initChart() {
        const ctx = document.getElementById("uptimeChart").getContext("2d");
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Online',
                    data: [],
                    borderColor: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 2,
                    pointBackgroundColor: '#38bdf8'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#64748b', font: { size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.04)' },
                        ticks: { color: '#64748b', font: { size: 10 }, stepSize: 1 }
                    }
                }
            }
        });
    }
    initChart();

    function updateChart(history) {
        if (!chartInstance || !history) return;
        
        chartInstance.data.labels = history.map(h => h.time);
        chartInstance.data.datasets[0].data = history.map(h => h.up);
        chartInstance.update();
    }

    // Log Formatter
    function formatLogLine(line) {
        const lineEl = document.createElement("div");
        lineEl.className = "terminal-line";
        
        // Extract time and level: 2026-06-30 12:00:00 - INFO - Message
        const match = line.match(/^(\d{4}-\d{2}-\d{2}\s+)?(\d{2}:\d{2}:\d{2})\s*-\s*([A-Za-z]+)\s*-\s*(.*)$/);
        
        if (match) {
            const time = match[2];
            const level = match[3];
            const msg = match[4];
            
            const levelClass = level.toLowerCase();
            lineEl.innerHTML = `<span class="log-timestamp">[${time}]</span><span class="log-level ${levelClass}">${level}</span><span class="log-message">${msg}</span>`;
        } else {
            lineEl.textContent = line;
        }
        
        return lineEl;
    }

    // Update Stats
    function updateStats(stats, hosts = []) {
        statTotal.textContent = stats.total || 0;
        statUp.textContent = stats.up || 0;
        statDown.textContent = stats.down || 0;
        statUptime.textContent = stats.uptime_ratio || "0%";
        
        if (statTemp) {
            let upsTemps = [];
            let pacTemps = [];
            let batteryStatuses = [];
            hosts.forEach(h => {
                if (h.temp !== undefined && h.temp !== null) {
                    let tempNum = parseFloat(h.temp);
                    if (!isNaN(tempNum)) {
                        if (h.category === "UPS") upsTemps.push(`${tempNum}°C`);
                        if (h.category === "PAC") pacTemps.push(`${tempNum}°C`);
                    }
                }
                if (h.battery_status !== undefined && h.battery_status !== null) {
                    let label = "";
                    if (h.ip === "10.133.15.42") label = "<span style='color:var(--text-muted); font-weight: 600; font-size: 10px; display: inline-block; width: 55px;'>Legrand</span>";
                    else if (h.ip === "10.133.15.45") label = "<span style='color:var(--text-muted); font-weight: 600; font-size: 10px; display: inline-block; width: 55px;'>Delta</span>";
                    
                    let batText = label + (h.battery_status == 2 ? "<span style='color:var(--color-up);'>Normal</span>" : 
                                  h.battery_status == 3 ? "<span style='color:var(--color-warning);'>Low</span>" : 
                                  h.battery_status == 4 ? "<span style='color:var(--color-down);'>Depleted</span>" : "<span style='color:var(--text-muted);'>Unknown</span>");
                    batteryStatuses.push(batText);
                }
            });
            
            let html = '<div style="display: flex; flex-direction: column; gap: 8px; width: 100%; min-width: 170px; padding: 2px 0;">';
            
            let camTempStr = "";
            hosts.forEach(h => {
                if (h.ip === "10.133.15.18" && h.temp !== undefined) {
                    camTempStr = h.temp;
                }
            });
            
            if (camTempStr !== "" || upsTemps.length > 0 || pacTemps.length > 0) {
                html += '<div style="display: flex; flex-direction: column; gap: 6px;">';
                if (camTempStr !== "") {
                    html += `<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">`;
                    html += `<div style="display: flex; flex-direction: column;">`;
                    html += `<span style="font-size: 10.5px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px;">Room Temp</span>`;
                    html += `<span style="font-size: 8px; color: var(--color-up); font-weight: 600; text-transform: uppercase; letter-spacing: 0.2px; margin-top: 1px; display: inline-flex; align-items: center; gap: 3px;"><i class="fas fa-camera" style="font-size: 7.5px;"></i> Server Room Camera OCR</span>`;
                    html += `</div>`;
                    html += `<span style="font-size: 13.5px; color: var(--color-warning); font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">`;
                    html += `<span class="pulse-green" style="display: inline-block;"></span>`;
                    html += `${camTempStr}&deg;C</span></div>`;
                }
                if (upsTemps.length > 0) {
                    html += `<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;"><span style="font-size: 10.5px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; margin-top: 1px;">UPS Temps</span> <span style="font-size: 12.5px; color: var(--text-primary); font-weight: 700; text-align: right; line-height: 1.3;">${upsTemps.join(', ')}</span></div>`;
                }
                if (pacTemps.length > 0) {
                    html += `<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;"><span style="font-size: 10.5px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; margin-top: 1px;">PAC Temps</span> <span style="font-size: 12.5px; color: var(--text-primary); font-weight: 700; text-align: right; line-height: 1.3;">${pacTemps.join(', ')}</span></div>`;
                }
                html += '</div>';
            }
            
            if (batteryStatuses.length > 0) {
                html += '<div style="border-top: 1px solid var(--border-color); margin-top: 6px; padding-top: 8px; display: flex; flex-direction: column; gap: 6px;">';
                html += `<div style="font-size: 10.5px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px;">Battery Status</div>`;
                batteryStatuses.forEach(b => {
                    html += `<div style="font-size: 12px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; width: 100%;">${b}</div>`;
                });
                html += '</div>';
            }
            
            html += '</div>';
            statTemp.innerHTML = (camTempStr !== "" || upsTemps.length > 0 || pacTemps.length > 0 || batteryStatuses.length > 0) ? html : "--";
        }
    }

    // Update Horizontal Ticker & Sidebar Outages Panel
    function updateOutagesPanels(hosts) {
        const downHosts = hosts.filter(h => h.status === "DOWN" && h.category !== "SSB");
        
        const tickerContent = document.getElementById("ticker-marquee-content");
        const tickerBannerBar = document.getElementById("ticker-banner-bar");
        const tickerBadge = document.getElementById("ticker-label-badge");
        const sideSummary = document.getElementById("down-links-summary");
        const sideList = document.getElementById("side-down-links-list");
        const sideLabel = document.getElementById("side-ticker-label");

        if (downHosts.length > 0) {
            const outageStr = downHosts.map(h => `${h.description} (${h.ip})`).join("  •  ");
            tickerContent.innerHTML = `<span style="color: #f43f5e; font-weight: 700;">🚨 CRITICAL OUTAGE ALERT:</span> ${outageStr}  •  Please check affected devices and verify connectivity immediately.`;
            tickerBadge.style.backgroundColor = "#e11d48";
            tickerBadge.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Outage Alerts`;
            tickerBannerBar.style.display = "flex";

            // Update Sidebar Card
            sideLabel.style.backgroundColor = "#e11d48";
            sideSummary.textContent = `${downHosts.length} Active Outage${downHosts.length > 1 ? 's' : ''}`;
            sideSummary.style.color = "var(--color-down)";
            
            sideList.innerHTML = downHosts.map(h => `
                <div class="side-outage-item" style="display: flex; justify-content: space-between; align-items: center; background: rgba(244, 63, 94, 0.05); border: 1px solid rgba(244, 63, 94, 0.15); border-radius: 8px; padding: 10px 12px; transition: all 0.2s;">
                    <div style="min-width: 0; flex-grow: 1; padding-right: 8px;">
                        <div style="font-weight: 700; font-size: 11px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${h.description}">${h.description}</div>
                        <div style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); margin-top: 2px;">${h.ip}</div>
                    </div>
                    <button onclick="openHostModal('${h.ip}')" onmouseenter="this.style.opacity=0.85" onmouseleave="this.style.opacity=1" style="padding: 6px 12px; font-size: 10px; background: var(--color-down); color: #ffffff; border-radius: 6px; border: none; cursor: pointer; font-weight: 700; white-space: nowrap; width: auto; font-family: var(--font-title); transition: opacity 0.2s;">
                        Diagnose
                    </button>
                </div>
            `).join('');
        } else {
            tickerContent.innerHTML = `<span style="color: #10b981; font-weight: 700;">🟢 ALL SYSTEMS OPERATIONAL:</span> Monitoring 117 Bihar NOC network nodes in real-time. No active outages detected.`;
            tickerBadge.style.backgroundColor = "var(--accent-saffron)";
            tickerBadge.innerHTML = `<i class="fas fa-bullhorn"></i> Advisory Alerts`;
            tickerBannerBar.style.display = "none";

            // Update Sidebar Card
            sideLabel.style.backgroundColor = "var(--accent-saffron)";
            sideSummary.textContent = "All UP";
            sideSummary.style.color = "var(--color-up)";
            
            sideList.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 16px 0; font-size: 0.85rem;">
                    <i class="fas fa-check-circle" style="color: var(--color-up); font-size: 1.5rem; margin-bottom: 8px; display: block;"></i>
                    All systems normal. No down links.
                </div>
            `;
        }
    }

    // Modal Details Renderer
    function openHostModal(hostIp) {
        activeHostIp = hostIp;
        const host = allHostsData.find(h => h.ip === hostIp);
        if (!host) return;

        // Header Title
        modalTitleDesc.textContent = host.description;
        modalTitleIp.textContent = host.ip;
        
        // Status Badge
        modalStatusBadge.textContent = host.status === "UP" ? "Online" : "Offline";
        modalStatusBadge.className = `modal-badge-status ${host.status.toLowerCase()}`;
        if (host.muted) {
            modalStatusBadge.textContent = "Muted";
            modalStatusBadge.className = "modal-badge-status muted";
        }

        // Stats Box Info
        modalStatLatency.textContent = host.status === "UP" ? `${host.latency !== null ? host.latency + ' ms' : '< 1 ms'}` : "--";
        modalStatLatency.style.color = host.status === "UP" ? "var(--color-up)" : "var(--color-down)";
        modalStatLastPing.textContent = host.last_ping_time.split(" ")[1] || "--:--:--";
        modalStatMonitoring.textContent = host.muted ? "Muted" : "Active";
        modalStatMonitoring.className = `box-val ${host.muted ? 'text-warning' : 'text-success'}`;

        // Mute button highlight
        if (host.muted) {
            modalBtnMute.classList.add("active-mute");
            modalBtnMute.innerHTML = `<i class="fas fa-bell"></i> Unmute Alerts`;
        } else {
            modalBtnMute.classList.remove("active-mute");
            modalBtnMute.innerHTML = `<i class="fas fa-bell-slash"></i> Mute Alerts`;
        }

        // Sparklines History
        modalSparklineHistory.innerHTML = "";
        const history = host.ping_history || [];
        // Fill up to 10 dots
        const paddingCount = 10 - history.length;
        for (let i = 0; i < paddingCount; i++) {
            const spark = document.createElement("div");
            spark.className = "sparkline-dot-item none";
            modalSparklineHistory.appendChild(spark);
        }
        history.forEach(state => {
            const spark = document.createElement("div");
            spark.className = `sparkline-dot-item ${state.toLowerCase()}`;
            spark.title = state === "UP" ? "Ping Successful" : "Ping Timeout / Failed";
            modalSparklineHistory.appendChild(spark);
        });

        // Stdout display
        modalConsoleStdout.textContent = host.last_stdout || "No stdout captured yet.";
        modalConsoleStdout.scrollTop = 0;

        diagnosticsModal.classList.add("open");
    }

    // Expose globally for inline onclick handlers in sidebar/notifications
    window.openHostModal = openHostModal;

    function closeHostModal() {
        diagnosticsModal.classList.remove("open");
        activeHostIp = null;
    }

    modalClose.addEventListener("click", closeHostModal);
    diagnosticsModal.addEventListener("click", (e) => {
        if (e.target === diagnosticsModal) closeHostModal();
    });

    // Helper to generate a host card node
    function createHostCard(host) {
        const card = document.createElement("div");
        card.id = `host-card-${host.ip.replace(/\./g, "-")}`;
        card.className = `host-card ${host.status === "UP" ? "up-state" : "down-state"} ${host.muted ? 'muted-state' : ''}`;
        
        let sparksHtml = "";
        const history = host.ping_history || [];
        history.slice(-5).forEach(state => {
            sparksHtml += `<span class="spark-dot ${state.toLowerCase()}"></span>`;
        });

        let tempHtml = "";
        if ((host.category === "UPS" || host.category === "PAC") && host.temp !== undefined && host.temp !== null) {
            const tempColor = host.temp >= 35 ? "color: #f43f5e;" : "color: #f59e0b;";
            tempHtml = `<div class="card-temp-badge" style="font-size: 11px; margin-left: 8px; ${tempColor}"><i class="fas fa-thermometer-half"></i> ${host.temp} &deg;C</div>`;
        }

        card.innerHTML = `
            ${host.muted ? '<span class="mute-card-tag"><i class="fas fa-bell-slash"></i> Muted</span>' : ''}
            <div class="card-top-row">
                <div class="card-title-area">
                    <span class="card-ip">${host.ip}</span>
                    <span class="card-desc" title="${host.description}">${host.description}</span>
                </div>
                <span class="card-status-pill">${host.status}</span>
            </div>
            <div class="card-mid-row">
                <div style="display:flex; align-items:center;">
                    <div class="card-latency-badge">
                        <i class="fas fa-bolt"></i>
                        <span class="latency-value">${host.status === "UP" ? (host.latency !== null ? host.latency + ' ms' : '< 1 ms') : '--'}</span>
                    </div>
                    ${tempHtml}
                </div>
                <div class="spark-dots">
                    ${sparksHtml}
                </div>
            </div>
        `;
        
        card.addEventListener("click", () => openHostModal(host.ip));
        return card;
    }

    // Helper to cache host state
    function saveHostState(host) {
        currentHostsState[host.ip] = {
            status: host.status,
            latency: host.latency,
            muted: host.muted
        };
    }

    // Helper to update section counts
    function updateSectionBadges(shqHosts, dhqHosts, intdHosts, intsHosts, upsHosts, apHosts, ssbHosts, pacHosts) {
        const shqOnline = shqHosts.filter(h => h.status === "UP").length;
        const dhqOnline = dhqHosts.filter(h => h.status === "UP").length;
        const intdOnline = intdHosts ? intdHosts.filter(h => h.status === "UP").length : 0;
        const intsOnline = intsHosts ? intsHosts.filter(h => h.status === "UP").length : 0;
        const upsOnline = upsHosts ? upsHosts.filter(h => h.status === "UP").length : 0;
        const apOnline = apHosts ? apHosts.filter(h => h.status === "UP").length : 0;
        const ssbOnline = ssbHosts ? ssbHosts.filter(h => h.status === "UP").length : 0;
        const pacOnline = pacHosts ? pacHosts.filter(h => h.status === "UP").length : 0;
        
        const shqBadge = document.getElementById("shq-badge");
        const dhqBadge = document.getElementById("dhq-badge");
        const intdBadge = document.getElementById("intd-badge");
        const intsBadge = document.getElementById("ints-badge");
        const upsBadge = document.getElementById("ups-badge");
        const apBadge = document.getElementById("ap-badge");
        const ssbBadge = document.getElementById("ssb-badge");
        const pacBadge = document.getElementById("pac-badge");
        
        if (shqBadge) shqBadge.textContent = `${shqOnline} / ${shqHosts.length} Online`;
        if (dhqBadge) dhqBadge.textContent = `${dhqOnline} / ${dhqHosts.length} Online`;
        if (intdBadge && intdHosts) intdBadge.textContent = `${intdOnline} / ${intdHosts.length} Online`;
        if (intsBadge && intsHosts) intsBadge.textContent = `${intsOnline} / ${intsHosts.length} Online`;
        if (upsBadge && upsHosts) upsBadge.textContent = `${upsOnline} / ${upsHosts.length} Online`;
        if (apBadge && apHosts) apBadge.textContent = `${apOnline} / ${apHosts.length} Online`;
        if (ssbBadge && ssbHosts) ssbBadge.textContent = `${ssbOnline} / ${ssbHosts.length} Online`;
        if (pacBadge && pacHosts) pacBadge.textContent = `${pacOnline} / ${pacHosts.length} Online`;
    }

    // Render Host Grids (Smooth, updates in-place)
    function renderHostsGrid(hosts) {
        allHostsData = hosts;

        const shqHosts = hosts.filter(h => h.category === "SHQ");
        const dhqHosts = hosts.filter(h => h.category === "DHQ" || (!h.category && h.category !== "INTD" && h.category !== "INTS" && h.category !== "UPS" && h.category !== "AP" && h.category !== "SSB" && h.category !== "PAC"));
        const intdHosts = hosts.filter(h => h.category === "INTD");
        const intsHosts = hosts.filter(h => h.category === "INTS");
        const upsHosts = hosts.filter(h => h.category === "UPS");
        const apHosts = hosts.filter(h => h.category === "AP");
        const ssbHosts = hosts.filter(h => h.category === "SSB");
        const pacHosts = hosts.filter(h => h.category === "PAC");

        // If card count differs or first load, rebuild DOM
        const shqCountMatches = shqGrid ? shqGrid.querySelectorAll(".host-card").length === shqHosts.length : false;
        const dhqCountMatches = dhqGrid ? dhqGrid.querySelectorAll(".host-card").length === dhqHosts.length : false;
        const intdCountMatches = intdGrid ? intdGrid.querySelectorAll(".host-card").length === intdHosts.length : false;
        const intsCountMatches = intsGrid ? intsGrid.querySelectorAll(".host-card").length === intsHosts.length : false;
        const upsCountMatches = upsGrid ? upsGrid.querySelectorAll(".host-card").length === upsHosts.length : false;
        const apCountMatches = apGrid ? apGrid.querySelectorAll(".host-card").length === apHosts.length : false;
        const ssbCountMatches = ssbGrid ? ssbGrid.querySelectorAll(".host-card").length === ssbHosts.length : false;
        const pacCountMatches = pacGrid ? pacGrid.querySelectorAll(".host-card").length === pacHosts.length : false;

        if (!shqCountMatches || !dhqCountMatches || !intdCountMatches || !intsCountMatches || !upsCountMatches || !apCountMatches || !ssbCountMatches || !pacCountMatches) {
            if (shqGrid) shqGrid.innerHTML = "";
            if (dhqGrid) dhqGrid.innerHTML = "";
            if (intdGrid) intdGrid.innerHTML = "";
            if (intsGrid) intsGrid.innerHTML = "";
            if (upsGrid) upsGrid.innerHTML = "";
            if (apGrid) apGrid.innerHTML = "";
            if (ssbGrid) ssbGrid.innerHTML = "";
            if (pacGrid) pacGrid.innerHTML = "";
            currentHostsState = {};
            
            shqHosts.forEach(host => {
                const card = createHostCard(host);
                if (shqGrid) shqGrid.appendChild(card);
                saveHostState(host);
            });

            dhqHosts.forEach(host => {
                const card = createHostCard(host);
                if (dhqGrid) dhqGrid.appendChild(card);
                saveHostState(host);
            });

            intdHosts.forEach(host => {
                const card = createHostCard(host);
                if (intdGrid) intdGrid.appendChild(card);
                saveHostState(host);
            });

            intsHosts.forEach(host => {
                const card = createHostCard(host);
                if (intsGrid) intsGrid.appendChild(card);
                saveHostState(host);
            });

            upsHosts.forEach(host => {
                const card = createHostCard(host);
                if (upsGrid) upsGrid.appendChild(card);
                saveHostState(host);
            });

            apHosts.forEach(host => {
                const card = createHostCard(host);
                if (apGrid) apGrid.appendChild(card);
                saveHostState(host);
            });

            ssbHosts.forEach(host => {
                const card = createHostCard(host);
                if (ssbGrid) ssbGrid.appendChild(card);
                saveHostState(host);
            });

            pacHosts.forEach(host => {
                const card = createHostCard(host);
                if (pacGrid) pacGrid.appendChild(card);
                saveHostState(host);
            });

            updateSectionBadges(shqHosts, dhqHosts, intdHosts, intsHosts, upsHosts, apHosts, ssbHosts, pacHosts);
            applyFiltersAndSearch();
            return;
        }

        // Otherwise update DOM nodes in-place to avoid layout flickering
        hosts.forEach(host => {
            const cardId = `host-card-${host.ip.replace(/\./g, "-")}`;
            const card = document.getElementById(cardId);
            if (!card) return;

            const prev = currentHostsState[host.ip] || {};
            
            // Check status transition toasts
            if (prev.status !== host.status) {
                if (host.status === "UP") {
                    showToast(`${host.description} (${host.ip}) came back online.`, "success");
                } else {
                    if (!host.muted) {
                        showToast(`${host.description} (${host.ip}) went offline!`, "error");
                    } else {
                        showToast(`${host.description} (${host.ip}) went offline (Alert Muted).`, "warning");
                    }
                }
            }

            // Update card content if state variables changed
            if (prev.status !== host.status || prev.latency !== host.latency || prev.muted !== host.muted || prev.temp !== host.temp) {
                card.className = `host-card ${host.status === "UP" ? "up-state" : "down-state"} ${host.muted ? 'muted-state' : ''}`;
                
                let sparksHtml = "";
                const history = host.ping_history || [];
                history.slice(-5).forEach(state => {
                    sparksHtml += `<span class="spark-dot ${state.toLowerCase()}"></span>`;
                });

                let tempHtml = "";
                if ((host.category === "UPS" || host.category === "PAC") && host.temp !== undefined && host.temp !== null) {
                    const tempColor = host.temp >= 35 ? "color: #f43f5e;" : "color: #f59e0b;";
                    tempHtml = `<div class="card-temp-badge" style="font-size: 11px; margin-left: 8px; ${tempColor}"><i class="fas fa-thermometer-half"></i> ${host.temp} &deg;C</div>`;
                }

                card.innerHTML = `
                    ${host.muted ? '<span class="mute-card-tag"><i class="fas fa-bell-slash"></i> Muted</span>' : ''}
                    <div class="card-top-row">
                        <div class="card-title-area">
                            <span class="card-ip">${host.ip}</span>
                            <span class="card-desc" title="${host.description}">${host.description}</span>
                        </div>
                        <span class="card-status-pill">${host.status}</span>
                    </div>
                    <div class="card-mid-row">
                        <div style="display:flex; align-items:center;">
                            <div class="card-latency-badge">
                                <i class="fas fa-bolt"></i>
                                <span class="latency-value">${host.status === "UP" ? (host.latency !== null ? host.latency + ' ms' : '< 1 ms') : '--'}</span>
                            </div>
                            ${tempHtml}
                        </div>
                        <div class="spark-dots">
                            ${sparksHtml}
                        </div>
                    </div>
                `;
                
                saveHostState(host);
            }
        });

        // Always update online/offline badge statistics based on active lists
        updateSectionBadges(shqHosts, dhqHosts, intdHosts, intsHosts, upsHosts, apHosts, ssbHosts, pacHosts);

        // If the modal is currently open for a host, update the modal dynamically
        if (activeHostIp) {
            openHostModal(activeHostIp);
        }

        applyFiltersAndSearch();
    }

    // Client-side search and filters mapping
    function applyFiltersAndSearch() {
        allHostsData.forEach(host => {
            const cardId = `host-card-${host.ip.replace(/\./g, "-")}`;
            const card = document.getElementById(cardId);
            if (!card) return;

            // Search filter match
            const matchesSearch = 
                host.ip.includes(window.searchQuery) || 
                host.description.toLowerCase().includes(window.searchQuery.toLowerCase());
            
            // Status filter match
            let matchesFilter = false;
            if (window.activeFilter === "all") matchesFilter = true;
            else if (window.activeFilter === "up" && host.status === "UP") matchesFilter = true;
            else if (window.activeFilter === "down" && host.status === "DOWN") matchesFilter = true;
            else if (window.activeFilter === "muted" && host.muted) matchesFilter = true;

            if (matchesSearch && matchesFilter) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }

    // Search bar event
    inputSearch.addEventListener("input", (e) => {
        window.searchQuery = e.target.value.trim();
        applyFiltersAndSearch();
    });

    // Filter Buttons events
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            window.activeFilter = btn.dataset.filter;
            applyFiltersAndSearch();
        });
    });

    // Render Logs terminal
    function renderLogs(logs, whatsappLogs) {
        if (!logs) return;
        
        const existingLines = terminalLogs.querySelectorAll(".terminal-line");
        if (existingLines.length !== logs.length) {
            terminalLogs.innerHTML = "";
            logs.forEach(line => {
                terminalLogs.appendChild(formatLogLine(line));
            });
            
            if (chkAutoscroll.checked) {
                terminalLogs.scrollTop = terminalLogs.scrollHeight;
            }
        }
        
        // Render parsed WhatsApp Logs
        renderWhatsAppLogs(whatsappLogs);
    }

    function renderWhatsAppLogs(waLogs) {
        const container = document.getElementById("whatsapp-logs");
        if (!container || !waLogs) return;
        
        const existingWALines = container.querySelectorAll(".terminal-line");
        if (existingWALines.length !== waLogs.length) {
            if (waLogs.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; color: var(--text-muted); padding: 40px 10px; font-size: 0.85rem;">
                        <i class="fab fa-whatsapp" style="font-size: 1.8rem; color: rgba(16, 185, 129, 0.3); margin-bottom: 8px; display: block;"></i>
                        No WhatsApp alerts recorded in the event log.
                    </div>
                `;
                return;
            }
            
            container.innerHTML = "";
            waLogs.forEach(line => {
                const row = document.createElement("div");
                row.className = "terminal-line";
                row.style.padding = "4px 8px";
                row.style.marginBottom = "4px";
                row.style.borderRadius = "4px";
                row.style.fontSize = "0.8rem";
                
                // Clean and format text
                const textFormatted = formatWhatsAppLineText(line);
                
                if (line.includes("SUCCESS")) {
                    row.innerHTML = `<span style="color: #10b981; font-weight: 700; background: rgba(16, 185, 129, 0.15); padding: 1px 4px; border-radius: 3px; font-size: 0.7rem; margin-right: 6px;">SENT</span> ` + textFormatted;
                    row.style.borderLeft = "3px solid #10b981";
                    row.style.background = "rgba(16, 185, 129, 0.04)";
                } else if (line.includes("FAILED") || line.includes("Failed")) {
                    row.innerHTML = `<span style="color: #ef4444; font-weight: 700; background: rgba(239, 68, 68, 0.15); padding: 1px 4px; border-radius: 3px; font-size: 0.7rem; margin-right: 6px;">FAIL</span> ` + textFormatted;
                    row.style.borderLeft = "3px solid #ef4444";
                    row.style.background = "rgba(239, 68, 68, 0.04)";
                } else if (line.includes("Location-based alert") || line.includes("routing")) {
                    row.innerHTML = `<span style="color: var(--accent); font-weight: 700; background: rgba(245, 158, 11, 0.15); padding: 1px 4px; border-radius: 3px; font-size: 0.7rem; margin-right: 6px;">ROUTE</span> ` + textFormatted;
                    row.style.borderLeft = "3px solid var(--accent)";
                    row.style.background = "rgba(245, 158, 11, 0.02)";
                } else if (line.includes("fallback") || line.includes("Template dispatch failed")) {
                    row.innerHTML = `<span style="color: #3b82f6; font-weight: 700; background: rgba(59, 130, 246, 0.15); padding: 1px 4px; border-radius: 3px; font-size: 0.7rem; margin-right: 6px;">RE-ROUTE</span> ` + textFormatted;
                    row.style.borderLeft = "3px solid #3b82f6";
                    row.style.background = "rgba(59, 130, 246, 0.04)";
                } else {
                    row.innerHTML = `<span style="color: var(--text-muted); font-weight: 700; background: rgba(148, 163, 184, 0.15); padding: 1px 4px; border-radius: 3px; font-size: 0.7rem; margin-right: 6px;">INFO</span> ` + textFormatted;
                    row.style.borderLeft = "3px solid var(--text-muted)";
                }
                
                container.appendChild(row);
            });
            
            if (chkAutoscroll.checked) {
                container.scrollTop = container.scrollHeight;
            }
        }
    }
    
    function formatWhatsAppLineText(line) {
        // Extract time: e.g. "INFO [13:21:24] [DISTRICT LIMIT BUFFER] Message..."
        const match = line.match(/^[A-Z]+\s+\[(\d{2}:\d{2}:\d{2})\]\s+(.*)$/);
        if (match) {
            const time = match[1];
            const msg = match[2];
            return `<span style="color: #94a3b8; font-family: var(--font-mono); font-size: 0.75rem; margin-right: 6px;">[${time}]</span> <span style="color: #e2e8f0;">${msg}</span>`;
        }
        return `<span style="color: #e2e8f0;">${line}</span>`;
    }

    // Fetch Dashboard API Status
    function fetchStatus() {
        const cb = new Date().getTime();
        fetch("api.php?endpoint=status&tab_id=" + tabId + "&cb=" + cb)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.status === "success") {
                    lastCheckedTime.textContent = `Last Checked: ${data.timestamp}`;
                    updateStats(data.stats, data.hosts);
                    updateOutagesPanels(data.hosts);
                    detectStateTransitions(data.hosts);
                    renderHostsGrid(data.hosts);
                    renderLogs(data.logs, data.whatsapp_logs);
                    updateChart(data.stats_history);
                    
                    // Update active viewers counter dynamically
                    const activeViewersCount = document.getElementById("active-viewers-count");
                    const activeViewersIps = document.getElementById("active-viewers-ips");
                    
                    if (data.active_viewers !== undefined) {
                        // Handle new array payload or legacy integer fallback
                        const count = data.active_viewers.count !== undefined ? data.active_viewers.count : data.active_viewers;
                        
                        if (activeViewersCount) {
                            activeViewersCount.textContent = count;
                        }
                        
                        if (activeViewersIps && data.active_viewers.ips && data.active_viewers.ips.length > 0) {
                            activeViewersIps.innerHTML = data.active_viewers.ips.map(ip => `<div class="active-connection-item"><i class="fas fa-plug"></i> ${ip}</div>`).join("");
                            activeViewersIps.style.display = "flex";
                        } else if (activeViewersIps) {
                            activeViewersIps.style.display = "none";
                        }
                    }

                    // Update WhatsApp Twilio Sign-up details dynamically
                    if (data.config) {
                        const sender = data.config.twilio_sender || "+14155238886";
                        const joinMsg = data.config.twilio_join_msg || "join at-cath";
                        
                        const qrImg = document.getElementById("enrollment-qr-img");
                        const msgText = document.getElementById("enrollment-msg-text");
                        const phoneText = document.getElementById("enrollment-phone-text");
                        
                        if (msgText) msgText.textContent = joinMsg;
                        if (phoneText) phoneText.textContent = sender;
                        
                        if (qrImg) {
                            const localQrUrl = "static/twilio_enroll_qr.png";
                            if (qrImg.getAttribute('src') !== localQrUrl) {
                                qrImg.src = localQrUrl;
                            }
                        }
                    }
                    
                    // Auto-open modal on first load if search matches exactly one host
                    if (isFirstLoad) {
                        isFirstLoad = false;
                        if (searchQuery) {
                            const matches = data.hosts.filter(h => 
                                h.ip === searchQuery || 
                                h.description.toLowerCase().includes(searchQuery.toLowerCase())
                            );
                            if (matches.length === 1) {
                                openHostModal(matches[0].ip);
                            }
                        }
                    }
                }
            })
            .catch(err => {
                console.error("Fetch API error:", err);
                const statusBadge = document.getElementById("service-status");
                statusBadge.innerHTML = '<span style="background-color: var(--color-down)" class="host-indicator"></span><span>NOC DISCONNECTED</span>';
                statusBadge.className = "status-badge active-state";
                statusBadge.style.color = "var(--color-down)";
                statusBadge.style.borderColor = "rgba(244, 63, 94, 0.25)";
            });
    }

    // Modal Actions: Ping Now
    modalBtnPing.addEventListener("click", () => {
        if (!activeHostIp) return;
        
        modalBtnPing.disabled = true;
        const origText = modalBtnPing.innerHTML;
        modalBtnPing.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Pinging...`;
        
        fetch("api.php?endpoint=hosts/ping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ip: activeHostIp })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                showToast(`Ping completed for ${activeHostIp}: ${data.device_status} (${data.latency ? data.latency + 'ms' : '< 1ms'})`, "success");
                // Force state update immediately in modal
                openHostModal(activeHostIp);
            } else {
                showToast(`Ping failed: ${data.message}`, "error");
            }
        })
        .catch(err => {
            console.error(err);
            showToast("Server error during ping execution.", "error");
        })
        .finally(() => {
            modalBtnPing.disabled = false;
            modalBtnPing.innerHTML = origText;
        });
    });

    // Modal Actions: Mute Alerts
    modalBtnMute.addEventListener("click", () => {
        if (!activeHostIp) return;
        
        modalBtnMute.disabled = true;
        
        fetch("api.php?endpoint=hosts/mute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ip: activeHostIp })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                const mutedText = data.muted ? "MUTED" : "UNMUTED";
                showToast(`Alert notifications ${mutedText} for ${activeHostIp}.`, data.muted ? "warning" : "success");
                openHostModal(activeHostIp);
            } else {
                showToast(`Failed to mute device: ${data.message}`, "error");
            }
        })
        .catch(err => {
            console.error(err);
            showToast("Server error during mute execution.", "error");
        })
        .finally(() => {
            modalBtnMute.disabled = false;
        });
    });

    // Modal Actions: Trace Route Path
    modalBtnTracert.addEventListener("click", () => {
        if (!activeHostIp) return;
        
        modalBtnTracert.disabled = true;
        const origText = modalBtnTracert.innerHTML;
        modalBtnTracert.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Tracing...`;
        
        modalConsoleStdout.textContent = `Tracing network route path to ${activeHostIp} (Max 10 hops, no DNS reverse lookup)...\nThis may take up to 10 seconds. Please wait...\n\n`;
        
        fetch(`api.php?endpoint=diagnostics/tracert&ip=${activeHostIp}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                modalConsoleStdout.textContent += data.stdout;
                showToast(`Traceroute path analysis finished for ${activeHostIp}.`, "success");
            } else {
                modalConsoleStdout.textContent += `Error: ${data.message}`;
                showToast(`Diagnostics failed: ${data.message}`, "error");
            }
        })
        .catch(err => {
            console.error(err);
            modalConsoleStdout.textContent += "Connection timeout error during route analysis.";
            showToast("Server connection error during traceroute.", "error");
        })
        .finally(() => {
            modalBtnTracert.disabled = false;
            modalBtnTracert.innerHTML = origText;
            modalConsoleStdout.scrollTop = modalConsoleStdout.scrollHeight;
        });
    });



    // --- Dark/Light Mode Theme Toggle Switch ---
    if (themeToggle) {
        const savedTheme = localStorage.getItem("theme") || "dark";
        if (savedTheme === "light") {
            document.body.classList.add("light-mode");
            themeToggle.checked = true;
        } else {
            document.body.classList.remove("light-mode");
            themeToggle.checked = false;
        }

        themeToggle.addEventListener("change", () => {
            if (themeToggle.checked) {
                document.body.classList.add("light-mode");
                localStorage.setItem("theme", "light");
                showToast("Theme switched to Light Mode.", "success");
            } else {
                document.body.classList.remove("light-mode");
                localStorage.setItem("theme", "dark");
                showToast("Theme switched to Dark Mode.", "info");
            }
        });
    }

    // Start live background network animation
    initNetworkBackground();

    // Run first fetch, then schedule updates every 5 seconds
    fetchStatus();
    setInterval(fetchStatus, 5000);
});

// Live network nodes background animation function
function initNetworkBackground() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;
    const connectionDistance = 110;
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
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
                    this.x += Math.cos(angle) * force * 2.3;
                    this.y += Math.sin(angle) * force * 2.3;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            const isLight = document.body.classList.contains('light-mode');
            ctx.fillStyle = isLight ? 'rgba(15, 76, 129, 0.75)' : 'rgba(56, 189, 248, 0.75)';
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

        const isLight = document.body.classList.contains('light-mode');
        const lineColor = isLight ? 'rgba(15, 76, 129, ' : 'rgba(56, 189, 248, ';

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
                    ctx.strokeStyle = lineColor + alpha + ')';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();


}






