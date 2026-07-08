import { quizQuestions } from '../data/quiz-questions.js';

export class CharityQuiz {
  constructor() {
    this.score = parseInt(localStorage.getItem('charityRiceScore') || '0', 10);
    this.currentQuestion = null;
    this.questionElement = document.getElementById('quiz-question');
    this.optionsElement = document.getElementById('quiz-options');
    this.scoreElement = document.getElementById('rice-score');
    this.feedbackElement = document.getElementById('quiz-feedback');
    
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
    this.feedbackElement.textContent = '';
    this.feedbackElement.className = 'quiz-feedback';
    this.questionElement.textContent = this.currentQuestion.question;
    
    this.optionsElement.innerHTML = '';
    
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
      // Correct
      btnElement.classList.add('correct');
      this.score += 10; // 10 grains of rice per correct answer
      localStorage.setItem('charityRiceScore', this.score);
      this.updateScoreDisplay();
      
      this.feedbackElement.textContent = 'Correct! +10 grains of rice donated.';
      this.feedbackElement.classList.add('success');
      this.animateRiceBowl();
    } else {
      // Incorrect
      btnElement.classList.add('incorrect');
      allButtons[this.currentQuestion.answer].classList.add('correct');
      
      this.feedbackElement.textContent = 'Incorrect. Try the next one!';
      this.feedbackElement.classList.add('error');
    }

    // Load next question after a short delay
    setTimeout(() => {
      this.loadNextQuestion();
    }, 2000);
  }

  updateScoreDisplay() {
    // Animate the counter if needed, or just set it
    if (this.scoreElement) {
      this.scoreElement.textContent = this.score;
    }
  }

  animateRiceBowl() {
    const bowl = document.getElementById('rice-bowl-fill');
    if (!bowl) return;
    
    // Simple visual fill calculation based on score (cap at 100% for visual, let score go infinite)
    let fillPercentage = Math.min((this.score / 1000) * 100, 100);
    bowl.style.height = `${fillPercentage}%`;
    
    // Add a little drop animation class
    const drop = document.createElement('div');
    drop.className = 'rice-drop';
    document.getElementById('rice-bowl-container').appendChild(drop);
    
    setTimeout(() => drop.remove(), 1000);
  }
}

// Initialize if on the quiz page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('quiz-container')) {
        new CharityQuiz();
    }
});
