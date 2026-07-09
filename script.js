// Load saved UI theme
(function() {
  var t = localStorage.getItem('portfolio_theme');
  if (t && ['amber','blue','red'].indexOf(t) !== -1) document.body.classList.add('theme-' + t);
})();

/* ===== BOOT SEQUENCE ===== */
(function() {
  var lines = [
    'BIOS v2.6.0 -- aditya@secops secure node',
    'Initialising memory subsystem............. OK',
    'Loading cryptographic modules.............. OK',
    'Mounting SentinelOne & Deep Security EDR... OK',
    'Connecting to NIC audit registry.......... OK',
    'Verifying CDAC / CERT-In compliance....... OK',
    'Launching portfolio interface...',
  ];
  var wrap = document.getElementById('boot-lines');
  var bar = document.getElementById('boot-bar');
  var boot = document.getElementById('boot');
  var i = 0;
  function step() {
    if (i >= lines.length) {
      setTimeout(function() {
        boot.classList.add('fade-out');
        setTimeout(function() {
          boot.style.display = 'none';
          showLanding();
        }, 650);
      }, 350);
      return;
    }
    var d = document.createElement('div');
    d.className = 'bl';
    if (lines[i].indexOf('OK') !== -1) {
      d.style.color = 'var(--green)';
      d.innerHTML = lines[i].replace('OK', '<span style="color:var(--green)">OK</span>');
    } else {
      d.style.color = 'var(--muted)';
      d.textContent = lines[i];
    }
    wrap.appendChild(d);
    bar.style.width = ((i + 1) / lines.length * 100) + '%';
    i++;
    setTimeout(step, i === lines.length ? 300 : 120);
  }
  step();
})();

/* ===== LANDING SCREEN ===== */
function showLanding() {
  var landing = document.getElementById('landing');
  if (landing) {
    landing.classList.remove('landing-hidden');
    landing.classList.add('landing-visible');
  }
}

function landingGo(dest) {
  if (window.triggerHaptic) window.triggerHaptic('LIGHT');
  var landing = document.getElementById('landing');
  if (landing) {
    landing.classList.add('landing-fadeout');
    setTimeout(function() {
      landing.style.display = 'none';
      startAnimations();
      if (dest === 'projects') {
        window.open('/js/', '_blank');
      } else if (dest === 'noc') {
        window.open('/noc/', '_blank');
      } else if (dest === 'whoami') {
        var el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      // 'enter' just loads the main portfolio
    }, 600);
  }
}

/* ===== MATRIX RAIN (Optimised) ===== */
(function() {
  var c = document.getElementById('matrix-canvas');
  if (!c) return;
  var ctx = c.getContext('2d');
  var chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]//';
  var cols, drops;
  var spacing = 24;
  function resize() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    cols = Math.floor(c.width / spacing);
    drops = [];
    for (var i = 0; i < cols; i++) drops.push(Math.random() * -50);
  }
  resize();
  window.addEventListener('resize', resize);
  setInterval(function() {
    ctx.fillStyle = 'rgba(6, 10, 7, 0.06)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#4ade80';
    ctx.font = '13px monospace';
    for (var i = 0; i < drops.length; i++) {
      var ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * spacing, drops[i] * spacing);
      if (drops[i] * spacing > c.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.35;
    }
  }, 80);
})();

/* ===== SCROLL PROGRESS + BACK TO TOP + NAV ACTIVE ===== */
var scrollBar = document.getElementById('scroll-bar');
var backTop = document.getElementById('back-top');
var sections = document.querySelectorAll('main section[id]');
var navLinks = document.querySelectorAll('nav[id=main-nav] a[data-section]');

window.addEventListener('scroll', function() {
  var s = window.scrollY;
  var h = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollBar) scrollBar.style.width = (s / h * 100) + '%';
  if (backTop) backTop.classList.toggle('show', s > 400);
  var cur = '';
  sections.forEach(function(sec) { if (s >= sec.offsetTop - 140) cur = sec.id; });
  navLinks.forEach(function(a) { a.classList.toggle('active', a.dataset.section === cur); });
});

