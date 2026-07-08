import { quizQuestions } from '../data/quiz-questions.js';

export class CharityQuiz {
  constructor() {
    this.score = parseInt(localStorage.getItem('charityRiceScore') || '0', 10);
    this.streak = 0; // Track consecutive correct answers
    this.currentQuestion = null;
    
    // DOM Elements
    this.questionElement = document.getElementById('quiz-question');
    this.optionsElement = document.getElementById('quiz-options');
    this.scoreElement = document.getElementById('rice-score');
    this.feedbackElement = document.getElementById('quiz-feedback');
    this.streakBadge = document.getElementById('streak-badge');
    
    this.init();
  }

  init() {
    this.updateScoreDisplay();
    this.loadNextQuestion();
  }

  loadNextQuestion() {
    // Pick a random question
    const randomIndex = Math.floor(Math.random() * quizQuestions.length);
    this.currentQuestion = quizQuestions[randomIndex];
    
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
    // Optional additional animation logic if we re-introduce the bowl,
    // For now, the nice rice emoji and the score pop handle the feedback.
  }
}

// Initialize if on the quiz page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('quiz-container')) {
        new CharityQuiz();
    }
});
