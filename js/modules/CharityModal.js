import { charities } from '../data/charities.js';

export class CharityModal {
  constructor() {
    this.modalId = 'charity-modal';
    this.isOpen = false;
    this.init();
  }

  init() {
    if (document.getElementById(this.modalId)) return; // Prevent duplicates
    this.injectStyles();
    this.buildModal();
    this.attachEvents();
  }

  injectStyles() {
    if (document.getElementById('charity-styles')) return;

    const style = document.createElement('style');
    style.id = 'charity-styles';
    style.textContent = `
      .charity-modal-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(5px);
      }
      .charity-modal-overlay.active {
        opacity: 1;
        pointer-events: auto;
      }
      .charity-modal-content {
        background: #0f0f0f;
        border: 1px solid #33ff00; /* Cyber green */
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        padding: 2rem;
        box-shadow: 0 0 30px rgba(51, 255, 0, 0.15);
        color: #e0e0e0;
        position: relative;
        transform: translateY(-20px);
        transition: transform 0.3s ease;
        font-family: 'Inter', sans-serif;
      }
      .charity-modal-overlay.active .charity-modal-content {
        transform: translateY(0);
      }
      .charity-close-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        background: transparent;
        border: none;
        color: #33ff00;
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.2s, transform 0.2s;
        line-height: 1;
      }
      .charity-close-btn:hover {
        color: #fff;
        transform: scale(1.1);
      }
      .charity-title {
        margin-top: 0;
        color: #33ff00;
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.5rem;
        border-bottom: 1px dashed #33ff00;
        padding-bottom: 10px;
      }
      .charity-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 20px;
      }
      .charity-item {
        display: flex;
        flex-direction: column;
        padding: 15px;
        border: 1px solid #222;
        border-radius: 6px;
        text-decoration: none;
        color: inherit;
        transition: all 0.2s ease;
        background: #151515;
      }
      .charity-item:hover {
        border-color: #33ff00;
        background: rgba(51, 255, 0, 0.05);
        transform: translateX(4px);
      }
      .charity-item h3 {
        margin: 0 0 6px 0;
        font-size: 1.1rem;
        color: #fff;
        font-family: 'JetBrains Mono', monospace;
      }
      .charity-item p {
        margin: 0;
        font-size: 0.9rem;
        color: #aaa;
        line-height: 1.4;
      }
    `;
    document.head.appendChild(style);
  }

  buildModal() {
    const overlay = document.createElement('div');
    overlay.className = 'charity-modal-overlay';
    overlay.id = this.modalId;

    let listHtml = charities.map(charity => `
      <a href="${charity.url}" target="_blank" rel="noopener noreferrer" class="charity-item">
        <h3>> ${charity.name}</h3>
        <p>${charity.description}</p>
      </a>
    `).join('');

    overlay.innerHTML = `
      <div class="charity-modal-content">
        <button class="charity-close-btn" id="charity-close" aria-label="Close Modal">&times;</button>
        <h2 class="charity-title">Support a Cause</h2>
        <p style="font-size: 0.95rem; color: #ccc; margin-bottom: 20px;">Play the interactive Cyber FreeRice game. For every correct answer, rice is donated to global food programs!</p>
        
        <a href="charity-quiz.html" class="charity-item" style="border-color: #33ff00; background: rgba(51,255,0,0.1); margin-bottom: 15px; text-align: center;">
          <h3 style="color: #33ff00;">🕹️ Play Cyber FreeRice</h3>
          <p style="color: #eee;">Test your SecOps knowledge and donate rice to those in need!</p>
        </a>
      </div>
    `;

    document.body.appendChild(overlay);
    this.modal = overlay;
  }

  attachEvents() {
    // Close on button click
    const closeBtn = this.modal.querySelector('#charity-close');
    closeBtn.addEventListener('click', () => this.close());

    // Close on overlay click (clicking outside the modal box)
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  open() {
    this.modal.classList.add('active');
    this.isOpen = true;
  }

  close() {
    this.modal.classList.remove('active');
    this.isOpen = false;
  }
}