/* ===== TOAST ===== */
var toastTimer;
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { t.classList.remove('show'); }, 2800);
}

/* ===== MOBILE NAV ===== */
var ham = document.getElementById('ham');
var mobNav = document.getElementById('mob-nav');
if (ham && mobNav) {
  ham.addEventListener('click', function() {
    document.body.classList.toggle('ham-open');
    mobNav.classList.toggle('open');
  });
}
function closeNav() {
  if (mobNav) mobNav.classList.remove('open');
  document.body.classList.remove('ham-open');
}

/* ===== VISITOR COUNTER ===== */
(function() {
  var BASE = 1247, SK = 'aj_sess', LK = 'aj_cnt';
  var n = parseInt(localStorage.getItem(LK) || '0');
  if (n < BASE) n = BASE;
  if (!sessionStorage.getItem(SK)) { n++; localStorage.setItem(LK, n); sessionStorage.setItem(SK, '1'); }
  function set(v) {
    var f = v.toLocaleString('en-IN');
    ['vnum', 'ftr-vnum'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.textContent = f;
    });
  }
  set(n);
  try {
    fetch('https://api.counterapi.dev/v1/ajainx1-portfolio/visits/up', { signal: AbortSignal.timeout(3500) })
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(d) {
        if (d) { var api = (d.count || 0) + BASE; if (api > n) { localStorage.setItem(LK, api); set(api); } }
      }).catch(function() {});
  } catch(e) {}
})();

/* ===== COUNTING STATS ===== */
function countUp(el, target, suffix, dur) {
  dur = dur || 1600;
  var start = null;
  function step(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / dur, 1);
    var ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function startAnimations() {
  // fade-in sections
  var fiObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fi').forEach(function(el) { fiObs.observe(el); });

  // stat count-ups
  var statObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.stat-num[data-target]').forEach(function(el) {
        countUp(el, +el.dataset.target, el.dataset.suffix || '');
      });
      statObs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stats-grid').forEach(function(el) { statObs.observe(el); });
}

/* ===== INTERACTIVE TERMINAL ===== */
var termBody = document.getElementById('term-body');
var termInput = document.getElementById('term-input');
var cmdHistory = [];
var histIdx = -1;

