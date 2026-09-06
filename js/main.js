/**
 * ROSHAN // 3D CYBER ENGINE & PORTFOLIO SCRIPT
 * Features:
 * - 3D Interactive Projected Cyber Polyhedron & Particle Matrix (Canvas 3D Engine)
 * - 3D Perspective Wave Grid Horizon
 * - Real-time 3D Mouse Parallax & Dynamic Hologram Tilt
 * - Typewriter Interactive Effect
 * - Interactive Terminal CLI with Auto-Suggestions
 * - Project Category Filter Engine
 * - Web Audio API Synthesized Cyber SFX
 * - Scroll Spy & Notification Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  init3DCyberCanvas();
  init3DParallaxTilt();
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
   1. 3D CYBER CANVAS ENGINE (PROJECTED 3D SPHERE, RINGS & PERSPECTIVE GRID)
   ========================================================================== */
function init3DCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = {
    x: width / 2,
    y: height / 2,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.targetX = (e.clientX - width / 2) * 0.0006;
    mouse.targetY = (e.clientY - height / 2) * 0.0006;
  });

  // 3D Sphere and Ring Point Cloud
  const points = [];
  const sphereRadius = Math.min(width, height) * 0.28;
  const numPoints = 160;

  // Generate 3D Fibonacci Sphere
  for (let i = 0; i < numPoints; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;

    points.push({
      x: sphereRadius * Math.sin(phi) * Math.cos(theta),
      y: sphereRadius * Math.sin(phi) * Math.sin(theta),
      z: sphereRadius * Math.cos(phi),
      baseX: sphereRadius * Math.sin(phi) * Math.cos(theta),
      baseY: sphereRadius * Math.sin(phi) * Math.sin(theta),
      baseZ: sphereRadius * Math.cos(phi),
      color: i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#a855f7' : '#38bdf8',
      size: Math.random() * 2 + 1.2
    });
  }

  // Generate 3D Orbiting Ring
  const ringPoints = [];
  const ringRadius = sphereRadius * 1.45;
  const ringCount = 80;
  for (let i = 0; i < ringCount; i++) {
    const angle = (i / ringCount) * Math.PI * 2;
    ringPoints.push({
      x: ringRadius * Math.cos(angle),
      y: (Math.random() - 0.5) * 15,
      z: ringRadius * Math.sin(angle),
      baseX: ringRadius * Math.cos(angle),
      baseY: (Math.random() - 0.5) * 15,
      baseZ: ringRadius * Math.sin(angle),
      color: '#00f0ff',
      size: 1.8
    });
  }

  // Floating background cyber dust
  const dustParticles = [];
  const dustCount = 45;
  for (let i = 0; i < dustCount; i++) {
    dustParticles.push({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: (Math.random() - 0.5) * 600,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.4
    });
  }

  let angleX = 0;
  let angleY = 0;
  let angleZ = 0;
  let gridOffset = 0;

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Smooth camera mouse dampening
    mouse.currentX += (mouse.targetX - mouse.currentX) * 0.05;
    mouse.currentY += (mouse.targetY - mouse.currentY) * 0.05;

    angleY += 0.005 + mouse.currentX;
    angleX += 0.003 + mouse.currentY;
    angleZ += 0.002;
    gridOffset = (gridOffset + 0.5) % 40;

    const fov = 480;
    const centerX = width > 992 ? width * 0.72 : width * 0.5;
    const centerY = height * 0.48;

    // 1. Draw 3D Perspective Grid at Bottom
    draw3DGrid(ctx, width, height, gridOffset, mouse.currentX);

    // 2. Project and Draw 3D Point Cloud Sphere
    const projectedPoints = [];

    points.forEach((p) => {
      // Rotate 3D Euler
      let x1 = p.baseX * Math.cos(angleY) - p.baseZ * Math.sin(angleY);
      let z1 = p.baseZ * Math.cos(angleY) + p.baseX * Math.sin(angleY);

      let y2 = p.baseY * Math.cos(angleX) - z1 * Math.sin(angleX);
      let z2 = z1 * Math.cos(angleX) + p.baseY * Math.sin(angleX);

      let x3 = x1 * Math.cos(angleZ) - y2 * Math.sin(angleZ);
      let y3 = y2 * Math.cos(angleZ) + x1 * Math.sin(angleZ);

      // Perspective projection
      const scale = fov / (fov + z2);
      const projX = x3 * scale + centerX;
      const projY = y3 * scale + centerY;

      if (scale > 0) {
        projectedPoints.push({
          x: projX,
          y: projY,
          z: z2,
          scale: scale,
          color: p.color,
          size: p.size * scale
        });
      }
    });

    // Sort by Z for realistic depth
    projectedPoints.sort((a, b) => a.z - b.z);

    // Draw 3D Cyber Geometric Connections
    for (let i = 0; i < projectedPoints.length; i++) {
      for (let j = i + 1; j < projectedPoints.length; j++) {
        const dx = projectedPoints[i].x - projectedPoints[j].x;
        const dy = projectedPoints[i].y - projectedPoints[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 65) {
          ctx.beginPath();
          ctx.moveTo(projectedPoints[i].x, projectedPoints[i].y);
          ctx.lineTo(projectedPoints[j].x, projectedPoints[j].y);
          const alpha = (1 - dist / 65) * 0.18 * projectedPoints[i].scale;
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw 3D projected nodes with depth glow
    projectedPoints.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.z > 0 ? 12 : 3;
      ctx.shadowColor = p.color;
      ctx.globalAlpha = Math.max(0.2, (p.z + sphereRadius) / (sphereRadius * 2));
      ctx.fill();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    });

    // 3. Project and Draw 3D Orbiting Ring
    ringPoints.forEach((p) => {
      // Tilt ring by 45 deg + rotate
      const tiltAngle = Math.PI / 3.5;
      let y0 = p.baseY * Math.cos(tiltAngle) - p.baseZ * Math.sin(tiltAngle);
      let z0 = p.baseZ * Math.cos(tiltAngle) + p.baseY * Math.sin(tiltAngle);

      let x1 = p.baseX * Math.cos(-angleY * 1.5) - z0 * Math.sin(-angleY * 1.5);
      let z1 = z0 * Math.cos(-angleY * 1.5) + p.baseX * Math.sin(-angleY * 1.5);

      const scale = fov / (fov + z1);
      const projX = x1 * scale + centerX;
      const projY = y0 * scale + centerY;

      if (scale > 0) {
        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(0.6, p.size * scale), 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f0ff';
        ctx.globalAlpha = Math.max(0.2, (z1 + ringRadius) / (ringRadius * 2));
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }
    });

    // 4. Background Dust particles
    dustParticles.forEach((d) => {
      d.x += d.vx;
      d.y += d.vy;
      d.z += d.vz;

      if (d.x < -width) d.x = width;
      if (d.x > width) d.x = -width;
      if (d.y < -height) d.y = height;
      if (d.y > height) d.y = -height;
      if (d.z < -300) d.z = 300;
      if (d.z > 300) d.z = -300;

      const scale = fov / (fov + d.z + 400);
      const projX = d.x * scale + width / 2;
      const projY = d.y * scale + height / 2;

      ctx.beginPath();
      ctx.arc(projX, projY, Math.max(0.4, 1.2 * scale), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

function draw3DGrid(ctx, width, height, offset, mouseTilt) {
  const horizonY = height * 0.65;
  const gridWidth = width * 1.4;
  const startX = -width * 0.2;

  ctx.save();
  // Draw glowing horizon laser line
  const horizonGrad = ctx.createLinearGradient(0, horizonY, width, horizonY);
  horizonGrad.addColorStop(0, 'transparent');
  horizonGrad.addColorStop(0.3, 'rgba(0, 240, 255, 0.2)');
  horizonGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.5)');
  horizonGrad.addColorStop(0.7, 'rgba(0, 240, 255, 0.2)');
  horizonGrad.addColorStop(1, 'transparent');

  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(width, horizonY);
  ctx.strokeStyle = horizonGrad;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Perspective vertical lines converging to vanishing point
  const vanishingX = width * 0.5 + mouseTilt * 400;
  const linesCount = 28;

  for (let i = 0; i <= linesCount; i++) {
    const bottomX = startX + (i / linesCount) * gridWidth;
    ctx.beginPath();
    ctx.moveTo(vanishingX, horizonY);
    ctx.lineTo(bottomX, height);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Perspective horizontal lines moving forward
  for (let y = horizonY; y < height; y += (y - horizonY + 12) * 0.25) {
    const currentY = y + (offset % 15);
    if (currentY > horizonY && currentY < height) {
      const alpha = ((currentY - horizonY) / (height - horizonY)) * 0.08;
      ctx.beginPath();
      ctx.moveTo(0, currentY);
      ctx.lineTo(width, currentY);
      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  ctx.restore();
}

/* ==========================================================================
   2. 3D PARALLAX TILT ON HERO NAME & CARDS
   ========================================================================== */
function init3DParallaxTilt() {
  const heroVisual = document.querySelector('.hero-visual');
  const heroName = document.querySelector('.hero-name');
  const heroContent = document.querySelector('.hero-content');

  if (!heroVisual && !heroName) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    if (heroName) {
      heroName.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(20px)`;
    }

    if (heroVisual) {
      heroVisual.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    }
  });

  document.addEventListener('mouseleave', () => {
    if (heroName) heroName.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    if (heroVisual) heroVisual.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  });
}

/* ==========================================================================
   3. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const phrases = [
    'Engineering Student // B.Tech Undergrad',
    'Full-Stack Web Developer & Architect',
    'JavaScript & React.js Specialist',
    'RESTful APIs & High-Scale Systems',
    'Problem Solver & Creative Technologist'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 85;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1900;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 350;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. INTERACTIVE TERMINAL CLI
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
<div class="t-line">GitHub:   <a href="https://github.com/roshanr14" target="_blank" class="t-yellow">github.com/roshanr14</a></div>
<div class="t-line">LinkedIn: <a href="https://linkedin.com" target="_blank" class="t-yellow">linkedin.com/in/roshan</a></div>
`,
    whoami: `
<div class="t-line">guest@roshan-cyberdeck (Level: Explorer, Access: Read-Only)</div>
`
  };

  function executeCommand(cmdText) {
    const cleanCmd = cmdText.trim().toLowerCase();
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
      // blank
    } else {
      commandEntry.innerHTML += `<div class="t-line t-muted">zsh: command not found: ${escapeHtml(cleanCmd)}. Type <span class="t-yellow">'help'</span> for list of commands.</div>`;
    }

    history.appendChild(commandEntry);
    input.value = '';

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
   5. PROJECT FILTER ENGINE
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
   6. WEB AUDIO API SYNTHESIZED CYBER SFX
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
    // browser policy fallback
  }
}

/* ==========================================================================
   7. NAVIGATION, MOBILE MENU & SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('cyber-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

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
   8. CONTACT FORM SUBMISSION
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

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      feedback.className = 'form-feedback error';
      feedback.textContent = '❌ Transmission Error: Invalid email format.';
      return;
    }

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
   9. COPY GITHUB README TO CLIPBOARD
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
      showToast('⚠️ Copied preview snippet to clipboard!');
    }
  });
}

/* ==========================================================================
   10. TOAST NOTIFICATION UTILITY
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
   11. CURRENT YEAR IN FOOTER
   ========================================================================== */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
