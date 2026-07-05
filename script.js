// Load saved UI theme
(() => {
  const savedTheme = localStorage.getItem('portfolio_theme');
  if (savedTheme && ['amber', 'blue', 'red'].includes(savedTheme)) {
    document.body.classList.add(`theme-${savedTheme}`);
  }
})();


/* ═══════════════════════════════════════
   BOOT SEQUENCE
═══════════════════════════════════════ */
(()=>{
  const lines=[
    'BIOS v2.6.0 — aditya@jain secure node',
    'Initialising memory subsystem……………… OK',
    'Loading cryptographic modules………………… OK',
    'Mounting EDR telemetry streams…………… OK',
    'Connecting to NIC audit registry……… OK',
    'Verifying CERT-In compliance state…… OK',
    'Launching portfolio interface…',
  ];
  const wrap=document.getElementById('boot-lines');
  const bar=document.getElementById('boot-bar');
  const boot=document.getElementById('boot');
  let i=0;
  const step=()=>{
    if(i>=lines.length){
      setTimeout(()=>{
        boot.classList.add('fade-out');
        setTimeout(()=>{boot.style.display='none';startAnimations()},650);
      },350);
      return;
    }
    const d=document.createElement('div');
    d.className='bl';
    d.style.color=lines[i].includes('OK')?'var(--green)':'var(--muted)';
    if(lines[i].includes('OK'))d.innerHTML=lines[i].replace('OK','<span style="color:var(--green)">OK</span>');
    else d.textContent=lines[i];
    wrap.appendChild(d);
    bar.style.width=((i+1)/lines.length*100)+'%';
    i++;
    setTimeout(step,i===lines.length?300:120);
  };
  step();
})();

/* ═══════════════════════════════════════
   MATRIX RAIN
═══════════════════════════════════════ */
(()=>{
  const c=document.getElementById('matrix-canvas');
  const ctx=c.getContext('2d');
  const chars='01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]//';
  let cols,drops;
  function resize(){
    c.width=window.innerWidth;c.height=window.innerHeight;
    cols=Math.floor(c.width/18);
    drops=Array.from({length:cols},()=>Math.random()*-50);
  }
  resize();
  window.addEventListener('resize',resize);
  setInterval(()=>{
    ctx.fillStyle='rgba(8,13,9,0.05)';ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle='#4ade80';ctx.font='13px "JetBrains Mono",monospace';
    for(let i=0;i<drops.length;i++){
      const ch=chars[Math.floor(Math.random()*chars.length)];
      ctx.fillText(ch,i*18,drops[i]*18);
      if(drops[i]*18>c.height&&Math.random()>.97)drops[i]=0;
      drops[i]+=.4;
    }
  },55);
})();

/* ═══════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════ */
(()=>{
  const dot=document.getElementById('cursor');
  const ring=document.getElementById('cursor-ring');
  let mx=0,my=0,rx=0,ry=0;
  window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
  (function lerp(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(lerp)})();
  document.querySelectorAll('a,button,[role=button]').forEach(el=>{
    el.addEventListener('mouseenter',()=>{dot.style.transform='translate(-50%,-50%) scale(1.8)';ring.style.opacity='.5'});
    el.addEventListener('mouseleave',()=>{dot.style.transform='translate(-50%,-50%) scale(1)';ring.style.opacity='1'});
  });
})();

/* ═══════════════════════════════════════
   SCROLL PROGRESS + BACK TO TOP + NAV ACTIVE
═══════════════════════════════════════ */
const scrollBar=document.getElementById('scroll-bar');
const backTop=document.getElementById('back-top');
const sections=document.querySelectorAll('main section[id]');
const navLinks=document.querySelectorAll('nav[id=main-nav] a[data-section]');

window.addEventListener('scroll',()=>{
  const s=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;
  scrollBar.style.width=(s/h*100)+'%';
  backTop.classList.toggle('show',s>400);

  // active nav
  let cur='';
  sections.forEach(sec=>{if(s>=sec.offsetTop-120)cur=sec.id});
  navLinks.forEach(a=>{
    const t=a.dataset.section;
    a.classList.toggle('active',t===cur);
  });
});

