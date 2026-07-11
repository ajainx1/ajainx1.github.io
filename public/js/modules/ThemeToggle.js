class ThemeToggle {
  constructor() {
    this.themeBtns = document.querySelectorAll('.theme-toggle-btn');
    this.init();
  }

  init() {
    // Check local storage for theme
    const savedTheme = localStorage.getItem('siteTheme');
    
    // Default is light. If user explicitly saved dark, add dark-mode
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      this.updateIcon('dark');
    } else {
      // Light is default
      document.body.classList.remove('dark-mode');
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
    const isDark = document.body.classList.contains('dark-mode');
    if (isDark) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('siteTheme', 'light');
      this.updateIcon('light');
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('siteTheme', 'dark');
      this.updateIcon('dark');
    }
  }

  updateIcon(theme) {
    this.themeBtns.forEach(btn => {
      if (theme === 'dark') {
        btn.innerHTML = '☀️ Light Mode';
        btn.style.color = '#fff';
        btn.style.borderColor = 'rgba(255,255,255,0.2)';
      } else {
        btn.innerHTML = '🌙 Dark Mode';
        btn.style.color = 'var(--fg)';
        btn.style.borderColor = 'var(--border)';
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
