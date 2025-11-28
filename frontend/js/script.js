// Mobile Navbar Toggle (robust)
(function () {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('nav-menu') || document.querySelector('.nav-links');
  if (!toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle('show', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('show');
    setOpen(!isOpen);
  });

  // Keyboard support
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const isOpen = menu.classList.contains('show');
      setOpen(!isOpen);
    }
  });
})();

const toggleBtn = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('nav-menu');

const accordions = document.querySelectorAll(".accordion-header");
accordions.forEach((header) => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    content.classList.toggle("show");
  });
});

// About Page - Contact Form (now connected to backend /api/contact)
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const feedback = document.getElementById("form-feedback");

    // Reset feedback
    feedback.textContent = "";
    feedback.style.color = "";

    // Front-end validation
    if (!name || !email || !message) {
      feedback.textContent = "⚠️ Please fill in all fields.";
      feedback.style.color = "red";
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      feedback.textContent = "⚠️ Please enter a valid email address.";
      feedback.style.color = "red";
      return;
    }

    // Inform user that we're sending
    feedback.textContent = "⏳ Sending your message...";
    feedback.style.color = "#1E3A8A";

    try {
      const res = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        feedback.textContent = "✅ Thank you! Your message has been sent.";
        feedback.style.color = "green";
        form.reset();
      } else {
        feedback.textContent = data.error || "❌ Something went wrong. Please try again.";
        feedback.style.color = "red";
      }
    } catch (err) {
      console.error(err);
      feedback.textContent = "❌ Could not reach the server. Please try again later.";
      feedback.style.color = "red";
    }
  });
}