/* ═══════════════════════════════════════
   TOAST
═══════════════════════════════════════ */
let toastTimer;
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2800);
}

/* ═══════════════════════════════════════
   MOBILE NAV
═══════════════════════════════════════ */
const ham=document.getElementById('ham');
const mobNav=document.getElementById('mob-nav');
ham.addEventListener('click',()=>{
  document.body.classList.toggle('ham-open');
  mobNav.classList.toggle('open');
});
function closeNav(){mobNav.classList.remove('open');document.body.classList.remove('ham-open')}

/* ═══════════════════════════════════════
   VISITOR COUNTER
═══════════════════════════════════════ */
(async()=>{
  const BASE=1247,SK='aj_sess',LK='aj_cnt';
  let n=parseInt(localStorage.getItem(LK)||'0');
  if(n<BASE)n=BASE;
  if(!sessionStorage.getItem(SK)){n++;localStorage.setItem(LK,n);sessionStorage.setItem(SK,'1')}
  const set=v=>{const f=v.toLocaleString('en-IN');['vnum','ftr-vnum'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=f})};
  set(n);
  try{
    const r=await fetch('https://api.counterapi.dev/v1/ajainx1-portfolio/visits/up',{signal:AbortSignal.timeout(3500)});
    if(r.ok){const d=await r.json();const api=(d.count||0)+BASE;if(api>n){localStorage.setItem(LK,api);set(api)}}
  }catch{}
})();

/* ═══════════════════════════════════════
   TYPEWRITER LEAD TEXT
═══════════════════════════════════════ */
function typeWriter(el,text,speed=22){
  let i=0;el.innerHTML='';
  const tick=()=>{if(i<text.length){el.innerHTML+=text[i++];setTimeout(tick,speed)}};
  tick();
}

/* ═══════════════════════════════════════
   COUNTING STATS
═══════════════════════════════════════ */
function countUp(el,target,suffix,dur=1600){
  let start=null;
  const step=ts=>{
    if(!start)start=ts;
    const p=Math.min((ts-start)/dur,1);
    const ease=1-Math.pow(1-p,4);
    el.textContent=Math.floor(ease*target)+suffix;
    if(p<1)requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════
   INTERSECTION OBSERVER — fade + bars + stats
═══════════════════════════════════════ */
function startAnimations(){
  // Typewriter
  const lead=document.getElementById('lead-text');
  const full='Cybersecurity Engineer building <span>defensive telemetry</span> for government-scale infrastructure — and sharpening <span>offensive tradecraft</span> through enterprise red-team labs.';
  setTimeout(()=>{lead.innerHTML=full},400);

  // fade-in sections
  const fiObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis')});
  },{threshold:.08});
  document.querySelectorAll('.fi').forEach(el=>fiObs.observe(el));

  // skill bars + audit bars
  const barObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      e.target.querySelectorAll('.sbar-fill,.abar-fill').forEach(b=>{b.style.width=b.dataset.width+'%'});
      barObs.unobserve(e.target);
    });
  },{threshold:.2});
  document.querySelectorAll('.skill-card,.audit-banner').forEach(el=>barObs.observe(el));

  // stat count-ups
  const statObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      e.target.querySelectorAll('.stat-num[data-target]').forEach(el=>{
        countUp(el,+el.dataset.target,el.dataset.suffix||'');
      });
      statObs.unobserve(e.target);
    });
  },{threshold:.3});
  document.querySelectorAll('.stats-grid').forEach(el=>statObs.observe(el));
}

/* ═══════════════════════════════════════
   INTERACTIVE TERMINAL
═══════════════════════════════════════ */
const termBody=document.getElementById('term-body');
const termInput=document.getElementById('term-input');
let history=[],histIdx=-1;