var CMDS = {
  help: function() { return [
    '<span class="hi">Available Commands:</span>',
    '  <span class="hi">whoami</span>   - identity & summary',
    '  <span class="hi">about</span>    - experience overview',
    '  <span class="hi">skills</span>   - technical competencies',
    '  <span class="hi">audit</span>    - CDAC/CERT-In simulation',
    '  <span class="hi">contact</span>  - contact information',
    '  <span class="hi">certs</span>    - certifications',
    '  <span class="hi">htb</span>      - HTB & Vulnlab status',
    '  <span class="hi">projects</span> - key projects',
    '  <span class="hi">chat</span>     - AI assistant',
    '  <span class="hi">theme</span>    - change color (green/amber/blue/red)',
    '  <span class="hi">clear</span>    - clear terminal',
  ]; },
  whoami: function() { return [
    '<span class="hi">Aditya Jain</span> - Cybersecurity Engineer & SME',
    '<span class="ok">Experience:</span> 5+ Years Enterprise SecOps',
    '<span class="ok">Role:</span>       SecOps | Purple Teaming | EDR/SIEM SME',
    '<span class="ok">Location:</span>   India - open to remote & relocation',
    '<span class="ok">Contact:</span>    adityasec32@gmail.com | +91 740 058 8896',
    '<span class="ok">Status:</span>     <span class="warn">ACTIVELY SEEKING OPPORTUNITIES</span>',
  ]; },
  about: function() { return [
    '<span class="hi">5+ years</span> enterprise cybersecurity across government infrastructure.',
    '<span class="ok">Current:</span>  Security Admin @ NIC via Ebix Technologies',
    '<span class="ok">Past:</span>     SOC Analyst @ Nuclear Fuel Complex (NFC)',
    '<span class="ok">Past:</span>     SOC Analyst @ E2E Networks',
    '<span class="ok">Studying:</span> MBA Cybersecurity @ Chitkara University',
    '<span class="warn">Pursuing:</span> OSCP | CISSP | CEH v13',
  ]; },
  skills: function() { return [
    '<span class="hi">OFFENSIVE</span>  AD Exploitation (Kerberoasting, PTH, DCSync), BloodHound, Impacket, Mimikatz, Burp Suite, Metasploit, Nmap',
    '<span class="ok">DETECTION</span>  Wazuh SIEM, Blu Sapphire, SentinelOne, Deep Security, Kaspersky, Wireshark',
    '<span class="warn">NETWORK</span>   Cisco AnyConnect, Tailscale, Check Point, Fortigate, Sophos, TACACS+/RADIUS',
    '<span class="hi">SCRIPTING</span>  PowerShell, Python, Bash, Git, AI pair-programming',
    '<span class="ok">COMPLIANCE</span> CDAC, CERT-In, Policy Tuning, KACE UEM',
  ]; },
  contact: function() { return [
    '<span class="hi">email:</span>    <a href="mailto:adityasec32@gmail.com" style="color:var(--green)">adityasec32@gmail.com</a>',
    '<span class="hi">phone:</span>    +91 740 058 8896',
    '<span class="hi">linkedin:</span> <a href="https://linkedin.com/in/ajainx1" target="_blank" style="color:var(--green)">linkedin.com/in/ajainx1</a>',
    '<span class="hi">github:</span>   <a href="https://github.com/ajainx1" target="_blank" style="color:var(--green)">github.com/ajainx1</a>',
  ]; },
  certs: function() { return [
    '<span class="hi">[+]</span> Fortinet Certified Associate in Cybersecurity (FCAC)',
    '<span class="hi">[+]</span> Red Hat Certified System Administrator (RHCSA)',
    '<span class="hi">[+]</span> Ethical Hacking Expert - Star Certification',
    '<span class="hi">[+]</span> Mathematical Foundations for Cryptography - CU Boulder',
    '<span class="hi">[+]</span> Network Security - Univ. of London',
    '<span class="hi">[+]</span> Security Management & Governance - Royal Holloway',
    '<span class="hi">[+]</span> In the Trenches: SOC - EC-Council',
    '<span class="hi">[+]</span> CISSP Exam Prep - CyberFrat',
    '<span class="hi">[+]</span> AI Concepts - Microsoft',
    '<span class="hi">[+]</span> TCM Security Live Training',
  ]; },
  htb: function() { return [
    '<span class="ok">Platform:</span>   Hack The Box',
    '<span class="ok">Rank:</span>       <span class="hi">PRO HACKER</span>',
    '<span class="warn">Vulnlab:</span>    Multi-forest AD chains, pivoting, DC compromise',
    '<span class="hi">Targets:</span>    OSCP Q3/Q4 2026 | CEH v13 | CISSP Q1 2027',
  ]; },
  projects: function() { return [
    '<span class="hi">1. State NOC Admin Portal</span> - District directory & Ollama LLM chatbot',
    '<span class="hi">2. Network Alert Dashboard</span> - Device ping & traceroute simulation',
    '<span class="hi">3. Enterprise LAN Asset Manager</span> - DHCP/PXE OS automation',
    '<span class="hi">4. MT5 Algorithmic Trading Bot</span> - Multi-indicator Python system',
    '<span class="hi">5. CDAC Audit Automator</span> - 60% manual effort saved',
    '<span class="hi">6. Jumpstreet Portal</span> - Cloud infra & trading simulation',
  ]; },
  chat: function() {
    setTimeout(function() {
      var w = document.getElementById('ai-bot-window');
      if (w) w.classList.add('active');
      var inp = document.getElementById('ai-bot-input');
      if (inp) inp.focus();
    }, 600);
    return ['<span class="warn">Initialising AI Chatbot...</span>', '<span class="ok">Opening chat window</span>'];
  },
  theme: function(t) {
    var themes = ['green', 'amber', 'blue', 'red'];
    if (!t) return [
      '<span class="hi">Color Themes:</span>',
      '  <span class="ok">green</span>  - Default hacker',
      '  <span class="ok">amber</span>  - Fallout CRT',
      '  <span class="ok">blue</span>   - Cyber Blue',
      '  <span class="ok">red</span>    - Crimson threat-intel',
      '',
      'Usage: <span class="warn">theme [name]</span>'
    ];
    var cleanT = t.toLowerCase().trim();
    if (themes.indexOf(cleanT) === -1) {
      return ['<span class="err">Unknown theme "' + t + '". Available: ' + themes.join(', ') + '</span>'];
    }
    document.body.classList.remove('theme-amber', 'theme-blue', 'theme-red');
    if (cleanT !== 'green') document.body.classList.add('theme-' + cleanT);
    localStorage.setItem('portfolio_theme', cleanT);
    return ['<span class="ok">Theme switched to ' + cleanT + '!</span>'];
  }
};

