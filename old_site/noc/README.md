# State NOC Interactive Administration Portal & AI Assistant

A high-performance, responsive administrative dashboard designed for State Network Operations Centers (NOC) to monitor infrastructure status, query support contact directories, search dynamically uploaded network documents, and interact with an AI-powered NOC agent.

This repository represents a **fully sanitized, public-ready demonstration version** of a real NOC portal, with all sensitive private IP addresses, system domains, and employee contact database records (PII) mapped to safe simulated mockups for compliance and security.

---

## 🚀 Key Features

* **Interactive Operations Directory**: Dynamic, clickable node panel linked to a support database. Easily lookup local District Informatics Officers (DIOs) and FMS Engineers.
* **Live Link Outages Monitor**: Real-time status tracker polling switch and router availability, dynamically displaying alerts for downtime.
* **Dynamic File Repository**: Secured, drag-and-drop enabled file upload console (supporting logs/reports up to 500MB) integrated with a dynamic, searchable document explorer.
* **Voice-Enabled AI Chatbot**: Built-in floating chat assistant integrated with a local LLM (Qwen2.5 via Ollama) and client-side synonym-expanded RAG (Retrieval-Augmented Generation) to search the support directory.
* **Interactive Network Background**: An animated, mouse-reactive HTML5 Canvas particle system reflecting a network grid overlay in the hero dashboard.
* **Milestone Celebrations**: Includes an interactive canvas fireworks/rocket celebration modal to reward milestone website visits.
* **Hardened Security Frontend**: Custom UI safeguards that restrict right-click context menus, prevent developer tools access (F12, Ctrl+Shift+I), and disable source code viewing (Ctrl+U).

---

## 🛠️ Technology Stack

* **Frontend**: Semantic HTML5, Vanilla ES6 JavaScript (Async/Await, Web Speech API, Canvas API)
* **Styling**: Modern CSS3 Custom Properties (Variables), Flexbox/Grid Layouts, and Smooth Transitions (no bloated frameworks)
* **Backend**: PHP (Directory scanning, socket connection testing, and LLM NdJSON stream proxying)
* **AI Model**: `qwen2.5:1.5b` (orchestrated locally via Ollama)

---

## 📂 Project Structure

```text
├── alert/
│   ├── api.php           # Simulated outages feed JSON generator
│   └── index.php         # Incident response portal (visual mock)
├── uploads/              # District uploads destination folder (auto-scanned)
├── index.html            # Main dashboard HTML (fully sanitized)
├── contacts.json         # Sanitized mock database (fake names, emails, & numbers)
├── get_files.php         # Scans local uploads folder and outputs registry list
├── ping.php              # Secure port/socket tester returning connection times
├── chat.php              # Proxy to stream Ollama LLM queries (with offline fallback)
├── counter.php           # Visitor count increments tracker
└── README.md             # Project documentation
```

---

## 💻 Local Setup Instructions

### Prerequisites
1. **PHP**: Ensure PHP 7.4+ is installed on your machine.
2. **Ollama (Optional for Chatbot)**: To run the AI assistant offline:
   * Download and install from [ollama.com](https://ollama.com).
   * Run in terminal: `ollama run qwen2.5:1.5b`

### Run the Application
1. Clone this repository to your local workspace:
   ```bash
   git clone https://github.com/your-username/state-noc-portal.git
   cd state-noc-portal
   ```
2. Create an `uploads` folder and add a few dummy files:
   ```bash
   mkdir uploads
   mkdir "uploads/Patna Node Details"
   echo "sample content" > "uploads/Patna Node Details/network-ips.xlsx"
   ```
3. Start the built-in PHP development server:
   ```bash
   php -S localhost:8000
   ```
4. Open your web browser and navigate to:
   ```text
   http://localhost:8000
   ```

---

## 🔒 Compliance & Sanitation Policy

This repository has been fully audited to ensure no sensitive enterprise details are exposed:
* **Infrastructure**: Private intranet IPs (`10.133.x.x`) are mapped to clean sandbox addresses (`192.168.x.x`) or standard domain hostnames (`*.state-noc.org`).
* **PII**: All employee names, phone numbers, and official emails have been generated using randomized fake datasets in `contacts.json`.
* **API Handlers**: Backend commands are sandboxed. The socket ping test is restricted to predefined target keys and mapped securely on the backend to avoid server-side request forgery (SSRF).