if (toggleBtn && navLinks) {
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('show');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

// Make element tiles keyboard-accessible
document.querySelectorAll('.element').forEach(el => {
  el.setAttribute('tabindex', '0');
  if (!el.hasAttribute('aria-label')) {
    el.setAttribute('aria-label', el.getAttribute('data-name') || el.textContent.trim());
  }
});



(function(){

  const startBtn    = document.getElementById("start-btn");
  const quizStart   = document.getElementById("quiz-start");
  const quizBox     = document.getElementById("quiz-box");
  const nextBtn     = document.getElementById("next-btn");
  const reviewBtn   = document.getElementById("review-btn");
  const scoreDisplay= document.getElementById("score");
  const qIndexEl    = document.getElementById("qIndex");
  const qTotalEl    = document.getElementById("qTotal");
  const timerEl     = document.getElementById("timer");
  const streakEl    = document.getElementById("streak");
  const progressBar = document.getElementById("progressBar");
  const reviewModal = document.getElementById("reviewModal");
  const reviewBody  = document.getElementById("reviewBody");
  const diffPills   = document.querySelectorAll(".pill");
  const metaBest    = document.getElementById("bestScore");
  const playerNameInput = document.getElementById("playerName");
  let playerName = "Guest";


  if (!startBtn || !quizStart || !quizBox || !nextBtn) return;

    // === Save score to backend ===
  async function sendScoreToBackend(score, total, difficulty) {
    try {
      await fetch("http://localhost:3000/api/quiz-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playerName,
          score,
          total,
          difficulty: difficulty || "easy"
        })
      });
    } catch (err) {
      console.error("Failed to send quiz score:", err);
    }
  }


  //Difficulty
  let difficulty = 'easy';
  diffPills.forEach(p => {
    p.addEventListener('click', () => {
      diffPills.forEach(x => { x.classList.remove('active'); x.setAttribute('aria-pressed','false'); });
      p.classList.add('active');
      p.setAttribute('aria-pressed','true');
      difficulty = p.dataset.diff;
    });
  });

  //Question Bank 
  const bank = [
    // Easy
    { q: "Which element has the symbol 'O'?", opts: ["Gold","Oxygen","Osmium","Oganesson"], a: "Oxygen",
      exp:"O is Oxygen; Osmium is Os, Oganesson is Og.", cat:"symbols", diff:"easy" },
    { q: "Who proposed the first widely accepted periodic table?",
      opts: ["Isaac Newton","Marie Curie","Dmitri Mendeleev","Albert Einstein"], a:"Dmitri Mendeleev",
      exp:"Mendeleev organized elements by atomic weight and properties.", cat:"history", diff:"easy" },
    { q: "Atomic number equals the number of ______ in the nucleus.",
      opts: ["Neutrons","Protons","Electrons","Shells"], a:"Protons",
      exp:"Atomic number is the number of protons; neutrons vary by isotope.", cat:"basics", diff:"easy" },
    { q: "Which is a Noble Gas?", opts: ["Nitrogen","Argon","Fluorine","Carbon"], a:"Argon",
      exp:"Group 18 elements are noble gases; Argon (Ar) is one.", cat:"groups", diff:"easy" },
    { q: "Which element is liquid at room temperature?",
      opts: ["Mercury","Silver","Iron","Copper"], a:"Mercury",
      exp:"Mercury (Hg) is liquid; Bromine is also liquid near room temp.", cat:"properties", diff:"easy" },

    // Medium
    { q: "What happens to atomic radius across a period (left → right)?",
      opts: ["Increases","Decreases","Stays same","Random"], a:"Decreases",
      exp:"Effective nuclear charge increases; electrons pulled closer.", cat:"trends", diff:"medium" },
    { q: "Which group contains highly reactive nonmetals that form salts?",
      opts: ["Alkali metals","Halogens","Noble gases","Lanthanides"], a:"Halogens",
      exp:"Halogens (Group 17) form salts with metals (e.g., NaCl).", cat:"groups", diff:"medium" },
    { q: "Aluminium (Al) is typically classified as:",
      opts: ["Metalloid","Post-transition metal","Transition metal","Halogen"], a:"Post-transition metal",
      exp:"Al is generally considered a post-transition metal.", cat:"classification", diff:"medium" },

    // Hard
    { q: "Which pair shows increasing electronegativity?",
      opts: ["Na → Cl","F → Li","Cs → K","Mg → Ne"], a:"Na → Cl",
      exp:"Electronegativity generally increases across a period.", cat:"trends", diff:"hard" },
    { q: "The element with Z=36 is:",
      opts: ["Kr","Br","Rb","Sr"], a:"Kr",
      exp:"Z=36 is Krypton (a noble gas).", cat:"symbols", diff:"hard" },
  ];

  function selectByDifficulty(diff){
    const pick = bank.filter(b => b.diff === diff);
    return pick.length ? pick : bank.filter(b => b.diff === 'easy');
  }

  //State
  let questions = [];
  let i = 0;
  let score = 0;
  let streak = 0;
  let timer = null;
  const perQuestionTime = { easy:20, medium:25, hard:30 }; 
  let timeLeft = perQuestionTime.easy;
  let answered = false;
  let history = [];

  //High Score
  function best() {
    return Number(localStorage.getItem('pt_best') || 0);
  }
  function setBest(val) {
    localStorage.setItem('pt_best', String(val));
  }
  if (metaBest) metaBest.textContent = best();

  //Start Quiz
  startBtn.addEventListener("click", () => {
    if (playerNameInput) {
      const val = playerNameInput.value.trim();
      playerName = val || "Guest";
    } else {
      playerName = "Guest";
    }
    questions = shuffle(selectByDifficulty(difficulty)).slice(0, 8);
    i = 0; score = 0; streak = 0; history = [];
    timeLeft = perQuestionTime[difficulty] || 20;
    qTotalEl.textContent = questions.length;
    qIndexEl.textContent = 0;
    streakEl.textContent = 0;
    progressBar.style.width = '0%';
    scoreDisplay.textContent = '';
    answered = false;

    nextBtn.dataset.mode = "next";
    nextBtn.textContent = "Next";
    document.getElementById("quit-btn")?.remove();

    quizStart.hidden = true;
    quizBox.hidden = false;
    nextBtn.hidden = true;   
    reviewBtn.hidden = true;

    loadQuestion();
  });

  //Load a Question
  function loadQuestion(){
    const cur = questions[i];
    answered = false;
    qIndexEl.textContent = i + 1;
    setProgress(i / questions.length);

    quizBox.innerHTML = `
      <div class="question" aria-live="polite">${cur.q}</div>
      <ul class="options" role="list">
        ${shuffle(cur.opts).map(opt => `<li class="option" tabindex="0" role="button" aria-pressed="false">${opt}</li>`).join('')}
      </ul>
      <div class="explain" id="explain" hidden></div>
    `;

    // Option handlers
    quizBox.querySelectorAll(".option").forEach(option => {
      option.addEventListener("click", () => selectAnswer(option, cur));
      option.addEventListener("keyup", (e) => {
        if(e.key === "Enter" || e.key === " ") selectAnswer(option, cur);
      });
    });

    // Timer
    clearInterval(timer);
    timeLeft = perQuestionTime[difficulty] || 20;
    renderTimer();
    timer = setInterval(() => {
      timeLeft--;
      renderTimer();
      if (timeLeft <= 0 && !answered) {
        autoReveal(cur);
      }
    }, 1000);
  }

  //Select
  function selectAnswer(selected, qd){
    if (answered) return;
    answered = true;
    clearInterval(timer);

    const options = quizBox.querySelectorAll(".option");
    options.forEach(opt => opt.style.pointerEvents = "none");

    const correct = selected.textContent === qd.a;
    if (correct) {
      selected.classList.add("correct");
      score++;
      streak++;
    } else {
      selected.classList.add("wrong");
      options.forEach(opt => { if (opt.textContent === qd.a) opt.classList.add("correct"); });
      streak = 0;
    }
    streakEl.textContent = String(streak);

    // Explanation
    const exp = document.getElementById('explain');
    if (exp) {
      exp.hidden = false;
      exp.textContent = qd.exp || '';
    }

    // History for review
    history.push({ q: qd.q, chosen: selected.textContent, correct: qd.a, exp: qd.exp || '' });

    // Controls
    nextBtn.hidden = false;
    nextBtn.focus();

    // Live score
    scoreDisplay.textContent = `Score: ${score}`;
  }

  function autoReveal(qd){
    answered = true;
    clearInterval(timer);
    const options = quizBox.querySelectorAll(".option");
    options.forEach(opt => {
      opt.style.pointerEvents = "none";
      if (opt.textContent === qd.a) opt.classList.add("correct");
    });
    streak = 0; streakEl.textContent = '0';

    const exp = document.getElementById('explain');
    if (exp) { exp.hidden = false; exp.textContent = (qd.exp || '') + " (Time's up)"; }

    history.push({ q: qd.q, chosen: "(no answer)", correct: qd.a, exp: qd.exp || '' });

    nextBtn.hidden = false;
    nextBtn.focus();
  }

  //Next / Restart
  nextBtn.addEventListener("click", () => {
    // Restart mode 
    if (nextBtn.dataset.mode === "restart") {
      quizStart.hidden = false;
      quizBox.hidden = true;
      nextBtn.hidden = true;
      reviewBtn.hidden = true;
      scoreDisplay.textContent = "";
      document.getElementById("quit-btn")?.remove();
      nextBtn.dataset.mode = "next";
      nextBtn.textContent = "Next";
      return;
    }

    // Normal next
    i++;
    if (i < questions.length) {
      loadQuestion();
    } else {
      finish();
    }
  });

  //Finish & Review
  function finish(){
    setProgress(1);
    quizBox.hidden = true;
    nextBtn.hidden = false;         
    nextBtn.textContent = "Restart";
    nextBtn.dataset.mode = "restart";
    reviewBtn.hidden = false;

    ensureQuitButton();

    const pct = Math.round((score / questions.length) * 100);

        // Send result to backend
    sendScoreToBackend(score, questions.length, difficulty);

    const previousBest = best();
    if (pct > previousBest) setBest(pct);

    scoreDisplay.innerHTML = `
      <div><strong>You scored ${score}/${questions.length}</strong> (${pct}%).</div>
      <div>Best: ${Math.max(previousBest, pct)}%</div>
    `;
  }

  function ensureQuitButton() {
    let quit = document.getElementById("quit-btn");
    if (!quit) {
      quit = document.createElement("a");
      quit.id = "quit-btn";
      quit.className = "btn-outline";
      quit.href = "index.html";
      quit.textContent = "Quit";
      document.querySelector(".quiz-controls")?.appendChild(quit);
    }
  }

  // Review modal
  reviewBtn?.addEventListener('click', () => {
    reviewBody.innerHTML = history.map(h => `
      <div class="rev-item">
        <div class="rev-q">${h.q}</div>
        <div class="rev-a">
          Your answer: <span class="${h.chosen === h.correct ? 'ok' : 'wrong'}">${h.chosen}</span><br>
          Correct answer: <span class="ok">${h.correct}</span>
          ${h.exp ? `<div class="explain" style="margin-top:.4rem">${h.exp}</div>` : ''}
        </div>
      </div>
    `).join('');
    reviewModal.showModal();
  });


  function setProgress(ratio){
    progressBar.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  }

  function renderTimer(){
    if (!timerEl) return;
    timerEl.textContent = String(timeLeft);
    timerEl.style.color = (timeLeft <= 5) ? '#EF4444' : '';
  }

  function shuffle(arr){
    return [...arr].sort(() => Math.random() - 0.5);
  }
})();
// === Groups Page: Load groups from backend ===
(function () {
  const grid = document.getElementById('groups-grid');
  if (!grid) return; // Only run on groups.html

  async function loadGroups() {
    try {
      const res = await fetch('http://localhost:3000/api/groups');
      const data = await res.json();

      if (!data.ok) {
        grid.innerHTML = "<p>Unable to load groups.</p>";
        return;
      }

      const groups = data.groups || [];

      if (!groups.length) {
        grid.innerHTML = "<p>No groups found in database.</p>";
        return;
      }

      // Render group cards dynamically
      grid.innerHTML = groups
        .map(g => `
          <article class="group-card">
            <h3>${g.group_name}</h3>
            <p>${g.description}</p>
          </article>
        `)
        .join("");

    } catch (err) {
      console.error("Groups fetch error:", err);
      grid.innerHTML = "<p>Error loading groups.</p>";
    }
  }

  loadGroups();
})();