function auditCmd() {
  var steps = [
    ['Initialising CDAC compliance engine...', 350],
    ['Authenticating against NIC audit registry...', 500],
    ['[<span class="ok">OK</span>] Auth: <span class="hi">JWT token acquired, TLS 1.3</span>', 300],
    ['Connecting to SentinelOne & Deep Security APIs...', 500],
    ['[<span class="ok">OK</span>] EDR: <span class="hi">750/750 endpoints ACTIVE</span>', 300],
    ['Scanning CERT-In policy checklist (47 controls)...', 700],
    ['[<span class="ok">OK</span>] Firewall rules: <span class="hi">COMPLIANT</span>', 280],
    ['[<span class="ok">OK</span>] AAA (TACACS+/RADIUS): <span class="hi">COMPLIANT</span>', 280],
    ['[<span class="ok">OK</span>] Patch posture (KACE): <span class="hi">97.2% patched</span>', 300],
    ['[<span class="warn">WARN</span>] 3 endpoints pending reboot - tickets raised', 280],
    ['Executing PowerShell audit automation (120 checks)...', 950],
    ['[<span class="ok">OK</span>] Runtime: <span class="hi">4m 12s</span>  Manual: <span class="warn">10m 30s</span>  Delta: <span class="hi">-60%</span>', 350],
    ['--------------------------------------------', 200],
    ['<span class="hi">AUDIT RESULT: PASS</span>  Score: <span class="ok">98.5/100</span>  Grade: <span class="hi">S-Tier</span>', 100],
  ];
  var idx = 0;
  function next() {
    if (idx >= steps.length) return;
    appendOut(steps[idx][0]);
    var delay = steps[idx][1];
    idx++;
    setTimeout(next, delay);
  }
  next();
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function appendLine(ps, cmd) {
  if (!termBody) return;
  var d = document.createElement('div');
  d.className = 'tl';
  d.innerHTML = '<span class="ps">' + escapeHTML(ps) + '</span><span class="cmd">' + escapeHTML(cmd) + '</span>';
  termBody.appendChild(d);
  termBody.scrollTop = termBody.scrollHeight;
}

function appendOut(text) {
  if (!termBody) return;
  var d = document.createElement('div');
  d.className = 'to';
  d.innerHTML = text;
  termBody.appendChild(d);
  termBody.scrollTop = termBody.scrollHeight;
}

function runCmd(raw) {
  var parts = raw.trim().split(/\s+/);
  var cmd = parts[0].toLowerCase();
  var arg = parts.slice(1).join(' ');
  appendLine('aditya@jain:~#', ' ' + raw.trim());
  if (!cmd) return;
  if (cmd === 'clear') { if (termBody) termBody.innerHTML = ''; return; }
  if (cmd === 'audit') { auditCmd(); return; }
  var fn = CMDS[cmd];
  if (fn) {
    var lines = fn(arg);
    lines.forEach(function(l) { appendOut(l); });
  } else {
    appendOut('<span class="err">command not found: ' + escapeHTML(raw.trim()) + ' - try help</span>');
  }
}

// boot messages
setTimeout(function() {
  appendOut('<span class="hi">aditya@secops:~ -- audit_node v2.6 initialised</span>');
  appendOut('Type <span class="hi">help</span> for commands. Try <span class="warn">audit</span> for a live simulation.');
  appendOut('');
}, 300);

// terminal keyboard
if (termInput) {
  termInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      if (window.triggerHaptic) window.triggerHaptic('LIGHT');
      var v = termInput.value;
      termInput.value = '';
      histIdx = -1;
      if (v.trim()) { cmdHistory.unshift(v); runCmd(v); }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < cmdHistory.length - 1) { histIdx++; termInput.value = cmdHistory[histIdx]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; termInput.value = cmdHistory[histIdx]; }
      else { histIdx = -1; termInput.value = ''; }
    }
  });
}
if (termBody) {
  termBody.addEventListener('click', function() { if (termInput) termInput.focus(); });
}

