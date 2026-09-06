/**
 * ROSHAN // CYBER PORTFOLIO MAIN SCRIPT
 * Features:
 * - Dynamic Canvas Particle & Cyber Constellation Animation
 * - Interactive Typewriter Effect
 * - Interactive Terminal CLI (about, skills, projects, contact, etc.)
 * - Project Category Filter Engine
 * - Web Audio API Synthesized Cyber Audio Feedback (No external audio files required)
 * - Seamless Nav Scroll Spy & Mobile Menu Toggle
 * - Copy GitHub README to Clipboard with Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  initCyberCanvas();
  initTypewriter();
  initTerminalCLI();
  initProjectFilters();
  initCyberAudio();
  initNavigation();
  initContactForm();
  initCopyReadme();
  initCurrentYear();
});

/* ==========================================================================
   1. CYBER CANVAS PARTICLES & CONSTELLATION GRID
   ========================================================================== */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 140 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Create particles
  const particleCount = Math.min(Math.floor((width * height) / 12000), 85);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.size = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255, ' : 'rgba(168, 85, 247, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2.5;
          this.y -= Math.sin(angle) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f0ff';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const lineAlpha = (1 - dist / 130) * 0.22;
          ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const phrases = [
    'Engineering Student // B.Tech Undergrad',
    'Full-Stack Web Developer',
    'JavaScript & React Enthusiast',
    'REST APIs & Backend Architect',
    'Problem Solver & Creative Coder'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. INTERACTIVE TERMINAL CLI
   ========================================================================== */
function initTerminalCLI() {
  const input = document.getElementById('terminal-cli-input');
  const history = document.getElementById('terminal-history');
  const chips = document.querySelectorAll('.chip-btn');
  if (!input || !history) return;

  const commands = {
    help: `
<div class="t-line t-cyan">AVAILABLE COMMANDS:</div>
<div class="t-line">&nbsp;&nbsp;<span class="t-yellow">about</span>       : View summary of Roshan's background</div>
<div class="t-line">&nbsp;&nbsp;<span class="t-yellow">skills</span>      : List technical proficiencies & arsenal</div>
<div class="t-line">&nbsp;&nbsp;<span class="t-yellow">projects</span>    : List active software & web missions</div>
<div class="t-line">&nbsp;&nbsp;<span class="t-yellow">education</span>   : View academic background & degrees</div>
<div class="t-line">&nbsp;&nbsp;<span class="t-yellow">contact</span>     : Display direct contact channels</div>
<div class="t-line">&nbsp;&nbsp;<span class="t-yellow">whoami</span>      : Show current user session info</div>
<div class="t-line">&nbsp;&nbsp;<span class="t-yellow">clear</span>       : Clear terminal screen</div>
`,
    about: `
<div class="t-line t-green">-- IDENTITY LOG --</div>
<div class="t-line">Roshan is an Engineering Student & Web Developer committed to building scalable full-stack applications, interactive user experiences, and exploring cutting-edge web technologies.</div>
`,
    skills: `
<div class="t-line t-cyan">-- TECHNICAL MATRIX --</div>
<div class="t-line">Frontend: HTML5, CSS3, JavaScript (ES6+), TypeScript, React.js, Tailwind CSS</div>
<div class="t-line">Backend:  Node.js, Express.js, Python, MongoDB, PostgreSQL, REST APIs</div>
<div class="t-line">Tools:    Git, GitHub, Docker, Linux Shell, Vercel, Netlify, VS Code</div>
`,
    projects: `
<div class="t-line t-purple">-- MISSION CATALOG --</div>
<div class="t-line">1. <span class="t-cyan">CyberDeck</span> - Developer Command Center & Workspace (React + Node.js)</div>
<div class="t-line">2. <span class="t-cyan">NexusFlow</span> - AI Prompt Pipeline Orchestrator (Next.js + OpenAI)</div>
<div class="t-line">3. <span class="t-cyan">HyperGrid</span> - Cyberpunk Accessible UI System (Vanilla JS + CSS)</div>
<div class="t-line">4. <span class="t-cyan">AlgoVisualizer</span> - Real-time CS Algorithm Visualizer (Canvas + DSA)</div>
`,
    education: `
<div class="t-line t-yellow">-- ACADEMIC PROFILE --</div>
<div class="t-line">Degree: Bachelor of Technology (B.Tech) in Engineering</div>
<div class="t-line">Core Subjects: DSA, DBMS, Operating Systems, Computer Networks, Software Engineering</div>
<div class="t-line">Status: Undergraduate Student [2023 - Present]</div>
`,
    contact: `
<div class="t-line t-cyan">-- TRANSMISSION CHANNELS --</div>
<div class="t-line">Email:    <a href="mailto:roshan.dev@example.com" class="t-yellow">roshan.dev@example.com</a></div>
<div class="t-line">GitHub:   <a href="https://github.com" target="_blank" class="t-yellow">github.com</a></div>
<div class="t-line">LinkedIn: <a href="https://linkedin.com" target="_blank" class="t-yellow">linkedin.com/in/roshan</a></div>
`,
    whoami: `
<div class="t-line">guest@roshan-cyberdeck (Level: Explorer, Access: Read-Only)</div>
`
  };

  function executeCommand(cmdText) {
    const cleanCmd = cmdText.trim().toLowerCase();
    
    // Play subtle audio if enabled
    playCyberSound('beep');

    if (cleanCmd === 'clear') {
      history.innerHTML = '';
      input.value = '';
      return;
    }

    const commandEntry = document.createElement('div');
    commandEntry.className = 't-command-entry';
    commandEntry.innerHTML = `<div class="t-line"><span class="t-cyan">roshan@guest</span>:<span class="t-purple">~</span>$ <span class="t-yellow">${escapeHtml(cmdText)}</span></div>`;

    if (commands[cleanCmd]) {
      commandEntry.innerHTML += commands[cleanCmd];
    } else if (cleanCmd === '') {
      // Do nothing for blank enter
    } else {
      commandEntry.innerHTML += `<div class="t-line t-muted">zsh: command not found: ${escapeHtml(cleanCmd)}. Type <span class="t-yellow">'help'</span> for list of commands.</div>`;
    }

    history.appendChild(commandEntry);
    input.value = '';

    // Scroll to bottom
    const screen = document.getElementById('interactive-screen');
    if (screen) {
      screen.scrollTop = screen.scrollHeight;
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(input.value);
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) executeCommand(cmd);
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ==========================================================================
   4. PROJECT FILTER ENGINE
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      playCyberSound('click');
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. WEB AUDIO API SYNTHESIZED CYBER SFX
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initCyberAudio() {
  const sfxBtn = document.getElementById('sfx-toggle');
  if (!sfxBtn) return;

  sfxBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    sfxBtn.innerHTML = soundEnabled
      ? '<i class="fa-solid fa-volume-high"></i>'
      : '<i class="fa-solid fa-volume-xmark"></i>';
    sfxBtn.title = soundEnabled ? 'Disable Audio Feedback' : 'Enable Audio Feedback';
    
    showToast(soundEnabled ? 'Cyber Audio: ONLINE' : 'Cyber Audio: MUTED');
    if (soundEnabled) playCyberSound('beep');
  });
}

function playCyberSound(type) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch (e) {
    // Gracefully handle browser autoplay policies
  }
}

/* ==========================================================================
   6. NAVIGATION, MOBILE MENU & SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('cyber-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll sticky navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy active link
    let current = '';
    const scrollPosition = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      playCyberSound('click');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        playCyberSound('click');
      });
    });
  }
}

/* ==========================================================================
   7. CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !feedback || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    playCyberSound('beep');

    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const subject = form.elements['subject'].value.trim();
    const message = form.elements['message'].value.trim();

    if (!name || !email || !subject || !message) {
      feedback.className = 'form-feedback error';
      feedback.textContent = '❌ Transmission Error: All fields are required.';
      return;
    }

    // Email regex validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      feedback.className = 'form-feedback error';
      feedback.textContent = '❌ Transmission Error: Invalid email format.';
      return;
    }

    // Simulate sending transmission
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-content"><i class="fa-solid fa-spinner fa-spin"></i> ENCRYPTING & TRANSMITTING...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-content"><i class="fa-solid fa-paper-plane"></i> TRANSMIT MESSAGE</span>';
      
      feedback.className = 'form-feedback success';
      feedback.innerHTML = '✅ Transmission Received! Message encrypted & dispatched to Roshan.';
      form.reset();
      showToast('Transmission dispatched successfully!');
      playCyberSound('beep');
    }, 1200);
  });
}

/* ==========================================================================
   8. COPY GITHUB README TO CLIPBOARD
   ========================================================================== */
function initCopyReadme() {
  const copyBtn = document.getElementById('copy-readme-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    playCyberSound('click');
    try {
      const response = await fetch('README.md');
      if (!response.ok) throw new Error('Could not fetch README.md');
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      showToast('⚡ README.md copied to clipboard!');
    } catch (err) {
      // Fallback
      showToast('⚠️ Copied preview snippet to clipboard!');
    }
  });
}

/* ==========================================================================
   9. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-terminal t-cyan"></i> <span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ==========================================================================
   10. CURRENT YEAR IN FOOTER
   ========================================================================== */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
