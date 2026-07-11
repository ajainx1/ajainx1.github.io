const fs = require('fs');
let html = fs.readFileSync('js/index.html', 'utf8');

html = html.replace(/Bot Fixed/g, 'JumpStreet Bot');
html = html.replace(/bot fixed/g, 'jumpstreet bot');
html = html.replace(/and imported 5G SIM Hotspots\./g, '');
html = html.replace(/and imported 5G SIM Hotspots/g, '');
html = html.replace(/, and ordered imported 5G SIM Hotspots/g, '');
html = html.replace('trading alerts, windows cloud vm, jumpstreet, mangalik sons, telegram webhook, algo trading india', 'jumpstreet bot, ai trading bot, hft signal suite, algorithmic trading india, cloud vm trading, mangalik sons');
html = html.replace('<meta name="theme-color" content="#0A0A0A" />', '<meta name="theme-color" content="#2E7D32" />');

fs.writeFileSync('js/index.html', html, 'utf8');
console.log('Updated js/index.html');