/* ===== AI CHATBOT ===== */
(function() {
  var toggleBtn = document.getElementById('ai-bot-toggle');
  var closeBtn = document.getElementById('ai-bot-close');
  var windowEl = document.getElementById('ai-bot-window');
  var messagesContainer = document.getElementById('ai-bot-messages');
  var inputEl = document.getElementById('ai-bot-input');
  var sendBtn = document.getElementById('ai-bot-send');
  if (!toggleBtn || !windowEl) return;

  var resumeKB = [
    { keywords: ['whoami','who are you','name','identity','profile','summary','about aditya','sme'],
      response: 'Aditya Jain is a Cybersecurity Engineer and Subject Matter Expert (SME) with 5+ years of enterprise experience across SecOps, Purple Teaming, EDR/SIEM solutions (SentinelOne, Deep Security, Wazuh, Blu Sapphire), and network defense.\n\nHe manages security telemetry across 750+ government offices, automating CDAC/CERT-In compliance by 60%, and conducting Active Directory exploitation & vulnerability research.' },
    { keywords: ['skills','tools','technologies','arsenal','competencies'],
      response: 'Core competencies:\n- OFFENSIVE: AD Exploitation (Kerberoasting, PTH, DCSync), BloodHound, Impacket, Mimikatz, OWASP Top 10, Burp Suite, Metasploit, Nmap\n- DETECTION: SentinelOne, Deep Security, Kaspersky, Wazuh SIEM, Blu Sapphire, Wireshark\n- NETWORK: Check Point, Fortigate, Sophos, TACACS+/RADIUS, OSPF\n- SCRIPTING: PowerShell, Python, Bash, Git, AI pair-programming\n- COMPLIANCE: CDAC, CERT-In, KACE UEM' },
    { keywords: ['experience','work','job','nic','ebix','nuclear','nfc','e2e','career'],
      response: '5+ years enterprise cybersecurity:\n- Security Administrator @ NIC via Ebix Technologies (Current): SentinelOne & Deep Security EDR for 750+ offices, CDAC/CERT-In audit automation (60% effort reduction)\n- SOC Analyst @ Nuclear Fuel Complex: 24x7 SOC, Kaspersky EDR, +35% detection boost\n- SOC Analyst @ E2E Networks: Wazuh SIEM, Snort/Wazuh IDS signatures' },
    { keywords: ['certs','certifications','credentials','rhcsa','fcac'],
      response: 'Credentials:\n- FCAC (Jan 2026)\n- RHCSA\n- Ethical Hacking Expert (Star Certification)\n- Cryptography (CU Boulder)\n- Network Security (Univ. of London)\n- EC-Council SOC\n- Targets: OSCP, CEH v13, CISSP' },
    { keywords: ['education','degree','college','mba','btech'],
      response: 'Education:\n- MBA in Cybersecurity (Expected Jul 2027) - Chitkara University\n- B.Tech in CSE (2019-2022) - Manipal University Jaipur\n- Diploma in CS (2013-2018) - Hindu College of Engineering' },
    { keywords: ['projects','jumpstreet','noc','automator','trading','mt5'],
      response: 'Key projects:\n- State NOC Admin Portal (HTML/CSS, JS, PHP, Ollama LLM)\n- Network Alert Dashboard (JS, CSS Grid)\n- Enterprise LAN Asset Manager (Python, DHCP/PXE)\n- MT5 Algorithmic Trading Bot (Python, Telegram)\n- CDAC Audit Automator (PowerShell/Python)\n- Jumpstreet Portal (React, Vite, TypeScript)' },
    { keywords: ['contact','email','phone','linkedin','github','reach','hire'],
      response: 'Contact Aditya:\n- Email: adityasec32@gmail.com\n- Phone: +91 740 058 8896\n- LinkedIn: linkedin.com/in/ajainx1\n- GitHub: github.com/ajainx1\n(Open to remote & relocation worldwide!)' },
    { keywords: ['hello','hi','hey','greetings'],
      response: 'Hello! I am Aditya\'s AI Assistant. Ask me about his SecOps experience, skills, certifications, projects, or contact details.' }
  ];

  function getLocalResponse(query) {
    var q = query.toLowerCase().trim();
    for (var i = 0; i < resumeKB.length; i++) {
      for (var j = 0; j < resumeKB[i].keywords.length; j++) {
        if (q.indexOf(resumeKB[i].keywords[j]) !== -1) return resumeKB[i].response;
      }
    }
    return 'I can answer questions about Aditya\'s SecOps experience, skills, certifications, or projects.\n\nTry: "What EDR systems has he managed?" or "contact details"';
  }

  function getAIResponse(userQuery) {
    var customKey = localStorage.getItem('GEMINI_API_KEY');
    if (!customKey) {
      return new Promise(function(resolve) {
        setTimeout(function() { resolve(getLocalResponse(userQuery)); }, 500);
      });
    }
    return fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + customKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: 'You are aditya_bot_agent. Answer about Aditya Jain, Cybersecurity Engineer & SME, 5+ years SecOps. Contact: adityasec32@gmail.com, +91 740 058 8896.' }] },
        generationConfig: { maxOutputTokens: 250, temperature: 0.7 }
      })
    }).then(function(r) { return r.json(); })
      .then(function(d) { return d.candidates[0].content.parts[0].text; })
      .catch(function() { return getLocalResponse(userQuery); });
  }

  function appendMessage(sender, text) {
    if (!messagesContainer) return;
    var msg = document.createElement('div');
    msg.classList.add('ai-msg', sender);
    var formatted = text.replace(/\n/g, '<br>');
    msg.innerHTML = formatted;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function handleSend() {
    if (!inputEl) return;
    var text = inputEl.value.trim();
    if (!text) return;
    if (window.triggerHaptic) window.triggerHaptic('MEDIUM');
    appendMessage('user', text);
    inputEl.value = '';
    var typing = document.createElement('div');
    typing.classList.add('ai-msg', 'bot', 'typing-indicator');
    typing.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    getAIResponse(text).then(function(reply) {
      typing.remove();
      if (window.triggerHaptic) window.triggerHaptic('LIGHT');
      appendMessage('bot', reply);
    });
  }

  toggleBtn.addEventListener('click', function() {
    if (window.triggerHaptic) window.triggerHaptic('LIGHT');
    windowEl.classList.toggle('active');
    if (windowEl.classList.contains('active') && inputEl) inputEl.focus();
  });
  if (closeBtn) closeBtn.addEventListener('click', function() { windowEl.classList.remove('active'); });
  if (sendBtn) sendBtn.addEventListener('click', handleSend);
  if (inputEl) inputEl.addEventListener('keydown', function(e) { if (e.key === 'Enter') handleSend(); });
  document.querySelectorAll('.ai-chip-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { if (inputEl) { inputEl.value = btn.dataset.query; handleSend(); } });
  });
  window.setGeminiKey = function(key) {
    if (!key) { localStorage.removeItem('GEMINI_API_KEY'); return 'Key removed.'; }
    localStorage.setItem('GEMINI_API_KEY', key); return 'Key saved.';
  };
})();

window.landingGo = landingGo;
window.showLanding = showLanding;
window.startAnimations = startAnimations;
