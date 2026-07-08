import { quizData } from '../data/quiz-questions.js';

export class CharityQuiz {
  constructor() {
    this.score = parseInt(localStorage.getItem('charityRiceScore') || '0', 10);
    this.streak = 0; // Track consecutive correct answers
    this.currentCategory = 'cybersecurity'; // Default category
    this.currentQuestion = null;
    
    // DOM Elements
    this.questionElement = document.getElementById('quiz-question');
    this.optionsElement = document.getElementById('quiz-options');
    this.scoreElement = document.getElementById('rice-score');
    this.feedbackElement = document.getElementById('quiz-feedback');
    this.streakBadge = document.getElementById('streak-badge');
    this.headerLogo = document.getElementById('quiz-header-logo');
    this.categoryPills = document.querySelectorAll('.category-pill');
    
    // Appreciation Visual
    this.plateIcon = document.getElementById('plate-icon');
    this.floatingHeart = document.getElementById('floating-heart');
    
    // Auth Elements
    this.gLoginBtn = document.getElementById('g-login-btn');
    this.phoneLoginBtn = document.getElementById('phone-login-btn');
    this.userProfile = document.getElementById('user-profile');
    this.userAvatar = document.getElementById('user-avatar');
    this.userName = document.getElementById('user-name');
    this.logoutBtn = document.getElementById('logout-btn');
    this.demoLoginBtn = document.getElementById('demo-login-btn');
    this.currentUser = null;
    
    // Phone Auth Modal Elements
    this.phoneModal = document.getElementById('phone-auth-modal');
    this.closePhoneModal = document.getElementById('close-phone-modal');
    this.stepPhone = document.getElementById('step-phone');
    this.stepOtp = document.getElementById('step-otp');
    this.phoneInput = document.getElementById('phone-input');
    this.sendCodeBtn = document.getElementById('send-code-btn');
    this.otpInput = document.getElementById('otp-input');
    this.verifyCodeBtn = document.getElementById('verify-code-btn');
    this.confirmationResult = null;
    
    this.init();
    
    // Attach Google Auth callback to window
    window.handleCredentialResponse = (response) => this.handleGoogleLogin(response);
    
    if(this.logoutBtn) {
      this.logoutBtn.addEventListener('click', () => this.handleLogout());
    }
    if(this.phoneLoginBtn) {
      this.phoneLoginBtn.addEventListener('click', () => this.openPhoneModal());
    }
    if(this.demoLoginBtn) {
      this.demoLoginBtn.addEventListener('click', () => this.handleDemoLogin());
    }
    if(this.closePhoneModal) {
      this.closePhoneModal.addEventListener('click', () => { this.phoneModal.style.display = 'none'; });
    }
    if(this.sendCodeBtn) {
      this.sendCodeBtn.addEventListener('click', () => this.sendSmsCode());
    }
    if(this.verifyCodeBtn) {
      this.verifyCodeBtn.addEventListener('click', () => this.verifyOtp());
    }
  }

