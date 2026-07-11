
const fs = require("fs");
let content = fs.readFileSync("js/assets/index-BHm-A0It.js", "utf8");

// Part 1: Corporate Overview text replacement
content = content.replace("indicator platform) and direct imports of industrial-grade 5G routers and enterprise J-SIM setups.", "indicator platform). We also provide the underlying infrastructure (IaaS, PaaS, SaaS) to run it with zero downtime.");

// Part 2: Remove 5G Hotspot entirely
const hString = `{id:"5g_hotspot",name:"Jumpstreet 5G SIM Hotspot",description:"Industrial-grade low-latency 5G portable router unlocked for Airtel & Jio. Japan/China import.",price:3499,currency:"INR",badge:"Hardware Import",type:"hotspot",image:"/js/5g_hotspot.png",specs:["High-speed 5G downlink up to 1.8 Gbps","Unlocked multi-band support (JP/CN/IN bands)","Ultra low-latency gaming/trading firmware","Rechargeable 4500mAh battery (12 hrs active)","Ideal for backup internet redundancy"]}`;
content = content.replace("," + hString, "");

// Part 3: Remove Pro Trader Bundle entirely
const pString = `{id:"pro_trader_bundle",name:"Pro Trader Ultimate Bundle",description:"The definitive algorithmic trading gear. Premium Bot Fixed + Windows VM + 5G SIM Hotspot.",price:4499,currency:"INR",badge:"Ultimate Elite",type:"bundle",image:"/js/pro_trader_bundle.png",specs:["All Premium VM Bundle benefits (Save ?1000+!)","Physical 5G SIM Hotspot shipped express","Free VIP priority shipping within India","Jumpstreet 1-on-1 private optimisation session","Lifetime software upgrades & developer hotline"]}`;
content = content.replace("," + pString, "");

// Part 4: Update Bot Standard specs
content = content.replace(/"Telegram, WhatsApp & Signal Webhook Alerts"/g, `"7-Indicator Engine (EMA, MACD, RSI, ATR, Supertrend, Vol Profile, Squeeze)"`);
content = content.replace(/"Fully custom strategies implementation"/g, `"MT5 Integration with dynamic Trailing Stop Loss"`);
content = content.replace(/"No VM headache — direct web API hooks"/g, `"Strict risk control (Daily loss caps & Lot limits)"`);
content = content.replace(/"Jumpstreet 0-latency engine access"/g, `"Real-time Telegram Alert Webhooks"`);
content = content.replace(/"24\/7 client-side running capability"/g, `"Jumpstreet 0-latency execution engine access"`);

// Part 5: Update Bot Premium specs
content = content.replace(/"Includes 1 Month Bot Fixed License"/g, `"Includes 7-Indicator HFT Signal Suite License"`);
content = content.replace(/"Pre-installed on Windows Cloud VM \(2GB ECC RAM, 1 vCPU\)"/g, `"Pre-installed on Windows Cloud VM (2GB ECC RAM, 1 vCPU)"`);
content = content.replace(/"Jumpstreet \\"Tricks Implementation\\" \(Watchdogs & Anti-crash\)"/g, `"MT5 Auto-Login & Watchdog Anti-Crash Scripts"`);
content = content.replace(/"Premium custom integration techniques included"/g, `"0-Downtime Infrastructure (IaaS & PaaS)"`);
content = content.replace(/"Fully set up — 0 configuration needed"/g, `"Fully configured out-of-the-box — 0 setup needed"`);

fs.writeFileSync("js/assets/index-BHm-A0It.js", content, "utf8");
console.log("Fixed file successfully!");

