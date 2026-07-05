// Load saved UI theme
(() => {
  const savedTheme = localStorage.getItem('portfolio_theme');
  if (savedTheme && ['amber', 'blue', 'red'].includes(savedTheme)) {
    document.body.classList.add(`theme-${savedTheme}`);
  }
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   BOOT SEQUENCE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(() => {
  const lines = [
    'BIOS v2.6.0 â€” aditya@secops secure node',
    'Initialising memory subsystemâ€¦â€¦â€¦â€¦â€¦â€¦ OK',
    'Loading cryptographic modulesâ€¦â€¦â€¦â€¦â€¦â€¦â€¦ OK',
    'Mounting SentinelOne & Deep Security telemetryâ€¦ OK',
    'Connecting to NIC audit registryâ€¦â€¦â€¦ OK',
    'Verifying CDAC / CERT-In compliance stateâ€¦ OK',
    'Launching portfolio interfaceâ€¦',
  ];
  const wrap = document.getElementById('boot-lines');
  const bar = document.getElementById('boot-bar');
  const boot = document.getElementById('boot');
  let i = 0;
  const step = () => {
    if (i >= lines.length) {
      setTimeout(() => {
        boot.classList.add('fade-out');
        setTimeout(() => { boot.style.display = 'none'; startAnimations(); }, 650);
      }, 350);
      return;
    }
    const d = document.createElement('div');
    d.className = 'bl';
    d.style.color = lines[i].includes('OK') ? 'var(--green)' : 'var(--muted)';
    if (lines[i].includes('OK')) d.innerHTML = lines[i].replace('OK', '<span style="color:var(--green)">OK</span>');
    else d.textContent = lines[i];
    wrap.appendChild(d);
    bar.style.width = ((i + 1) / lines.length * 100) + '%';
    i++;
    setTimeout(step, i === lines.length ? 300 : 120);
  };
  step();
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MATRIX RAIN
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(() => {
  const c = document.getElementById('matrix-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const chars = '01ã‚¢ã‚¤ã‚¦ã‚¨ã‚ªã‚«ã‚­ã‚¯ã‚±ã‚³ã‚µã‚·ã‚¹ã‚»ã‚½ã‚¿ãƒãƒ„ãƒ†ãƒˆãƒŠãƒ‹ãƒŒãƒãƒŽABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]//';
  let cols, drops;
  function resize() {
    c.width = window.innerWidth; c.height = window.innerHeight;
    cols = Math.floor(c.width / 18);
    drops = Array.from({ length: cols }, () => Math.random() * -50);
  }
  resize();
  window.addEventListener('resize', resize);
  setInterval(() => {
    ctx.fillStyle = 'rgba(6, 10, 7, 0.05)'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#4ade80'; ctx.font = '13px "JetBrains Mono",monospace';
    for (let i = 0; i < drops.length; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * 18, drops[i] * 18);
      if (drops[i] * 18 > c.height && Math.random() > .97) drops[i] = 0;
      drops[i] += .4;
    }
  }, 55);
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CUSTOM CURSOR
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(() => {
  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
  (function lerp() { rx += (mx - rx) * .18; ry += (my - ry) * .18; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(lerp); })();
  document.querySelectorAll('a,button,[role=button]').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.style.transform = 'translate(-50%,-50%) scale(1.8)'; ring.style.opacity = '.5'; });
    el.addEventListener('mouseleave', () => { dot.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.opacity = '1'; });
  });
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SCROLL PROGRESS + BACK TO TOP + NAV ACTIVE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const scrollBar = document.getElementById('scroll-bar');
const backTop = document.getElementById('back-top');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('nav[id=main-nav] a[data-section]');

window.addEventListener('scroll', () => {
  const s = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollBar) scrollBar.style.width = (s / h * 100) + '%';
  if (backTop) backTop.classList.toggle('show', s > 400);

  // active nav
  let cur = '';
  sections.forEach(sec => { if (s >= sec.offsetTop - 140) cur = sec.id; });
  navLinks.forEach(a => {
    const t = a.dataset.section;
    a.classList.toggle('active', t === cur);
  });
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TOAST
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MOBILE NAV
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const ham = document.getElementById('ham');
const mobNav = document.getElementById('mob-nav');
if (ham && mobNav) {
  ham.addEventListener('click', () => {
    document.body.classList.toggle('ham-open');
    mobNav.classList.toggle('open');
  });
}
function closeNav() { if (mobNav) mobNav.classList.remove('open'); document.body.classList.remove('ham-open'); }

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   VISITOR COUNTER
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(async () => {
  const BASE = 1247, SK = 'aj_sess', LK = 'aj_cnt';
  let n = parseInt(localStorage.getItem(LK) || '0');
  if (n < BASE) n = BASE;
  if (!sessionStorage.getItem(SK)) { n++; localStorage.setItem(LK, n); sessionStorage.setItem(SK, '1'); }
  const set = v => { const f = v.toLocaleString('en-IN');['vnum', 'ftr-vnum'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = f; }); };
  set(n);
  try {
    const r = await fetch('https://api.counterapi.dev/v1/ajainx1-portfolio/visits/up', { signal: AbortSignal.timeout(3500) });
    if (r.ok) { const d = await r.json(); const api = (d.count || 0) + BASE; if (api > n) { localStorage.setItem(LK, api); set(api); } }
  } catch { }
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   COUNTING STATS & ANIMATIONS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function countUp(el, target, suffix, dur = 1600) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function startAnimations() {
  // fade-in sections
  const fiObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: .08 });
  document.querySelectorAll('.fi').forEach(el => fiObs.observe(el));

  // stat count-ups
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.stat-num[data-target]').forEach(el => {
        countUp(el, +el.dataset.target, el.dataset.suffix || '');
      });
      statObs.unobserve(e.target);
    });
  }, { threshold: .3 });
  document.querySelectorAll('.stats-grid').forEach(el => statObs.observe(el));
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   INTERACTIVE TERMINAL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const termBody = document.getElementById('term-body');
const termInput = document.getElementById('term-input');
let history = [], histIdx = -1;

