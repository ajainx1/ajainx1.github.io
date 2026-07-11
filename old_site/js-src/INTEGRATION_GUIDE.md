# Jumpstreet — GitHub Pages Integration Guide

This guide details exactly how to integrate this **Jumpstreet** web application into your existing personal website hosted at **ajainx1.github.io**.

---

## 🛠️ Option 1: Deploy as a Sub-page (Recommended)
You can deploy this application so that it is hosted at a sub-path on your main domain, for example: `https://ajainx1.github.io/jumpstreet/` or `https://ajainx1.github.io/bot-fixed/`.

### Step 1: Export Project Files
1. Open the **Settings Menu** in the AI Studio builder.
2. Select **Export to GitHub** (to push to a new or existing repository) or **Download ZIP** (to extract and manage locally).

### Step 2: Configure the Base Path
We have pre-configured `vite.config.ts` to read the base path from an environment variable:
```typescript
base: process.env.VITE_BASE_PATH || '/'
```
- If your repository name is **`jumpstreet`**, change `VITE_BASE_PATH` in `.github/workflows/deploy.yml` (line 31) from `'/'` to `'/jumpstreet/'`.

### Step 3: Automatic GitHub Actions Deployment
We have created an automated deployment workflow file at `.github/workflows/deploy.yml`. 
1. Create a repository on your GitHub account (e.g. named `jumpstreet`).
2. Push this project code to the `main` branch of that repository.
3. Go to your repository settings on GitHub:
   - **Settings** > **Pages**
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select the **`gh-pages`** branch (which will be created automatically by the GitHub Action workflow after pushing) and `/ (root)`.
4. Your application will be live at `https://ajainx1.github.io/your-repository-name/`!

---

## 🖼️ Option 2: Embed via an Elegant Responsive Iframe
If you want to keep your existing home page intact and seamlessly display the Jumpstreet app within a section of `ajainx1.github.io`, you can embed it using a styled responsive iframe.

Copy and paste this clean, modern snippet into your existing `index.html` file on `ajainx1.github.io`:

```html
<!-- Jumpstreet Verification Portal Integration Embed -->
<div class="jumpstreet-container" style="
  width: 100%; 
  max-width: 1200px; 
  margin: 2rem auto; 
  background: #0a0a0a; 
  border: 1px solid rgba(255, 255, 255, 0.1); 
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
">
  <!-- Section Title -->
  <div style="
    padding: 1rem 1.5rem; 
    border-b: 1px solid rgba(255, 255, 255, 0.1); 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    font-family: monospace; 
    text-transform: uppercase; 
    font-size: 11px; 
    letter-spacing: 0.1em; 
    color: #a3a3a3;
  ">
    <span>SYSTEM NODE: JUMPSTREET PORTAL</span>
    <span style="color: #60a5fa;">● SECURE LIVE</span>
  </div>

  <!-- Responsive IFrame Frame -->
  <iframe 
    src="https://ais-pre-3nc2sllf2rm46su77qoxzx-1055205593681.asia-southeast1.run.app" 
    title="Jumpstreet - Bot Fixed Platform Node"
    referrerpolicy="no-referrer"
    style="
      width: 100%; 
      height: 750px; 
      border: none; 
      display: block; 
      background: #0a0a0a;
    "
  ></iframe>
</div>
```

*Note: Replace the `src="..."` URL with your final deployed GitHub Pages URL once Option 1 or Option 3 is complete.*

---

## 🚀 Option 3: Replace the Root of ajainx1.github.io
If you want this new application to completely take over as the primary landing page for your personal domain (`https://ajainx1.github.io/`):

1. Clone or download the files of your existing `ajainx1.github.io` repository.
2. Replace all the contents of that repository directory with the contents of this exported project.
3. In `.github/workflows/deploy.yml`, make sure `VITE_BASE_PATH` is set to `'/'` (root).
4. In your GitHub repository settings under **Pages**, set the deployment source to **GitHub Actions** instead of deploying from a branch.
5. Push the code to the main branch. The Action workflow will build the project and deploy it directly as the root website!
