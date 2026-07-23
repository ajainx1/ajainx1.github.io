"use client";
import { useEffect } from 'react';

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || "";

export default function TelegramVisitorLogger() {
  useEffect(() => {
    const sessionKey = "tg_visitor_logged_" + window.location.pathname;
    if (sessionStorage.getItem(sessionKey)) return;

    const logVisitor = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let ipData: Record<string, any> = {};
        try {
          const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
          if (res.ok) {
            ipData = await res.json();
          }
        } catch {}

        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const deviceType = isMobile ? "📱 Mobile Device" : "💻 Desktop Computer";
        const referrer = document.referrer || "Direct / Bookmark";
        const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

        const message = `🚨 <b>NEW VISITOR ON WEBSITE</b> 🚨\n\n` +
          `🌐 <b>Domain:</b> ${window.location.hostname}\n` +
          `📄 <b>Page Path:</b> <code>${window.location.pathname}</code>\n` +
          `💻 <b>Device:</b> ${deviceType}\n` +
          `📍 <b>IP:</b> <code>${ipData.ip || 'Hidden / Protected'}</code>\n` +
          `🏙️ <b>City:</b> ${ipData.city || 'N/A'}, ${ipData.country_name || 'N/A'}\n` +
          `📡 <b>Network:</b> ${ipData.org || 'N/A'}\n` +
          `🔗 <b>Source:</b> ${referrer}\n` +
          `⏰ <b>Timestamp:</b> ${timestamp} IST\n` +
          `⚙️ <b>User Agent:</b> <code>${userAgent.slice(0, 90)}...</code>`;

        sessionStorage.setItem(sessionKey, "true");

        const token = TELEGRAM_BOT_TOKEN;
        const chatId = TELEGRAM_CHAT_ID;

        if (token && chatId) {
          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: "HTML",
            }),
          });
        }
      } catch (err) {
        console.error("Telegram visitor logger notice:", err);
      }
    };

    logVisitor();
  }, []);

  return null;
}