const CMDS = {
  help: () => [
    '<span class="hi">â•”â•â• Available Commands â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—</span>',
    '<span class="hi">â•‘</span>  <span class="hi">whoami</span>   â€” identity & professional summary',
    '<span class="hi">â•‘</span>  <span class="hi">about</span>    â€” experience overview',
    '<span class="hi">â•‘</span>  <span class="hi">skills</span>   â€” technical arsenal & competencies',
    '<span class="hi">â•‘</span>  <span class="hi">audit</span>    â€” live CDAC/CERT-In simulation',
    '<span class="hi">â•‘</span>  <span class="hi">contact</span>  â€” contact information',
    '<span class="hi">â•‘</span>  <span class="hi">certs</span>    â€” list certifications & credentials',
    '<span class="hi">â•‘</span>  <span class="hi">htb</span>      â€” Hack The Box & Vulnlab status',
    '<span class="hi">â•‘</span>  <span class="hi">projects</span> â€” view key technical projects',
    '<span class="hi">â•‘</span>  <span class="hi">chat</span>     â€” launch AI assistant ðŸ’¬',
    '<span class="hi">â•‘</span>  <span class="hi">theme</span>    â€” switch color palette (amber/blue/red/green) ðŸŽ¨',
    '<span class="hi">â•‘</span>  <span class="hi">clear</span>    â€” clear terminal screen',
    '<span class="hi">â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•</span>',
  ],
  whoami: () => [
    '<span class="hi">Aditya Jain</span> â€” Cybersecurity Engineer & Subject Matter Expert (SME)',
    '<span class="ok">Experience:</span> 5+ Years Enterprise SecOps & Network Defense',
    '<span class="ok">Role:</span>       SecOps Â· Purple Teaming Â· SentinelOne/Trend Micro Deep Security SME',
    '<span class="ok">Location:</span>   India â€” open to relocation & remote worldwide',
    '<span class="ok">Contact:</span>    adityasec32@gmail.com Â· +91 740 058 8896',
    '<span class="ok">Status:</span>     <span class="warn">â–¶ ACTIVELY SEEKING OPPORTUNITIES</span>',
  ],
  about: () => [
    '<span class="hi">5+ years</span> enterprise cybersecurity across critical government infrastructure.',
    '<span class="ok">Current:</span>  Security Administrator @ NIC via Ebix Technologies Â· Noida',
    '<span class="ok">Past:</span>     SOC Analyst Â· Nuclear Fuel Complex (NFC) Â· Rajasthan',
    '<span class="ok">Past:</span>     SOC Analyst Â· E2E Networks Â· Tamil Nadu',
    '<span class="ok">Studying:</span> MBA Cybersecurity @ Chitkara University',
    '<span class="warn">Pursuing:</span> OSCP Â· CISSP Â· CEH v13',
  ],
  skills: () => [
    '<span class="hi">OFFENSIVE</span>  Active Directory (Kerberoasting, Pass-the-Hash, DCSync), BloodHound, Impacket, Mimikatz, OWASP Top 10, Burp Suite Pro, Metasploit, Nmap',
    '<span class="ok">DETECTION</span>  Wazuh SIEM, Blu Sapphire SIEM, SentinelOne EDR, Trend Micro Deep Security, Kaspersky EDR, Wireshark, PCAP Triage',
    '<span class="warn">NETWORK</span>   Cisco AnyConnect, Tailscale, Check Point NGFW, Fortigate NGFW, Sophos, OSPF, TACACS+/RADIUS',
    '<span class="hi">SCRIPTING</span>  PowerShell, Python, Bash, Git, Generative AI pair-programming',
    '<span class="ok">GOVERNANCE</span> CDAC Standards, CERT-In Guidelines, Security Policy Tuning, KACE UEM',
  ],
  contact: () => [
    '<span class="hi">email:</span>    <a href="mailto:adityasec32@gmail.com" style="color:var(--green)">adityasec32@gmail.com</a>',
    '<span class="hi">phone:</span>    +91 740 058 8896',
    '<span class="hi">linkedin:</span> <a href="https://linkedin.com/in/ajainx1" target="_blank" style="color:var(--green)">linkedin.com/in/ajainx1</a>',
    '<span class="hi">github:</span>   <a href="https://github.com/ajainx1" target="_blank" style="color:var(--green)">github.com/ajainx1</a>',
  ],
  certs: () => [
    '<span class="hi">[âœ“]</span> Fortinet Certified Associate in Cybersecurity (FCAC) â€” Jan 2026',
    '<span class="hi">[âœ“]</span> Red Hat Certified System Administrator (RHCSA) â€” 2018â€“2021',
    '<span class="hi">[âœ“]</span> Ethical Hacking Expert â€” Star Certification (2019â€“2022)',
    '<span class="hi">[âœ“]</span> Mathematical Foundations for Cryptography â€” CU Boulder',
    '<span class="hi">[âœ“]</span> Introduction to Network Security â€” Univ. of London',
    '<span class="hi">[âœ“]</span> Security Management & Governance â€” Royal Holloway',
    '<span class="hi">[âœ“]</span> In the Trenches: SOC â€” EC-Council',
    '<span class="hi">[âœ“]</span> CISSP Exam Prep Pathway â€” CyberFrat',
    '<span class="hi">[âœ“]</span> Fundamental AI Concepts â€” Microsoft',
    '<span class="hi">[âœ“]</span> TCM Security Live Training & Certifications',
  ],
  htb: () => [
    '<span class="ok">Platform:</span>   Hack The Box',
    '<span class="ok">Rank:</span>       <span class="hi">PRO HACKER</span> â€” Active Directory exploitation & PrivEsc',
    '<span class="warn">Vulnlab:</span>    Multi-forest AD chains, pivoting, DC compromise',
    '<span class="hi">Targets:</span>    OSCP Q3/Q4 2026 Â· CEH v13 Q3/Q4 2026 Â· CISSP Q1 2027',
  ],
  projects: () => [
    '<span class="hi">1. State NOC Admin Portal</span> â€” Interactive district directory & Ollama LLM RAG chatbot (<a href="/noc/" target="_blank" style="color:var(--green)">/noc/</a>)',
    '<span class="hi">2. Network Alert Dashboard</span> â€” Real-time device ping & traceroute simulation (<a href="/alert/" target="_blank" style="color:var(--green)">/alert/</a>)',
    '<span class="hi">3. Enterprise LAN Asset Manager</span> â€” Local web portal with DHCP/PXE OS automation',
    '<span class="hi">4. MT5 Algorithmic Trading Bot</span> â€” Multi-indicator Python system with Telegram alerts',
    '<span class="hi">5. CDAC Audit Automator</span> â€” PowerShell toolkit saving 60% manual compliance effort',
    '<span class="hi">6. Jumpstreet Portal</span> â€” Cloud infrastructure & trading simulation (<a href="/js/" target="_blank" style="color:var(--green)">/js/</a>)',
  ],
  chat: () => {
    setTimeout(() => {
      const w = document.getElementById('ai-bot-window');
      if (w) w.classList.add('active');
      const inp = document.getElementById('ai-bot-input');
      if (inp) inp.focus();
    }, 600);
    return ['<span class="warn">â–¶ Initialising AI Chatbot Widget...</span>', '<span class="ok">Opening chat window in bottom-right â†—</span>'];
  },
  theme: (t) => {
    const themes = ['green', 'amber', 'blue', 'red'];
    if (!t) return [
      '<span class="hi">ðŸŽ¨ Shell Color Themes</span>',
      '  <span class="ok">green</span>  â€” Default hacker theme',
      '  <span class="ok">amber</span>  â€” Fallout CRT monitor theme',
      '  <span class="ok">blue</span>   â€” Cyber Blue theme',
      '  <span class="ok">red</span>    â€” Crimson threat-intel theme',
      '',
      'Usage: <span class="warn">theme [name]</span> (e.g. theme amber)'
    ];
    const cleanT = t.toLowerCase().trim();
    if (!themes.includes(cleanT)) {
      return [`<span class="err">Unknown theme "${t}".</span> Available: ${themes.join(', ')}`];
    }

    document.body.classList.remove('theme-amber', 'theme-blue', 'theme-red');
    if (cleanT !== 'green') {
      document.body.classList.add(`theme-${cleanT}`);
    }
    localStorage.setItem('portfolio_theme', cleanT);
    return [`<span class="ok">â–¶ Theme switched to ${cleanT}!</span>`, 'Applying CSS custom variables...'];
  },
};