  init() {
    this.loadUserSession();
    this.updateScoreDisplay();
    this.attachCategoryListeners();
    this.setCategory(this.currentCategory);
  }

  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch(e) {
      return null;
    }
  }

  handleGoogleLogin(response) {
    const payload = this.parseJwt(response.credential);
    if (payload) {
      this.loginUser(payload.name, payload.email, payload.picture);
    }
  }

  // --- Phone Auth Logic ---
  openPhoneModal() {
    this.phoneModal.style.display = 'flex';
    this.stepPhone.style.display = 'block';
    this.stepOtp.style.display = 'none';
    
    if (!window.recaptchaVerifier && window.firebaseDependencies) {
      try {
        window.recaptchaVerifier = new window.firebaseDependencies.RecaptchaVerifier(window.firebaseAuth, 'recaptcha-container', {
          'size': 'normal',
          'callback': (response) => { }
        });
        window.recaptchaVerifier.render();
      } catch(e) { console.log('Firebase not fully configured yet'); }
    }
  }

  sendSmsCode() {
    const phoneNumber = this.phoneInput.value;
    if (!phoneNumber) return alert('Please enter a phone number');
    
    if (!window.firebaseAuth) return alert('Firebase keys missing! (Placeholder logic blocked)');
    
    window.firebaseDependencies.signInWithPhoneNumber(window.firebaseAuth, phoneNumber, window.recaptchaVerifier)
      .then((confirmationResult) => {
        this.confirmationResult = confirmationResult;
        this.stepPhone.style.display = 'none';
        this.stepOtp.style.display = 'block';
      }).catch((error) => {
        alert("SMS failed: " + error.message);
      });
  }

  verifyOtp() {
    const code = this.otpInput.value;
    if (this.confirmationResult && code) {
      this.confirmationResult.confirm(code).then((result) => {
        const user = result.user;
        this.phoneModal.style.display = 'none';
        this.loginUser("Phone User", user.phoneNumber, "https://ui-avatars.com/api/?name=Phone+User&background=33ff00&color=000");
      }).catch((error) => {
        alert("Invalid code: " + error.message);
      });
    }
  }

  handleDemoLogin() {
    this.loginUser("Aditya Jain (Demo)", "demo@adityasec32.systems", "https://ui-avatars.com/api/?name=Aditya+Jain&background=33ff00&color=000");
  }

  loginUser(name, id, picture) {
    this.currentUser = { name, email: id, picture };
    localStorage.setItem('charityQuizUser', JSON.stringify(this.currentUser));
    const userScore = localStorage.getItem(`charityRiceScore_${id}`);
    if (userScore) this.score = parseInt(userScore, 10);
    this.updateAuthUI();
    this.updateScoreDisplay();
  }

  handleLogout() {
    this.currentUser = null;
    localStorage.removeItem('charityQuizUser');
    this.score = 0; // Reset active score for guest
    this.updateAuthUI();
    this.updateScoreDisplay();
  }

  loadUserSession() {
    const savedUser = localStorage.getItem('charityQuizUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      const userScore = localStorage.getItem(`charityRiceScore_${this.currentUser.email}`);
      if (userScore) {
        this.score = parseInt(userScore, 10);
      }
      this.updateAuthUI();
    }
  }

  updateAuthUI() {
    if (!this.userProfile) return;
    
    if (this.currentUser) {
      if(this.gLoginBtn) this.gLoginBtn.style.display = 'none';
      if(this.phoneLoginBtn) this.phoneLoginBtn.style.display = 'none';
      if(this.demoLoginBtn) this.demoLoginBtn.style.display = 'none';
      this.userProfile.style.display = 'flex';
      if (this.userName) this.userName.textContent = this.currentUser.name;
      if (this.userAvatar) this.userAvatar.src = this.currentUser.picture;
    } else {
      if(this.gLoginBtn) this.gLoginBtn.style.display = 'block';
      if(this.phoneLoginBtn) this.phoneLoginBtn.style.display = 'flex';
      if(this.demoLoginBtn) this.demoLoginBtn.style.display = 'flex';
      this.userProfile.style.display = 'none';
    }
  }

  attachCategoryListeners() {
    this.categoryPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const selectedCat = e.target.getAttribute('data-category');
        
        // Update active class on pills
        this.categoryPills.forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        
        this.setCategory(selectedCat);
      });
    });
  }

  setCategory(categoryKey) {
    if (!quizData[categoryKey]) return;
    this.currentCategory = categoryKey;
    
    // Update Header Logo text
    const categoryInfo = quizData[categoryKey];
    if (this.headerLogo) {
      // e.g., "Cyber FreeRice" -> Cyber<span>FreeRice</span>
      const parts = categoryInfo.title.split(' ');
      if (parts.length >= 2) {
        this.headerLogo.innerHTML = `${parts[0]}<span>${parts.slice(1).join(' ')}</span>`;
      } else {
        this.headerLogo.textContent = categoryInfo.title;
      }
    }
    
    // Reset streak on category change
    this.streak = 0;
    this.updateStreakDisplay();
    
    this.loadNextQuestion();
  }

  loadNextQuestion() {
    const questions = quizData[this.currentCategory].questions;
    // Pick a random question from the active category
    const randomIndex = Math.floor(Math.random() * questions.length);
    this.currentQuestion = questions[randomIndex];
    
    this.renderQuestion();
  }

  renderQuestion() {
    // Reset feedback
    this.feedbackElement.textContent = '';
    this.feedbackElement.className = 'quiz-feedback';
    
    // Set question text
    this.questionElement.textContent = this.currentQuestion.question;
    
    // Clear old options
    this.optionsElement.innerHTML = '';
    
    // Build options
    this.currentQuestion.options.forEach((optionText, index) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = optionText;
      btn.addEventListener('click', () => this.handleAnswer(index, btn));
      this.optionsElement.appendChild(btn);
    });
  }

  handleAnswer(selectedIndex, btnElement) {
    // Disable all buttons to prevent multiple clicks
    const allButtons = this.optionsElement.querySelectorAll('.quiz-option-btn');
    allButtons.forEach(b => b.disabled = true);

    if (selectedIndex === this.currentQuestion.answer) {
      // Correct Answer
      btnElement.classList.add('correct');
      this.score += 10;
      this.streak += 1;
      
      // Save score for guest or user
      localStorage.setItem('charityRiceScore', this.score);
      if (this.currentUser) {
        localStorage.setItem(`charityRiceScore_${this.currentUser.email}`, this.score);
      }
      
      this.updateScoreDisplay();
      
      this.feedbackElement.textContent = 'Correct! +10 grains of rice donated.';
      this.feedbackElement.classList.add('success', 'show');
      
      this.updateStreakDisplay();
      this.animateRiceBowl();
    } else {
      // Incorrect Answer
      this.streak = 0; // Reset streak
      this.updateStreakDisplay();
      
      btnElement.classList.add('incorrect');
      allButtons[this.currentQuestion.answer].classList.add('correct');
      
      this.feedbackElement.textContent = 'Incorrect. Try the next one!';
      this.feedbackElement.classList.add('error', 'show');
    }

    // Load next question after a short delay
    setTimeout(() => {
      this.loadNextQuestion();
    }, 2000);
  }

  updateScoreDisplay() {
    if (this.scoreElement) {
      this.scoreElement.textContent = this.score;
      // Add a pop animation
      this.scoreElement.style.transform = 'scale(1.2)';
      setTimeout(() => {
        this.scoreElement.style.transform = 'scale(1)';
      }, 200);
    }
  }

  updateStreakDisplay() {
    if (!this.streakBadge) return;
    
    if (this.streak >= 3) {
      this.streakBadge.textContent = `🔥 ${this.streak} Correct in a Row!`;
      this.streakBadge.classList.add('active');
    } else {
      this.streakBadge.classList.remove('active');
    }
  }

  animateRiceBowl() {
    if (this.plateIcon && this.floatingHeart) {
      // Bump the plate
      this.plateIcon.classList.add('bump');
      
      // Float the heart
      // Clone it to allow overlapping animations if they answer really fast
      const heartClone = this.floatingHeart.cloneNode(true);
      heartClone.classList.add('animate');
      heartClone.style.opacity = '1';
      this.plateIcon.parentElement.appendChild(heartClone);

      setTimeout(() => {
        this.plateIcon.classList.remove('bump');
      }, 200);

      // Remove clone after animation ends
      setTimeout(() => {
        heartClone.remove();
      }, 1000);
    }
  }
}

// Initialize if on the quiz page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('quiz-container')) {
        new CharityQuiz();
    }
});