const CMDS={
  help:()=>[
    '<span class="hi">╔══ Available Commands ══════════════════╗</span>',
    '<span class="hi">║</span>  <span class="hi">whoami</span>   — identity &amp; professional summary',
    '<span class="hi">║</span>  <span class="hi">about</span>    — experience overview',
    '<span class="hi">║</span>  <span class="hi">skills</span>   — technical arsenal',
    '<span class="hi">║</span>  <span class="hi">audit</span>    — live CDAC/CERT-In simulation',
    '<span class="hi">║</span>  <span class="hi">contact</span>  — contact information',
    '<span class="hi">║</span>  <span class="hi">jumpstreet</span>— open Jumpstreet portal',
    '<span class="hi">║</span>  <span class="hi">certs</span>    — list certifications',
    '<span class="hi">║</span>  <span class="hi">htb</span>      — HackTheBox status',
    '<span class="hi">║</span>  <span class="hi">chat</span>     — chat with Aditya\'s AI assistant 💬',
    '<span class="hi">║</span>  <span class="hi">theme</span>    — change terminal & website UI color theme 🎨',
    '<span class="hi">║</span>  <span class="hi">clear</span>    — clear terminal',
    '<span class="hi">╚════════════════════════════════════════╝</span>',
  ],
  whoami:()=>[
    '<span class="hi">Aditya Jain</span> — Cybersecurity Engineer',
    '<span class="ok">Role:</span>     SecOps · EDR · SIEM · NGFW · Red Team Aspirant',
    '<span class="ok">Location:</span> India — open to relocation &amp; remote worldwide',
    '<span class="ok">Status:</span>   <span class="warn">▶ ACTIVELY SEEKING OPPORTUNITIES</span>',
    '<span class="ok">Rating:</span>   <span class="hi">10/10</span> — SME Professional Audit',
  ],
  about:()=>[
    '<span class="hi">3+ years</span> enterprise cybersecurity across government infrastructure.',
    '<span class="ok">Current:</span>  Security Admin @ NIC via Ebix Technologies · Noida',
    '<span class="ok">Past:</span>     SOC Analyst · Nuclear Fuel Complex (NFC) · Rajasthan',
    '<span class="ok">Past:</span>     SOC Analyst · E2E Networks · Tamil Nadu',
    '<span class="ok">Studying:</span> MBA Cybersecurity @ Chitkara University',
    '<span class="warn">Pursuing:</span> OSCP · CEH v13 · CISSP',
  ],
  skills:()=>[
    '<span class="hi">OFFENSIVE</span>  Burp Suite Pro · Metasploit · Nmap · OWASP Top 10 · PrivEsc',
    '<span class="ok">DEFENSIVE</span>  SentinelOne EDR · Wazuh SIEM · Wireshark · Kaspersky · Snort',
    '<span class="warn">NETWORK</span>   Check Point NGFW · Sophos · TACACS+ · RADIUS · OSPF · MTU',
    '<span class="hi">SCRIPTING</span>  PowerShell · Python · Bash · Git · AI-assisted tooling',
    '<span class="ok">COMPLIANCE</span> CDAC · CERT-In · KACE UEM · Policy Tuning · CVE Analysis',
  ],
  contact:()=>[
    '<span class="hi">email:</span>    <a href="mailto:aavkjain@hotmail.com" style="color:var(--green)">aavkjain@hotmail.com</a>',
    '<span class="hi">phone:</span>    +91 98975 77007',
    '<span class="hi">linkedin:</span> <a href="https://linkedin.com/in/ajainx1" target="_blank" style="color:var(--green)">linkedin.com/in/ajainx1</a>',
    '<span class="hi">github:</span>   <a href="https://github.com/ajainx1" target="_blank" style="color:var(--green)">github.com/ajainx1</a>',
  ],
  certs:()=>[
    '<span class="hi">[✓]</span> Fortinet Certified Associate in Cybersecurity (FCAC)',
    '<span class="hi">[✓]</span> Red Hat Certified System Administrator (RHCSA)',
    '<span class="hi">[✓]</span> Mathematical Foundations for Cryptography — CU Boulder',
    '<span class="hi">[✓]</span> In the Trenches: SOC — EC-Council',
    '<span class="hi">[✓]</span> CISSP Exam Prep Pathway — CyberFrat',
    '<span class="hi">[✓]</span> Network Security — Univ. of London',
    '<span class="hi">[✓]</span> Ethical Hacking Expert — Star Certification',
  ],
  htb:()=>[
    '<span class="ok">Platform:</span>   Hack The Box',
    '<span class="ok">Status:</span>     <span class="hi">ACTIVE</span> — Enterprise &amp; standalone labs',
    '<span class="ok">Focus:</span>      Network pentesting · PrivEsc · AD exploitation',
    '<span class="warn">Also:</span>      Vulnlab — AD chains · pivoting · DC compromise',
    '<span class="hi">Target:</span>     OSCP Q4 2026 · CEH v13 Q3 2026',
  ],
  jumpstreet:()=>{
    setTimeout(()=>window.open('/js/','_blank'),700);
    return['<span class="warn">▶ Launching Jumpstreet Portal...</span>','<span class="ok">Opening in new tab ↗</span>'];
  },
  chat:()=>{
    setTimeout(()=>{
      const w=document.getElementById('ai-bot-window');
      if(w)w.classList.add('active');
      const inp=document.getElementById('ai-bot-input');
      if(inp)inp.focus();
    },600);
    return['<span class="warn">▶ Initialising AI Chatbot Widget...</span>','<span class="ok">Opening chat window in bottom-right ↗</span>'];
  },
  theme:(t)=>{
    const themes = ['green', 'amber', 'blue', 'red'];
    if (!t) return [
      '<span class="hi">🎨 Shell Color Themes</span>',
      '  <span class="ok">green</span>  — Default hacker theme',
      '  <span class="ok">amber</span>  — Fallout CRT monitor theme',
      '  <span class="ok">blue</span>   — Cyber Blue theme',
      '  <span class="ok">red</span>    — Crimson threat-intel theme',
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
    return [`<span class="ok">▶ Theme switched to ${cleanT}!</span>`, 'Applying CSS custom variables...'];
  },
};

async function auditCmd(){
  const steps=[
    ['▶ Initialising CDAC compliance engine…',350],
    ['▶ Authenticating against NIC audit registry…',500],
    ['[<span class="ok">OK</span>] Auth: <span class="hi">JWT token acquired · TLS 1.3</span>',300],
    ['▶ Connecting to SentinelOne EDR API…',500],
    ['[<span class="ok">OK</span>] EDR: <span class="hi">750/750 endpoints ACTIVE</span>',300],
    ['▶ Scanning CERT-In policy checklist (47 controls)…',700],
    ['[<span class="ok">OK</span>] Firewall rules: <span class="hi">COMPLIANT</span>',280],
    ['[<span class="ok">OK</span>] AAA (TACACS+/RADIUS): <span class="hi">COMPLIANT</span>',280],
    ['[<span class="ok">OK</span>] Patch posture: <span class="hi">97.2% patched</span>',300],
    ['[<span class="warn">WARN</span>] 3 endpoints pending reboot — tickets raised',280],
    ['▶ Executing PowerShell audit automation (120 checks)…',950],
    ['[<span class="ok">OK</span>] Runtime: <span class="hi">4m 12s</span>  Manual baseline: <span class="warn">10m 30s</span>  Δ: <span class="hi">↓ 60%</span>',350],
    ['━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',200],
    ['<span class="hi">AUDIT RESULT: PASS</span>  Score: <span class="ok">94.7/100</span>  Grade: <span class="hi">A+</span>',100],
  ];
  for(const[msg,delay]of steps){
    await new Promise(r=>setTimeout(r,delay));
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

function appendLine(ps,cmd){
  const d=document.createElement('div');
  d.className='tl';
  d.innerHTML=`<span class="ps">${escapeHTML(ps)}</span><span class="cmd">${escapeHTML(cmd)}</span>`;
  termBody.appendChild(d);
  termBody.scrollTop=termBody.scrollHeight;
}
function appendOut(text){
  const d=document.createElement('div');
  d.className='to';
  d.innerHTML=text;
  termBody.appendChild(d);
  termBody.scrollTop=termBody.scrollHeight;
}

async function runCmd(raw){
  const cmd=raw.trim().toLowerCase();
  appendLine('aditya@jain:~#',' '+raw.trim());
  if(!cmd)return;
  if(cmd==='clear'){termBody.innerHTML='';return}
  if(cmd==='audit'){await auditCmd();return}
  const fn=CMDS[cmd];
  if(fn)(fn()).forEach(l=>appendOut(l));
  else appendOut(`<span class="err">zsh: command not found: ${escapeHTML(raw.trim())} — try 'help'</span>`);
}

// boot messages
setTimeout(()=>{
  appendOut('<span class="hi">▸ aditya@jain:~ — audit_node v2.6 initialised</span>');
  appendOut('Type <span class="hi">help</span> for commands. Try <span class="warn">audit</span> to run a live compliance simulation.');
  appendOut('');
},300);

// terminal keyboard
termInput.addEventListener('keydown',e=>{
  if(e.key==='Enter'){
    const v=termInput.value;
    termInput.value='';histIdx=-1;
    if(v.trim()){history.unshift(v);runCmd(v)}
  } else if(e.key==='ArrowUp'){
    e.preventDefault();
    if(histIdx<history.length-1){histIdx++;termInput.value=history[histIdx]}
  } else if(e.key==='ArrowDown'){
    e.preventDefault();
    if(histIdx>0){histIdx--;termInput.value=history[histIdx]}
    else{histIdx=-1;termInput.value=''}
  }
});
// click on terminal body → focus input
termBody.addEventListener('click',()=>termInput.focus());

/* ═══════════════════════════════════════
   FLOATING AI CHATBOT CONTROLLER
═══════════════════════════════════════ */
(() => {
  const toggleBtn = document.getElementById('ai-bot-toggle');
  const closeBtn = document.getElementById('ai-bot-close');
  const windowEl = document.getElementById('ai-bot-window');
  const messagesContainer = document.getElementById('ai-bot-messages');
  const inputEl = document.getElementById('ai-bot-input');
  const sendBtn = document.getElementById('ai-bot-send');

  const resumeKB = [
    {
      keywords: ['whoami', 'who are you', 'name', 'identity', 'profile', 'summary', 'about aditya', 'about yourself'],
      response: `Aditya Jain is a Cybersecurity Engineer with 3+ years of enterprise experience across Security Operations (SecOps), EDR architecture, SIEM engineering, Next-Generation Firewall (NGFW) administration, and compliance.

He has a strong record of deploying security telemetry and automation frameworks, most recently auditing CDAC/CERT-In standards for critical Indian government infrastructure. Currently, he is shifting into offensive security and red teaming.`
    },
    {
      keywords: ['skills', 'tools', 'technologies', 'arsenal', 'tech stack', 'scripting', 'programming', 'languages'],
      response: `Aditya's technical arsenal spans defense, offense, and automation:
• OFFENSIVE: Burp Suite Pro, Metasploit, Nmap, OWASP Top 10, PrivEsc.
• DEFENSIVE: SentinelOne EDR, Wazuh SIEM, Wireshark, Kaspersky EDR, Snort.
• NETWORK: Check Point NGFW, Sophos, TACACS+, RADIUS, OSPF, MTU.
• SCRIPTING: PowerShell (audit automation), Python, Bash, Git.
• COMPLIANCE: CDAC & CERT-In audit standards, patch governance (KACE UEM).`
    },
    {
      keywords: ['experience', 'work', 'job', 'employment', 'nic', 'ebix', 'nuclear', 'nfc', 'e2e', 'career'],
      response: `Aditya has over 3 years of enterprise security experience:
• Security Administrator @ NIC via Ebix Technologies (Current): Tuning SentinelOne EDR for 750+ government offices, Check Point firewall management, and audit automation.
• SOC Analyst @ Nuclear Fuel Complex (NFC - DAE): Real-time threat triage via SIEM and Kaspersky EDR in a 24x7 SOC, boosting detection rate by 35%.
• SOC Analyst @ E2E Networks: Wazuh SIEM monitoring, Snort/Wazuh rule writing, and PCAP analysis.`
    },
    {
      keywords: ['certs', 'certifications', 'credentials', 'rhcsa', 'fcac', 'passed', 'exams'],
      response: `Aditya holds several industry credentials:
• Red Hat Certified System Administrator (RHCSA)
• Fortinet Certified Associate in Cybersecurity (FCAC)
• EC-Council: In the Trenches (SOC)
• CU Boulder: Mathematical Foundations for Cryptography
• Target certifications: OSCP (Q4 2026), CEH v13 (Q3 2026), CISSP.`
    },
    {
      keywords: ['education', 'degree', 'college', 'university', 'academic', 'mba', 'btech', 'diploma'],
      response: `Aditya's educational background:
• MBA in Cybersecurity (Expected Jul 2027) — Chitkara University.
• B.Tech in Computer Science & Engineering (2019 — 2022) — Manipal University Jaipur.
• Diploma in Computer Science (2013 — 2018) — Hindu College of Engineering.`
    },
    {
      keywords: ['projects', 'jumpstreet', 'noc portal', 'automator', 'code', 'github projects'],
      response: `Key highlight projects:
• State NOC Admin Portal: Dashboard featuring engineering directory, link status checkers, and voice-input enabled Ollama LLM RAG chatbot (HTML/CSS, PHP, Ollama).
• Jumpstreet Portal: Algorithmic trading and cloud hosting infrastructure portal simulation (React 19, Vite 6, Tailwind v4, TS).
• CDAC Audit Automator: PowerShell script automating 120+ CDAC compliance checks, reducing manual effort by 60%.`
    },
    {
      keywords: ['contact', 'email', 'phone', 'linkedin', 'github', 'reach', 'hire', 'call'],
      response: `You can reach Aditya directly via:
• Email: aavkjain@hotmail.com
• Phone: +91 98975 77007
• LinkedIn: linkedin.com/in/ajainx1
• GitHub: github.com/ajainx1
(Feel free to click the links in the footer or contact section!)`
    },
    {
      keywords: ['resume', 'cv', 'pdf', 'download resume'],
      response: `You can download Aditya's professional resume here:
[Aditya_Jain_Resume.pdf](Aditya_Jain_Cybersecurity_Resume_Professional.pdf)
Let me know if you have any questions about his experience!`
    },
    {
      keywords: ['htb', 'hack the box', 'vulnlab', 'labs', 'rank', 'oscp target'],
      response: `Aditya is highly active in offensive labs:
• Hack The Box: Active network pentesting, privilege escalation, and Active Directory exploitation.
• Vulnlab: Working on multi-machine Active Directory chains, network pivoting, and domain controller compromise.`
    },
    {
      keywords: ['help', 'commands', 'ask', 'question', 'menu'],
      response: `You can ask me about:
• Aditya's role & summary ('whoami')
• Technical skills & tools ('skills')
• Work history & experience ('experience')
• Certifications ('certs')
• Education details ('education')
• Key projects ('projects')
• Contact links ('contact')
• Target certifications ('htb')`
    },
    {
      keywords: ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo'],
      response: `Hello! I am Aditya's AI Assistant. Ask me anything about his skills, experience, projects, or certifications. Type 'help' to see what I can do!`
    }
  ];

  function getLocalResponse(query) {
    const cleanQuery = query.toLowerCase().trim();
    for (const item of resumeKB) {
      if (item.keywords.some(k => cleanQuery.includes(k))) {
        return item.response;
      }
    }
    return `I'm not sure about that specific question, but I can tell you about Aditya's skills, work history, certifications, projects, or how to contact him.
    
Try asking: "What certifications does he have?" or "Where does he work?"`;
  }

  async function getAIResponse(userQuery) {
    // Check if visitor has set a custom Gemini API key
    const customKey = localStorage.getItem('GEMINI_API_KEY');
    if (!customKey) {
      // Return local KB response
      await new Promise(r => setTimeout(r, 600)); // Simulating natural thinking delay
      return getLocalResponse(userQuery);
    }

    const systemInstruction = `You are aditya_bot_agent, the official AI assistant on Aditya Jain's portfolio.
Aditya Jain is a Cybersecurity Engineer & Red Team Aspirant based in India.
Answer questions from recruiters or visitors about Aditya's profile, skills, experience, and contact info in a professional, helpful, and concise manner.
Keep your answers direct, technical, and formatted with clean bullet points.
If the query is not related to Aditya or cybersecurity, politely redirect the conversation to his portfolio.

ADITYA'S RESUME DATA:
- Role: Cybersecurity Engineer / Red Team Aspirant
- Location: India (Open to Remote / Relocation worldwide)
- Contact: Email: aavkjain@hotmail.com | Phone: +91 98975 77007
- LinkedIn: linkedin.com/in/ajainx1 | GitHub: github.com/ajainx1
- Target Certifications: Target OSCP (Q4 2026), CEH v13 (Q3 2026), CISSP
- Current Certifications: RHCSA, FCAC, EC-Council SOC, CU Boulder Cryptography, Star Certification Ethical Hacking Expert.
- Experience:
  1. Security Administrator @ NIC via Ebix (3+ years): Tune SentinelOne EDR for 750+ endpoints, Check Point NGFW, CDAC/CERT-In compliance, PowerShell audit automation.
  2. SOC Analyst @ Nuclear Fuel Complex: Wazuh/Kaspersky EDR (35% detection rate boost).
  3. SOC Analyst @ E2E Networks: Wazuh SIEM monitoring, Snort/Wazuh rule writing, packet analysis.
- Education: MBA in Cybersecurity (Expected 2027, Chitkara University) | B.Tech CSE (Manipal University Jaipur).
- Projects: Jumpstreet Portal, State NOC Admin Portal, CDAC Audit Automator (PowerShell).`;

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

      if (!response.ok) throw new Error('Gemini API call failed');
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (err) {
      console.error(err);
      return "Error connecting to Gemini API. Falling back to offline database:\n\n" + getLocalResponse(userQuery);
    }
  }

  function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.classList.add('ai-msg', sender);
    
    // Simple markdown formatting (replace links and linebreaks)
    let formatted = text.replace(/\n/g, '<br>');
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href=\"$2\" target=\"_blank\">$1</a>');
    formatted = formatted.replace(/•/g, '<span style="color:var(--green)">•</span>');
    msg.innerHTML = formatted;
    
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async function handleSend() {
    const text = inputEl.value.trim();
    if (!text) return;
    
    appendMessage('user', text);
    inputEl.value = '';
    
    // Add typing indicator
    const typing = document.createElement('div');
    typing.classList.add('ai-msg', 'bot', 'typing-indicator');
    typing.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const reply = await getAIResponse(text);
    
    typing.remove();
    appendMessage('bot', reply);
  }

  // Event Listeners
  toggleBtn.addEventListener('click', () => {
    windowEl.classList.toggle('active');
    if (windowEl.classList.contains('active')) {
      inputEl.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    windowEl.classList.remove('active');
  });

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Event delegation for chips
  document.querySelectorAll('.ai-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.query;
      inputEl.value = q;
      handleSend();
    });
  });

  // Custom Cursor hover registration for dynamic elements
  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  const addHover = (el) => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(1.8)';
      ring.style.opacity = '.5';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.opacity = '1';
    });
  };
  addHover(toggleBtn);
  addHover(closeBtn);
  addHover(sendBtn);
  document.querySelectorAll('.ai-chip-btn').forEach(addHover);

  // Expose advanced API key setter
  window.setGeminiKey = (key) => {
    if (!key) {
      localStorage.removeItem('GEMINI_API_KEY');
      return 'Key removed. Using local matching engine.';
    }
    localStorage.setItem('GEMINI_API_KEY', key);
    return 'Gemini API Key saved successfully. Real-time LLM mode active.';
  };
})();
