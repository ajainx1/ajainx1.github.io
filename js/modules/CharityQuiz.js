import { quizData } from '../data/quiz-questions.js';

export class CharityQuiz {
  constructor() {
    this.score = parseInt(localStorage.getItem('charityRiceScore') || '0', 10);
    this.streak = 0; // Track consecutive correct answers
    this.currentCategory = 'network'; // Default category
    this.currentDifficulty = 'beginner'; // Default difficulty
    this.currentQuestion = null;
    this.lastAnswerTime = 0; // For rate limiting
    
    // DOM Elements
    this.questionElement = document.getElementById('quiz-question');
    this.optionsElement = document.getElementById('quiz-options');
    this.scoreElement = document.getElementById('rice-score');
    this.feedbackElement = document.getElementById('quiz-feedback');
    this.streakBadge = document.getElementById('streak-badge');
    this.headerLogo = document.getElementById('quiz-header-logo');
    this.categoryPills = document.querySelectorAll('.category-pill');
    
    // Recipient State
    this.currentRecipient = 'human';
    this.recipientBtns = document.querySelectorAll('.recipient-btn');
    this.recipientIcons = {
      'human': { base: '🤲🥣', float: '💚' },
      'birds': { base: '🕊️🌾', float: '✨' },
      'cows': { base: '🐄🌿', float: '🌾' },
      'dogs': { base: '🐕🦴', float: '🦴' },
      'moon': { base: '🍚🥛', float: '🤍' },
      'jupiter': { base: '📚💻', float: '💛' },
      'rahu': { base: '💊🧣', float: '⚕️' },
      'venus': { base: '👗🌸', float: '💖' },
      'saturn': { base: '🦯🤝', float: '🖤' }
    };
    
    // Appreciation Visual
    this.plateIcon = document.getElementById('plate-icon');
    this.floatingHeart = document.getElementById('floating-heart');
    
    // Auth Elements
    // Auth Elements
    this.emailLoginBtn = document.getElementById('email-login-btn');
    this.userProfile = document.getElementById('user-profile');
    this.userAvatar = document.getElementById('user-avatar');
    this.userName = document.getElementById('user-name');
    this.logoutBtn = document.getElementById('logout-btn');
    this.currentUser = null;
    
    // Email Auth Modal Elements (Supabase)
    this.emailModal = document.getElementById('email-auth-modal');
    this.closeEmailModal = document.getElementById('close-email-modal');
    this.stepEmail = document.getElementById('step-email');
    this.stepSent = document.getElementById('step-sent');
    this.emailInput = document.getElementById('email-input');
    this.sendLinkBtn = document.getElementById('send-link-btn');
    
    // Gamification Elements
    this.progressBar = document.getElementById('milestone-progress');
    this.progressText = document.getElementById('milestone-text');
    this.shareBtn = document.getElementById('share-score-btn');
    
    // New Feature Elements
    this.difficultyPills = document.querySelectorAll('.difficulty-pill');
    this.hintBtn = document.getElementById('use-hint-btn');
    this.hintBox = document.getElementById('quiz-hint-box');
    
    this.init();
    
    if(this.logoutBtn) {
      this.logoutBtn.addEventListener('click', () => this.handleLogout());
    }
    if(this.emailLoginBtn) {
      this.emailLoginBtn.addEventListener('click', () => this.openEmailModal());
    }
    if(this.closeEmailModal) {
      this.closeEmailModal.addEventListener('click', () => { this.emailModal.style.display = 'none'; });
    }
    if(this.sendLinkBtn) {
      this.sendLinkBtn.addEventListener('click', () => this.sendMagicLink());
    }
    if(this.shareBtn) {
      this.shareBtn.addEventListener('click', () => this.handleShareScore());
    }
    if(this.hintBtn) {
      this.hintBtn.addEventListener('click', () => this.handleUseHint());
    }
  }

  async init() {
    await this.loadUserSession();
    this.updateScoreDisplay();
    this.attachCategoryListeners();
    this.attachDifficultyListeners();
    this.attachRecipientListeners();
    this.setCategory(this.currentCategory);
  }

