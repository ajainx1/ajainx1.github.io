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
    
    this.init();
  }

  init() {
    this.updateScoreDisplay();
    this.attachCategoryListeners();
    this.setCategory(this.currentCategory);
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
      
      localStorage.setItem('charityRiceScore', this.score);
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
