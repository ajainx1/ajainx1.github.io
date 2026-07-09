class ThemeToggle {
  constructor() {
    this.themeBtns = document.querySelectorAll('.theme-toggle-btn');
    this.init();
  }

  init() {
    // Check local storage for theme
    const savedTheme = localStorage.getItem('siteTheme');
    if (savedTheme === 'light') {
      document.body.classList.add('theme-light');
      this.updateIcon('light');
    }

    // Attach listeners
    this.themeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTheme();
      });
    });
  }

  toggleTheme() {
    const isLight = document.body.classList.contains('theme-light');
    if (isLight) {
      document.body.classList.remove('theme-light');
      localStorage.setItem('siteTheme', 'dark');
      this.updateIcon('dark');
    } else {
      document.body.classList.add('theme-light');
      localStorage.setItem('siteTheme', 'light');
      this.updateIcon('light');
    }
  }

  updateIcon(theme) {
    this.themeBtns.forEach(btn => {
      if (theme === 'light') {
        btn.innerHTML = '🌙 Dark Mode';
        btn.style.color = 'var(--fg)';
        btn.style.borderColor = 'var(--border)';
      } else {
        btn.innerHTML = '☀️ Light Mode';
        btn.style.color = '#fff';
        btn.style.borderColor = 'rgba(255,255,255,0.2)';
      }
    });
  }
}

// Auto-initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeToggle();
  });
} else {
  new ThemeToggle();
}