  attachRecipientListeners() {
    if (!this.recipientBtns) return;
    this.recipientBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const recipient = e.target.getAttribute('data-recipient');
        if (!recipient || !this.recipientIcons[recipient]) return;
        
        // Update UI state
        this.recipientBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update data state
        this.currentRecipient = recipient;
        
        // Update icon visually
        if (this.plateIcon) {
          this.plateIcon.textContent = this.recipientIcons[recipient].base;
        }
      });
    });
  }

  // --- Supabase Auth Logic ---
  
  async loadUserSession() {
    // Check if Supabase is initialized
    if (window.supabaseClient) {
      // Get current session
      const { data, error } = await window.supabaseClient.auth.getSession();
      if (data && data.session) {
        const email = data.session.user.email;
        this.loginUser(email.split('@')[0], email, `https://ui-avatars.com/api/?name=${email}&background=33ff00&color=000`);
      }
      
      // Listen for auth changes (like clicking the magic link)
      window.supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const email = session.user.email;
          this.loginUser(email.split('@')[0], email, `https://ui-avatars.com/api/?name=${email}&background=33ff00&color=000`);
        } else if (event === 'SIGNED_OUT') {
          this.currentUser = null;
          this.updateAuthUI();
        }
      });
    } else {
      // Fallback local storage for UI testing
      const savedUser = localStorage.getItem('charityQuizUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
        const userScore = localStorage.getItem(`charityRiceScore_${this.currentUser.email}`);
        if (userScore) this.score = parseInt(userScore, 10);
      }
      this.updateAuthUI();
    }
  }

  openEmailModal() {
    this.emailModal.style.display = 'flex';
    this.stepEmail.style.display = 'block';
    this.stepSent.style.display = 'none';
  }

  async sendMagicLink() {
    const email = this.emailInput.value;
    if (!email || !email.includes('@')) return alert('Please enter a valid email address');
    
    if (!window.supabaseClient) {
      return alert('Supabase keys missing! Please follow the setup guide to link your database.');
    }
    
    // Disable button to prevent spam
    this.sendLinkBtn.disabled = true;
    this.sendLinkBtn.innerText = "Sending...";
    
    const { data, error } = await window.supabaseClient.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.href // Redirect back to this page
      }
    });

    if (error) {
      alert("Error sending magic link: " + error.message);
      this.sendLinkBtn.disabled = false;
      this.sendLinkBtn.innerText = "Send Magic Link";
    } else {
      // Show success step
      this.stepEmail.style.display = 'none';
      this.stepSent.style.display = 'block';
    }
  }

  loginUser(name, id, picture) {
    this.currentUser = { name, email: id, picture };
    localStorage.setItem('charityQuizUser', JSON.stringify(this.currentUser));
    const userScore = localStorage.getItem(`charityRiceScore_${id}`);
    if (userScore) this.score = parseInt(userScore, 10);
    this.updateAuthUI();
    this.updateScoreDisplay();
  }

  async handleLogout() {
    if (window.supabaseClient) {
      await window.supabaseClient.auth.signOut();
    }
    this.currentUser = null;
    localStorage.removeItem('charityQuizUser');
    this.updateAuthUI();
  }

  updateAuthUI() {
    if (!this.userProfile) return;
    
    if (this.currentUser) {
      if(this.emailLoginBtn) this.emailLoginBtn.style.display = 'none';
      
      this.userProfile.style.display = 'flex';
      this.userAvatar.src = this.currentUser.picture || '';
      this.userName.textContent = this.currentUser.name || 'User';
    } else {
      if(this.emailLoginBtn) this.emailLoginBtn.style.display = 'flex';
      
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

  attachDifficultyListeners() {
    if(!this.difficultyPills) return;
    this.difficultyPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const selectedDiff = e.target.getAttribute('data-difficulty');
        
        // Update active class
        this.difficultyPills.forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        
        this.currentDifficulty = selectedDiff;
        this.loadNextQuestion();
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
        this.headerLogo.innerHTML = `<img src="charity_favicon.svg" alt="Logo" style="height: 24px; border-radius: 4px;"> ${parts[0]}<span>${parts.slice(1).join(' ')}</span>`;
      } else {
        this.headerLogo.innerHTML = `<img src="charity_favicon.svg" alt="Logo" style="height: 24px; border-radius: 4px;"> ${categoryInfo.title}`;
      }
    }
    
    // Reset streak on category change
    this.streak = 0;
    this.updateStreakDisplay();
    
    this.loadNextQuestion();
  }

  async loadNextQuestion() {
    this.questionElement.textContent = "Loading question...";
    this.optionsElement.innerHTML = '';
    
    const allQuestions = quizData[this.currentCategory].questions;
    // Filter by difficulty
    const questions = allQuestions.filter(q => q.difficulty === this.currentDifficulty);
    
    if (questions.length === 0) {
        this.questionElement.textContent = "No questions available for this difficulty yet. Check back soon!";
        return;
    }
    
    // Pick a random question from the filtered category
    const randomIndex = Math.floor(Math.random() * questions.length);
    this.currentQuestion = questions[randomIndex];
    
    this.renderQuestion();
  }

  renderQuestion() {
    // Reset feedback
    this.feedbackElement.textContent = '';
    this.feedbackElement.className = 'quiz-feedback';
    
    // Remove any existing scenario box
    const oldScenario = this.questionElement.previousElementSibling;
    if (oldScenario && oldScenario.classList.contains('quiz-scenario-box')) {
      oldScenario.remove();
    }
    
    // Add scenario box if available
    if (this.currentQuestion.scenario) {
      const scenarioDiv = document.createElement('pre');
      scenarioDiv.className = 'quiz-scenario-box';
      scenarioDiv.style.background = 'var(--green-dim)';
      scenarioDiv.style.border = '1px solid var(--green)';
      scenarioDiv.style.borderRadius = '8px';
      scenarioDiv.style.padding = '15px';
      scenarioDiv.style.marginBottom = '20px';
      scenarioDiv.style.color = 'var(--green)';
      scenarioDiv.style.fontFamily = '"JetBrains Mono", monospace';
      scenarioDiv.style.fontSize = '0.85rem';
      scenarioDiv.style.whiteSpace = 'pre-wrap';
      scenarioDiv.style.textAlign = 'left';
      scenarioDiv.style.lineHeight = '1.5';
      scenarioDiv.style.boxShadow = 'inset 0 0 10px var(--green-glow)';
      scenarioDiv.textContent = this.currentQuestion.scenario;
      this.questionElement.parentNode.insertBefore(scenarioDiv, this.questionElement);
    }
    
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
    
    // Reset Hint UI
    if (this.hintBox && this.hintBtn) {
      this.hintBox.style.display = 'none';
      if (this.currentQuestion.hint) {
        this.hintBox.textContent = `💡 Hint: ${this.currentQuestion.hint}`;
        this.hintBtn.style.display = 'inline-block';
        this.hintBtn.disabled = this.score < 5;
      } else {
        this.hintBtn.style.display = 'none';
      }
    }
  }

  handleUseHint() {
    if (this.score >= 5 && this.currentQuestion && this.currentQuestion.hint) {
      // Deduct score
      this.score -= 5;
      localStorage.setItem('charityRiceScore', this.score);
      if (this.currentUser) {
        localStorage.setItem(`charityRiceScore_${this.currentUser.email}`, this.score);
      }
      
      // Flash red to indicate deduction
      this.scoreElement.style.color = '#ff3333';
      setTimeout(() => {
        this.scoreElement.style.color = 'var(--green)';
      }, 500);
      
      this.updateScoreDisplay();
      
      // Show Hint UI
      this.hintBox.style.display = 'block';
      this.hintBtn.disabled = true;
      
      this.feedbackElement.textContent = 'Hint revealed! -5 grains.';
      this.feedbackElement.className = 'quiz-feedback show';
    } else if (this.score < 5) {
      this.feedbackElement.textContent = 'Not enough grains! You need 5 to use a hint.';
      this.feedbackElement.className = 'quiz-feedback error show';
    }
  }

  handleAnswer(selectedIndex, btnElement) {
    // Frontend Rate Limiting: Prevent spamming
    const now = performance.now();
    if (now - this.lastAnswerTime < 1000) {
      return; // Reject if less than 1 second since last answer
    }
    this.lastAnswerTime = now;
    
    // Disable all buttons to prevent multiple clicks
    const allButtons = this.optionsElement.querySelectorAll('.quiz-option-btn');
    allButtons.forEach(b => b.disabled = true);
    if(this.hintBtn) this.hintBtn.disabled = true;

    if (selectedIndex === this.currentQuestion.answer) {
      if (window.triggerHaptic) window.triggerHaptic('MEDIUM');
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
      if (window.triggerHaptic) window.triggerHaptic('HEAVY');
      // Incorrect Answer
      this.streak = 0; // Reset streak
      this.updateStreakDisplay();
      
      btnElement.classList.add('incorrect');
      allButtons[this.currentQuestion.answer].classList.add('correct');
      
      this.feedbackElement.textContent = 'Incorrect. Try the next one!';
      this.feedbackElement.classList.add('error', 'show');
    }

    // Load next question after a longer delay for rhythm and rate limiting
    setTimeout(() => {
      this.loadNextQuestion();
    }, 2500);
  }

  updateScoreDisplay() {
    if (!this.scoreElement) return;
    
    const startScore = parseInt(this.scoreElement.textContent) || 0;
    const targetScore = this.score;
    if (startScore === targetScore) {
      this.scoreElement.textContent = targetScore;
      return;
    }
    
    const duration = 800; // ms
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out function for smoother stop
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.floor(startScore + (targetScore - startScore) * easeOut);
      
      this.scoreElement.textContent = currentScore;
      
      // Update Progress Bar
      if (this.progressBar && this.progressText) {
        const milestoneGoal = 500;
        const currentMilestone = currentScore % milestoneGoal;
        const percentage = Math.min((currentMilestone / milestoneGoal) * 100, 100);
        this.progressBar.style.width = `${percentage}%`;
        this.progressText.textContent = `${currentMilestone} / ${milestoneGoal} grains for a full bowl`;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.scoreElement.textContent = targetScore;
        // Ensure progress is exactly synced at the end
        if (this.progressBar && this.progressText) {
           const finalMilestone = targetScore % 500;
           this.progressBar.style.width = `${Math.min((finalMilestone / 500) * 100, 100)}%`;
           this.progressText.textContent = `${finalMilestone} / 500 grains for a full bowl`;
        }
        
        // Add a pop animation at the end
        this.scoreElement.style.transform = 'scale(1.15)';
        this.scoreElement.style.color = 'var(--fg)';
        setTimeout(() => {
          this.scoreElement.style.transform = 'scale(1)';
          this.scoreElement.style.color = 'var(--green)';
        }, 150);
      }
    };
    
    requestAnimationFrame(animate);
  }

  handleShareScore() {
    const text = `I just generated ${this.score} grains of rice by playing Cyber FreeRice! Join me in learning and feeding the hungry:`;
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'Cyber FreeRice',
        text: text,
        url: url
      }).catch(console.error);
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${text} ${url}`).then(() => {
        const originalText = this.shareBtn.innerHTML;
        this.shareBtn.innerHTML = `✅ Copied to Clipboard!`;
        setTimeout(() => {
          this.shareBtn.innerHTML = originalText;
        }, 2000);
      }).catch(console.error);
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
      // Set the correct floating emoji for the current recipient
      const currentIcons = this.recipientIcons[this.currentRecipient];
      this.floatingHeart.textContent = currentIcons.float;
      
      // Bump the plate
      this.plateIcon.classList.add('bump');
      setTimeout(() => {
        this.plateIcon.classList.remove('bump');
      }, 200);

      // Heart float animation
      const heartClone = this.floatingHeart.cloneNode(true);
      heartClone.classList.add('animate');
      heartClone.style.opacity = '1';
      this.plateIcon.parentElement.appendChild(heartClone);
      setTimeout(() => { heartClone.remove(); }, 1000);
      
      // Falling Rice Animation (burst of 5 grains)
      for (let i = 0; i < 5; i++) {
        const riceGrain = document.createElement('span');
        riceGrain.className = 'falling-rice';
        riceGrain.textContent = currentIcons.float === '✨' ? '🌾' : '🍚'; // Default to rice bowl or wheat
        
        // Randomize starting position and delay
        const leftOffset = (Math.random() - 0.5) * 60; // -30px to 30px
        const delay = Math.random() * 0.2; // 0 to 0.2s delay
        
        riceGrain.style.left = `calc(50% + ${leftOffset}px)`;
        riceGrain.style.animationDelay = `${delay}s`;
        
        this.plateIcon.parentElement.appendChild(riceGrain);
        
        // Cleanup after animation completes
        setTimeout(() => {
          riceGrain.remove();
        }, (0.8 + delay) * 1000);
      }
    }
  }
}

// Initialize if on the quiz page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('quiz-container')) {
        new CharityQuiz();
    }
});