async function auditCmd() {
  const steps = [
    ['â–¶ Initialising CDAC compliance engineâ€¦', 350],
    ['â–¶ Authenticating against NIC audit registryâ€¦', 500],
    ['[<span class="ok">OK</span>] Auth: <span class="hi">JWT token acquired Â· TLS 1.3</span>', 300],
    ['â–¶ Connecting to SentinelOne & Trend Micro Deep Security APIsâ€¦', 500],
    ['[<span class="ok">OK</span>] EDR: <span class="hi">750/750 endpoints ACTIVE</span>', 300],
    ['â–¶ Scanning CERT-In policy checklist (47 controls)â€¦', 700],
    ['[<span class="ok">OK</span>] Firewall rules (Check Point): <span class="hi">COMPLIANT</span>', 280],
    ['[<span class="ok">OK</span>] AAA (TACACS+/RADIUS): <span class="hi">COMPLIANT</span>', 280],
    ['[<span class="ok">OK</span>] Patch posture (KACE UEM): <span class="hi">97.2% patched</span>', 300],
    ['[<span class="warn">WARN</span>] 3 endpoints pending reboot â€” tickets raised', 280],
    ['â–¶ Executing PowerShell audit automation (120 checks)â€¦', 950],
    ['[<span class="ok">OK</span>] Runtime: <span class="hi">4m 12s</span>  Manual baseline: <span class="warn">10m 30s</span>  Î”: <span class="hi">â†“ 60%</span>', 350],
    ['â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”', 200],
    ['<span class="hi">AUDIT RESULT: PASS</span>  Score: <span class="ok">98.5/100</span>  Grade: <span class="hi">S-Tier</span>', 100],
  ];
  for (const [msg, delay] of steps) {
    await new Promise(r => setTimeout(r, delay));
    appendOut(msg);
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

function appendLine(ps, cmd) {
  if (!termBody) return;
  const d = document.createElement('div');
  d.className = 'tl';
  d.innerHTML = `<span class="ps">${escapeHTML(ps)}</span><span class="cmd">${escapeHTML(cmd)}</span>`;
  termBody.appendChild(d);
  termBody.scrollTop = termBody.scrollHeight;
}

function appendOut(text) {
  if (!termBody) return;
  const d = document.createElement('div');
  d.className = 'to';
  d.innerHTML = text;
  termBody.appendChild(d);
  termBody.scrollTop = termBody.scrollHeight;
}

async function runCmd(raw) {
  const parts = raw.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ');

  appendLine('aditya@jain:~#', ' ' + raw.trim());
  if (!cmd) return;
  if (cmd === 'clear') { if (termBody) termBody.innerHTML = ''; return; }
  if (cmd === 'audit') { await auditCmd(); return; }

  const fn = CMDS[cmd];
  if (fn) {
    const lines = fn(arg);
    lines.forEach(l => appendOut(l));
  } else {
    appendOut(`<span class="err">zsh: command not found: ${escapeHTML(raw.trim())} â€” try 'help'</span>`);
  }
}

// boot messages
setTimeout(() => {
  appendOut('<span class="hi">â–¸ aditya@secops:~ â€” audit_node v2.6 initialised</span>');
  appendOut('Type <span class="hi">help</span> for commands. Try <span class="warn">audit</span> to run a live compliance simulation.');
  appendOut('');
}, 300);

// terminal keyboard
if (termInput) {
  termInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const v = termInput.value;
      termInput.value = ''; histIdx = -1;
      if (v.trim()) { history.unshift(v); runCmd(v); }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < history.length - 1) { histIdx++; termInput.value = history[histIdx]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; termInput.value = history[histIdx]; }
      else { histIdx = -1; termInput.value = ''; }
    }
  });
}
if (termBody) {
  termBody.addEventListener('click', () => { if (termInput) termInput.focus(); });
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FLOATING AI CHATBOT CONTROLLER
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(() => {
  const toggleBtn = document.getElementById('ai-bot-toggle');
  const closeBtn = document.getElementById('ai-bot-close');
  const windowEl = document.getElementById('ai-bot-window');
  const messagesContainer = document.getElementById('ai-bot-messages');
  const inputEl = document.getElementById('ai-bot-input');
  const sendBtn = document.getElementById('ai-bot-send');

  if (!toggleBtn || !windowEl) return;

  const resumeKB = [
    {
      keywords: ['whoami', 'who are you', 'name', 'identity', 'profile', 'summary', 'about aditya', 'about yourself', 'sme'],
      response: `Aditya Jain is a Cybersecurity Engineer and Subject Matter Expert (SME) with 5+ years of enterprise experience across Security Operations (SecOps), Purple Teaming, EDR/SIEM solutions (SentinelOne, Deep Security, Wazuh, Blu Sapphire), and network defense.

He has a proven track record of managing security telemetry across 750+ government offices, automating CDAC/CERT-In compliance by 60%, and conducting Active Directory exploitation & vulnerability research. Currently pursuing CISSP and OSCP.`
    },
    {
      keywords: ['skills', 'tools', 'technologies', 'arsenal', 'tech stack', 'scripting', 'programming', 'languages', 'competencies'],
      response: `Aditya's core technical competencies:
â€¢ OFFENSIVE: Active Directory Exploitation (Kerberoasting, Pass-the-Hash, DCSync, Kerberos Delegation), Network Pivoting, BloodHound, Impacket, Mimikatz, OWASP Top 10, Burp Suite Pro, Metasploit, Nmap.
â€¢ DETECTION & EDR: SentinelOne EDR, Trend Micro Deep Security, Kaspersky EDR, Wazuh SIEM, Blu Sapphire SIEM, Wireshark, PCAP analysis.
â€¢ NETWORK: Cisco AnyConnect, Tailscale, Check Point NGFW, Fortigate NGFW, Sophos, OSPF, TACACS+/RADIUS.
â€¢ SCRIPTING: PowerShell, Bash, Python, Git, Generative AI pair-programming.
â€¢ COMPLIANCE: CDAC Standards, CERT-In Guidelines, Security Policy Tuning, KACE UEM.`
    },
    {
      keywords: ['experience', 'work', 'job', 'employment', 'nic', 'ebix', 'nuclear', 'nfc', 'e2e', 'career', 'history'],
      response: `Aditya has over 5 years of enterprise cybersecurity experience:
â€¢ Security Administrator @ NIC via Ebix Technologies (Current): Managing SentinelOne & Trend Micro Deep Security for 750+ regional offices, Check Point firewall management, CDAC/CERT-In audit automation (60% effort reduction), and generative AI telemetry training.
â€¢ SOC Analyst â€“ Threat Hunter @ Nuclear Fuel Complex (NFC - DAE): 24x7 nuclear-sector SOC threat hunting, Kaspersky EDR sandbox analysis, boosting SIEM detection rate by 35%.
â€¢ SOC Analyst @ E2E Networks: Wazuh SIEM 24x7 monitoring, Snort & Wazuh IDS signature development, AbuseIPDB firewall integration.`
    },
    {
      keywords: ['certs', 'certifications', 'credentials', 'rhcsa', 'fcac', 'passed', 'exams'],
      response: `Aditya's credentials & professional training:
â€¢ Fortinet Certified Associate in Cybersecurity (FCAC) (Jan 2026)
â€¢ Red Hat Certified System Administrator (RHCSA)
â€¢ Ethical Hacking Expert (Star Certification)
â€¢ Mathematical Foundations for Cryptography (CU Boulder)
â€¢ Introduction to Network Security (Univ. of London)
â€¢ Security Management & Governance (Royal Holloway)
â€¢ EC-Council: In the Trenches (SOC)
â€¢ CISSP Exam Prep Pathway & Microsoft AI Concepts
â€¢ Target Certifications: OSCP (Q3/Q4 2026), CEH v13 (Q3/Q4 2026), CISSP (Q1 2027)`
    },
    {
      keywords: ['education', 'degree', 'college', 'university', 'academic', 'mba', 'btech', 'diploma'],
      response: `Aditya's educational qualifications:
â€¢ MBA in Cybersecurity (Expected Jul 2027) â€” Chitkara University.
â€¢ B.Tech in Computer Science & Engineering (2019 â€” 2022) â€” Manipal University Jaipur.
â€¢ Diploma in Computer Science (2013 â€” 2018) â€” Hindu College of Engineering.`
    },
    {
      keywords: ['projects', 'jumpstreet', 'noc portal', 'automator', 'code', 'github projects', 'trading', 'mt5', 'lan asset'],
      response: `Key technical projects:
â€¢ State NOC Admin Portal: Dashboard with engineering directory, live status checkers, and Ollama LLM RAG chatbot.
â€¢ Network Alert Dashboard: Real-time device ping & traceroute simulation for floor switches.
â€¢ Enterprise LAN Asset Manager: Local web portal with DHCP/PXE services for automated OS deployments.
â€¢ MT5 Algorithmic Trading Bot: Multi-indicator Python system (EMA, MACD, RSI) with Telegram alerts.
â€¢ CDAC Audit Automator: PowerShell/Python toolkit automating 120+ checks across 750+ endpoints.`
    },
    {
      keywords: ['contact', 'email', 'phone', 'linkedin', 'github', 'reach', 'hire', 'call'],
      response: `Contact Aditya Jain directly:
â€¢ Email: adityasec32@gmail.com
â€¢ Phone: +91 740 058 8896
â€¢ LinkedIn: linkedin.com/in/ajainx1
â€¢ GitHub: github.com/ajainx1
(Open to remote & relocation opportunities worldwide!)`
    },
    {
      keywords: ['resume', 'cv', 'pdf', 'download resume'],
      response: `You can download Aditya's resume directly:
[Aditya_Jain_Resume.pdf](Aditya_Jain_Cybersecurity_Resume_Professional.pdf)`
    },
    {
      keywords: ['htb', 'hack the box', 'vulnlab', 'labs', 'rank', 'pro hacker', 'oscp target'],
      response: `Offensive security lab training:
â€¢ Hack The Box: Pro Hacker rank â€” Active Directory exploitation, privesc, network pentesting.
â€¢ Vulnlab: Multi-forest Active Directory chains, network pivoting, Domain Controller compromise.`
    },
    {
      keywords: ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo'],
      response: `Hello! I am Aditya's AI Assistant. Ask me anything about his SecOps experience, skills, certifications, projects, or how to reach him!`
    }
  ];

  function getLocalResponse(query) {
    const cleanQuery = query.toLowerCase().trim();
    for (const item of resumeKB) {
      if (item.keywords.some(k => cleanQuery.includes(k))) {
        return item.response;
      }
    }
    return `I can answer questions about Aditya's SecOps & Purple Teaming experience, Active Directory skills, certifications, or projects.

Try asking: "What EDR systems has he managed?" or "What are his contact details?"`;
  }

  async function getAIResponse(userQuery) {
    const customKey = localStorage.getItem('GEMINI_API_KEY');
    if (!customKey) {
      await new Promise(r => setTimeout(r, 500));
      return getLocalResponse(userQuery);
    }

    const systemInstruction = `You are aditya_bot_agent, official AI assistant for Aditya Jain.
Aditya Jain is a Cybersecurity Engineer & Subject Matter Expert (SME) with 5+ years enterprise SecOps experience.
Contact: adityasec32@gmail.com | +91 740 058 8896 | linkedin.com/in/ajainx1 | github.com/ajainx1.
Answer professionally, accurately, and concisely based on his resume data.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${customKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userQuery }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { maxOutputTokens: 250, temperature: 0.7 }
        })
      });

      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (err) {
      return getLocalResponse(userQuery);
    }
  }

  function appendMessage(sender, text) {
    if (!messagesContainer) return;
    const msg = document.createElement('div');
    msg.classList.add('ai-msg', sender);
    let formatted = text.replace(/\n/g, '<br>');
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    formatted = formatted.replace(/â€¢/g, '<span style="color:var(--green)">â€¢</span>');
    msg.innerHTML = formatted;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async function handleSend() {
    if (!inputEl) return;
    const text = inputEl.value.trim();
    if (!text) return;

    appendMessage('user', text);
    inputEl.value = '';

    const typing = document.createElement('div');
    typing.classList.add('ai-msg', 'bot', 'typing-indicator');
    typing.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const reply = await getAIResponse(text);
    typing.remove();
    appendMessage('bot', reply);
  }

  toggleBtn.addEventListener('click', () => {
    windowEl.classList.toggle('active');
    if (windowEl.classList.contains('active') && inputEl) inputEl.focus();
  });
  if (closeBtn) closeBtn.addEventListener('click', () => windowEl.classList.remove('active'));
  if (sendBtn) sendBtn.addEventListener('click', handleSend);
  if (inputEl) inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

  document.querySelectorAll('.ai-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (inputEl) { inputEl.value = btn.dataset.query; handleSend(); }
    });
  });

  window.setGeminiKey = (key) => {
    if (!key) { localStorage.removeItem('GEMINI_API_KEY'); return 'Key removed.'; }
    localStorage.setItem('GEMINI_API_KEY', key); return 'Key saved.';
  };
})();

