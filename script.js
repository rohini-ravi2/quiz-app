// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");
const usernameInput = document.getElementById("username");

let username = "";
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;
let userAnswers = [];

const quizQuestions = [
  {
    question: "What’s something that always makes me angry instantly?",
    answers: [
      { text: "Slow Wi-Fi", correct: false },
      { text: "Ignored texts", correct: true },
      { text: "Spoilers", correct: false },
      { text: "People chewing loudly", correct: false },
    ],
  },
  {
    question: "If I had to delete all apps except one, which one would I keep?",
    answers: [
      { text: "Instagram", correct: false },
      { text: "WhatsApp", correct: true },
      { text: "YouTube", correct: false },
      { text: "Zomato", correct: false },
    ],
  },
  {
    question: "What do I value most in a friend?",
    answers: [
      { text: "Vibes", correct: false },
      { text: "Honesty", correct: false },
      { text: "Humor", correct: false },
      { text: "Loyalty", correct: true },
    ],
  },
  {
    question: "Which one do I prefer more?",
    answers: [
      { text: "Texting", correct: false },
      { text: "Voice Note", correct: false },
      { text: "Calling", correct: true },
      { text: "Ghosting", correct: false },
    ],
  },
  {
    question: "If I could time travel, I’d go to",
    answers: [
      { text: "10 years in the future", correct: false },
      { text: "School days", correct: false },
      { text: "My childhood", correct: true },
      { text: "College 1st Year", correct: false },
    ],
  },
  {
    question: "If I got superpowers, I’d want:",
    answers: [
      { text: "Invisibility", correct: false },
      { text: "Telepathy", correct: false },
      { text: "Time travel", correct: false },
      { text: "The power to pause the moment", correct: true },
    ],
  },
  {
    question: "Which of these would definitely be my toxic trait?",
    answers: [
      { text: "Saying “I’m fine” when I’m not", correct: false },
      { text: "Ghosting everyone for 2 days", correct: false },
      { text: "Starting a new hobby and quitting next week", correct: false },
      { text: "Overthinking a “k” text", correct: true },
    ],
  },
  {
    question: "What’s my secret dream life?",
    answers: [
      { text: "Live on a beach, do nothing", correct: false },
      { text: "Be a famous content creator", correct: false },
      { text: "Open a café and vibe", correct: true },
      { text: "Rule a kingdom – obviously", correct: false },
    ],
  },
  {
    question: "What’s my toxic coping mechanism?",
    answers: [
      { text: "Sleep for 10 hours", correct: false },
      { text: "Watch sad edits at 2 AM", correct: true },
      { text: "Say “I’m okay” to everyone", correct: false },
      { text: "Randomly start a new life plan I’ll drop in 3 days", correct: false },
    ],
  },
  {
    question: "What’s my go-to excuse for cancelling plans?",
    answers: [
      { text: "Family thing", correct: false },
      { text: "Not feeling well", correct: true },
      { text: "Network issues lol", correct: false },
      { text: "No excuse — just ghost", correct: false },
    ],
  },
];

// Initialize counters
totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// Event Listeners
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

function startQuiz() {
  username = usernameInput.value.trim();
  if (!username) {
    alert("Please enter your name to start the quiz!");
    return;
  }

  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  scoreSpan.textContent = 0;

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  showQuestion();
}

function showQuestion() {
  answersDisabled = false;
  const currentQuestion = quizQuestions[currentQuestionIndex];
  currentQuestionSpan.textContent = currentQuestionIndex + 1;
  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";
  questionText.textContent = currentQuestion.question;
  answersContainer.innerHTML = "";

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answersContainer.appendChild(button);
  });
}

function selectAnswer(event) {
  if (answersDisabled) return;
  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  userAnswers.push({
    question: quizQuestions[currentQuestionIndex].question,
    selected: selectedButton.textContent,
    correct: isCorrect
  });

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1000);
}

function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;
  const percentage = (score / quizQuestions.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!";
  } else if (percentage >= 80) {
    resultMessage.textContent = "Great job! You know your stuff!";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good effort! Keep learning!";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! Try again to improve!";
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!";
  }

  // ✅ Save to Firebase Realtime Database
  firebase.database().ref("quizResults").push({
    name: username,
    score: score,
    total: quizQuestions.length,
    date: new Date().toISOString(),
    answers: userAnswers
  })
  .then(() => {
    console.log("✅ Result saved to Firebase");
  })
  .catch((error) => {
    console.error("❌ Firebase error:", error);
  });
}

function restartQuiz() {
  resultScreen.classList.remove("active");
  startScreen.classList.add("active");

  // Clear name input and reset variables
  usernameInput.value = "";
  username = "";
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  scoreSpan.textContent = 0;
  finalScoreSpan.textContent = 0;
  progressBar.style.width = "0%";
}
