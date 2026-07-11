const fs = require('fs');
let html = fs.readFileSync('js/index.html', 'utf8');

// Replace CTA links
html = html.replace(/<a href=\"#\" class=\"btn btn-primary\">Buy Now — UPI \/ GPay<\/a>/, '<a href=\"upi://pay?pa=adityasec32@okicici&pn=JumpStreet%20Systems&am=999&cu=INR\" class=\"btn btn-primary\">Buy Now — UPI / GPay</a>');
html = html.replace(/<a href=\"#\" class=\"btn btn-secondary\">View VM Bundle<\/a>/, '<a href=\"upi://pay?pa=adityasec32@okicici&pn=JumpStreet%20Systems&am=1499&cu=INR\" class=\"btn btn-secondary\">Buy VM Bundle (₹1499)</a>');

// Replace contact links
html = html.replace(/<a href=\"#\">Telegram<\/a>/, '<a href=\"https://t.me/jumpstreet_bot\" target=\"_blank\">Telegram</a>');
html = html.replace(/<a href=\"#\">support@jumpstreet.systems<\/a>/, '<a href=\"mailto:adityasec32@gmail.com\">adityasec32@gmail.com</a>');

fs.writeFileSync('js/index.html', html, 'utf8');
console.log('Updated links in js/index.html');
