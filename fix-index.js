const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Update OG Images
html = html.replace(/https:\/\/images\.unsplash\.com\/photo-[^?\"']+/g, 'https://ajainx1.github.io/og_image.png');
html = html.replace(/\?auto=format&fit=crop&q=80&w=1200/g, '');

// 2. Add Resume Button in Hero
const heroBtns = '<div class="hero-btns">';
if (html.includes(heroBtns) && !html.includes('[ Download PDF Resume ]')) {
    html = html.replace(heroBtns, heroBtns + '\n          <a href="/resume.pdf" class="btn btn-primary" target="_blank">[ Download PDF Resume ]</a>');
}

// 3. Add PGP Block in Contact Section
const cgrid = '<div class="cgrid">';
if (html.includes(cgrid) && !html.includes('Secure Comms')) {
    const pgpBlock = `
        <div class="clink glass-card" style="grid-column: 1 / -1; cursor: default; flex-direction: column; align-items: flex-start; gap: 0.5rem;" onclick="">
          <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
            <div><div class="lbl">Secure Comms</div><div class="val text-green glow">PGP Public Key</div></div>
            <span class="arr" style="transform: rotate(90deg);">&#8628;</span>
          </div>
          <div style="width: 100%; background: rgba(0,0,0,0.4); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border); font-family: var(--mono); font-size: 0.75rem; color: var(--muted); margin-top: 0.5rem; user-select: all;">
            curl -s https://ajainx1.github.io/pgp.asc | gpg --import
          </div>
        </div>
    `;
    html = html.replace(cgrid, cgrid + pgpBlock);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html');
