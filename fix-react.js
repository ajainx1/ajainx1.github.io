const fs = require('fs');
let content = fs.readFileSync('js/assets/index-BHm-A0It.js', 'utf8');

// 1. CTA Upgrade
content = content.replace(/Apply to Checkout/g, 'Buy Now — UPI / Card');

// 2. Ticker rewrite
const oldTicker = 'const Bd=["🚀 HFT Signal Suite (JumpStreet Bot v4.0) indicator package now live","📡 High-Availability Windows VMs in stock — 14 units remaining","⚡ Sub-millisecond Windows Cloud VMs available 24/7","? Instant license delivery & 5-minute VM provisioning","🤖 Automated watchdogs pre-installed on all VMs","💳 UPI, GPay & International Card payments accepted","🔒 Managed by Jumpstreet — A Mangalik & Sons Securities","📈 Avg signal latency: 1.2ms via Jumpstreet API"];';
const newTicker = 'const Bd=["🚀 JumpStreet Bot — AI-Powered Trading","🔥 Advanced 7-Indicator Confluence Engine","⚡ Engineered for Speed — 1.2ms Avg Latency","📡 Premium High-Availability Cloud Infrastructure","💳 Secure UPI & International Card Payments","🔒 A Mangalik & Sons Venture Ltd."];';

if (content.includes(oldTicker)) {
    content = content.replace(oldTicker, newTicker);
} else {
    // If exact match fails, use regex
    content = content.replace(/const Bd=\[.*?\];/, newTicker);
}

// 3. Color scheme upgrade
// Replaces blue text classes with green
content = content.replace(/text-blue-400/g, 'text-green-500');
content = content.replace(/bg-blue-400/g, 'bg-green-500');
content = content.replace(/bg-blue-500/g, 'bg-green-600');

// Replace specific hex codes with Green and Gold
content = content.replace(/#38bdf8/g, '#2E7D32'); // Green
content = content.replace(/#60a5fa/g, '#FFD700'); // Gold
content = content.replace(/#3b82f6/g, '#2E7D32'); // Green
content = content.replace(/#1d4ed8/g, '#FFD700'); // Gold (for gradients)

// 4. Headline / Logo upgrade
// In the header, there's "Jumpstreet" text. Let's make it the requested headline if possible.
// Finding the header logo area:
content = content.replace(/"Jumpstreet"/g, '"JumpStreet Bot"');
content = content.replace(/"Mangalik & Sons Venture Ltd."/g, '"AI-Powered Trading. Engineered for Speed."');
content = content.replace(/"Jumpstreet — A Mangalik and Sons Venture Limited"/g, '"JumpStreet Systems — A Mangalik & Sons Venture"');

fs.writeFileSync('js/assets/index-BHm-A0It.js', content, 'utf8');
console.log('Updated React bundle for JumpStreet overhaul.');
