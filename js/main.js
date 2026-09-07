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
  initCyberDuelEngine();
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

    // 3-second continuous rainbow hue cycle
    const rainbowHue = (Date.now() / (3000 / 360)) % 360;
    const primaryColor = `hsl(${rainbowHue}, 100%, 65%)`;
    const secondaryColor = `hsl(${(rainbowHue + 120) % 360}, 100%, 65%)`;
    const tertiaryColor = `hsl(${(rainbowHue + 240) % 360}, 100%, 65%)`;

    // 1. Draw 3D Perspective Grid at Bottom
    draw3DGrid(ctx, width, height, gridOffset, mouse.currentX, rainbowHue);

    // 2. Project and Draw 3D Point Cloud Sphere
    const projectedPoints = [];

    points.forEach((p, index) => {
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

      const dynamicColor = index % 3 === 0 ? primaryColor : index % 3 === 1 ? secondaryColor : tertiaryColor;

      if (scale > 0) {
        projectedPoints.push({
          x: projX,
          y: projY,
          z: z2,
          scale: scale,
          color: dynamicColor,
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
          const alpha = (1 - dist / 65) * 0.22 * projectedPoints[i].scale;
          ctx.strokeStyle = `hsla(${rainbowHue}, 100%, 65%, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    // Draw 3D projected nodes with depth glow
    projectedPoints.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.z > 0 ? 14 : 4;
      ctx.shadowColor = p.color;
      ctx.globalAlpha = Math.max(0.2, (p.z + sphereRadius) / (sphereRadius * 2));
      ctx.fill();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    });

    // 3. Project and Draw 3D Orbiting Ring
    ringPoints.forEach((p) => {
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
        ctx.fillStyle = `hsl(${(rainbowHue + 180) % 360}, 100%, 65%)`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsl(${(rainbowHue + 180) % 360}, 100%, 65%)`;
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

function draw3DGrid(ctx, width, height, offset, mouseTilt, rainbowHue = 180) {
  const horizonY = height * 0.65;
  const gridWidth = width * 1.4;
  const startX = -width * 0.2;

  ctx.save();
  // Draw glowing horizon laser line with rainbow gradient
  const horizonGrad = ctx.createLinearGradient(0, horizonY, width, horizonY);
  horizonGrad.addColorStop(0, 'transparent');
  horizonGrad.addColorStop(0.3, `hsla(${rainbowHue}, 100%, 65%, 0.3)`);
  horizonGrad.addColorStop(0.5, `hsla(${(rainbowHue + 120) % 360}, 100%, 65%, 0.7)`);
  horizonGrad.addColorStop(0.7, `hsla(${(rainbowHue + 240) % 360}, 100%, 65%, 0.3)`);
  horizonGrad.addColorStop(1, 'transparent');

  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(width, horizonY);
  ctx.strokeStyle = horizonGrad;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Perspective vertical lines converging to vanishing point
  const vanishingX = width * 0.5 + mouseTilt * 400;
  const linesCount = 28;

  for (let i = 0; i <= linesCount; i++) {
    const bottomX = startX + (i / linesCount) * gridWidth;
    ctx.beginPath();
    ctx.moveTo(vanishingX, horizonY);
    ctx.lineTo(bottomX, height);
    ctx.strokeStyle = `hsla(${rainbowHue}, 100%, 65%, 0.05)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Perspective horizontal lines moving forward
  for (let y = horizonY; y < height; y += (y - horizonY + 12) * 0.25) {
    const currentY = y + (offset % 15);
    if (currentY > horizonY && currentY < height) {
      const alpha = ((currentY - horizonY) / (height - horizonY)) * 0.1;
      ctx.beginPath();
      ctx.moveTo(0, currentY);
      ctx.lineTo(width, currentY);
      ctx.strokeStyle = `hsla(${(rainbowHue + 60) % 360}, 100%, 65%, ${alpha})`;
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

/* ==========================================================================
   12. 3D CYBER WARRIOR DUEL ENGINE (CINEMATIC COMBAT, CANVAS FX & SYNTH AUDIO)
   ========================================================================== */
function initCyberDuelEngine() {
  const viewport = document.getElementById('duel-viewport');
  const scene = document.getElementById('duel-scene');
  const fxCanvas = document.getElementById('duel-fx-canvas');
  const clashOverlay = document.getElementById('clash-overlay');
  const shotIndicator = document.getElementById('duel-shot-indicator');
  const btnPlay = document.getElementById('btn-play-sequence');
  const btnPlayText = document.getElementById('btn-play-text');
  const btnClash = document.getElementById('btn-clash-strike');
  const shotBtns = document.querySelectorAll('.shot-btn');
  const btnRain = document.getElementById('btn-toggle-rain');
  const btnSparks = document.getElementById('btn-toggle-sparks');
  const cyanHp = document.getElementById('cyan-hp');
  const crimsonHp = document.getElementById('crimson-hp');
  const fpsEl = document.getElementById('duel-fps');

  if (!viewport || !scene || !fxCanvas) return;

  const ctx = fxCanvas.getContext('2d');
  let width = (fxCanvas.width = viewport.clientWidth);
  let height = (fxCanvas.height = viewport.clientHeight);

  window.addEventListener('resize', () => {
    width = fxCanvas.width = viewport.clientWidth;
    height = fxCanvas.height = viewport.clientHeight;
  });

  // State
  let currentShot = 2;
  let isSequencePlaying = false;
  let sequenceTimer = null;
  let rainActive = true;
  let sparksActive = true;
  const mouseTilt = { x: 0, y: 0, targetX: 0, targetY: 0 };

  // 3D Parallax Tilt on Mouse Move
  viewport.addEventListener('mousemove', (e) => {
    const rect = viewport.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseTilt.targetX = (x / rect.width) * 16;
    mouseTilt.targetY = -(y / rect.height) * 12;
  });

  viewport.addEventListener('mouseleave', () => {
    mouseTilt.targetX = 0;
    mouseTilt.targetY = 0;
  });

  viewport.addEventListener('click', () => {
    triggerClashImpact();
  });

  // Particle Systems: Rain & Combat Plasma Sparks
  const raindrops = [];
  const sparks = [];
  const shockwaveRings = [];

  for (let i = 0; i < 110; i++) {
    raindrops.push({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 12 + 16,
      len: Math.random() * 20 + 12,
      opacity: Math.random() * 0.5 + 0.25,
      color: Math.random() > 0.4 ? '#00f0ff' : '#f43f5e'
    });
  }

  function emitClashSparks(count = 70) {
    if (!sparksActive) return;
    const originX = width * 0.5;
    const originY = height * 0.48;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 4;
      const isCyan = Math.random() > 0.45;
      sparks.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: Math.random() * 0.03 + 0.015,
        size: Math.random() * 3.5 + 1.5,
        color: isCyan ? '#00f0ff' : '#ff0055'
      });
    }

    shockwaveRings.push({
      x: originX,
      y: originY,
      radius: 10,
      maxRadius: Math.max(width, height) * 0.55,
      opacity: 1,
      color: '#00f0ff'
    });
  }

  // Synthesized Cyber Combat SFX
  function playPlasmaClashSFX() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctxAudio = new AudioCtx();
      const now = ctxAudio.currentTime;

      // 1. Heavy Impact Sub-Bass
      const subOsc = ctxAudio.createOscillator();
      const subGain = ctxAudio.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.45);
      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      subOsc.connect(subGain);
      subGain.connect(ctxAudio.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.45);

      // 2. High-Voltage Plasma Blade Clash
      const clashOsc = ctxAudio.createOscillator();
      const clashFilter = ctxAudio.createBiquadFilter();
      const clashGain = ctxAudio.createGain();
      clashOsc.type = 'sawtooth';
      clashOsc.frequency.setValueAtTime(880, now);
      clashOsc.frequency.exponentialRampToValueAtTime(180, now + 0.35);

      clashFilter.type = 'bandpass';
      clashFilter.frequency.setValueAtTime(2200, now);
      clashFilter.frequency.exponentialRampToValueAtTime(400, now + 0.35);

      clashGain.gain.setValueAtTime(0.25, now);
      clashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      clashOsc.connect(clashFilter);
      clashFilter.connect(clashGain);
      clashGain.connect(ctxAudio.destination);
      clashOsc.start(now);
      clashOsc.stop(now + 0.35);

      // 3. Electric Spark Crackle Noise
      const bufferSize = ctxAudio.sampleRate * 0.2;
      const noiseBuffer = ctxAudio.createBuffer(1, bufferSize, ctxAudio.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const whiteNoise = ctxAudio.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      const noiseGain = ctxAudio.createGain();
      noiseGain.gain.setValueAtTime(0.18, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      whiteNoise.connect(noiseGain);
      noiseGain.connect(ctxAudio.destination);
      whiteNoise.start(now);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function triggerClashImpact() {
    viewport.classList.remove('shake-impact');
    void viewport.offsetWidth;
    viewport.classList.add('shake-impact');

    clashOverlay.classList.remove('flash');
    void clashOverlay.offsetWidth;
    clashOverlay.classList.add('flash');

    emitClashSparks(90);
    playPlasmaClashSFX();

    if (cyanHp && crimsonHp) {
      const randDamage = Math.floor(Math.random() * 8) + 4;
      crimsonHp.style.width = `${Math.max(25, parseInt(crimsonHp.style.width || 88) - randDamage)}%`;
      setTimeout(() => {
        crimsonHp.style.width = '88%';
      }, 3500);
    }
  }

  function setShot(shotIndex, triggerFx = true) {
    currentShot = shotIndex;
    document.querySelectorAll('.duel-layer.layer-shot').forEach((layer) => {
      if (parseInt(layer.dataset.shot) === shotIndex) {
        layer.classList.add('active');
      } else {
        layer.classList.remove('active');
      }
    });

    shotBtns.forEach((btn) => {
      if (parseInt(btn.dataset.targetShot) === shotIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const shotTitles = {
      1: 'SHOT 1: THE APPROACH',
      2: 'SHOT 2: THE SWORD CLASH',
      3: 'SHOT 3: SHOCKWAVE RECOIL'
    };
    if (shotIndicator) {
      shotIndicator.textContent = shotTitles[shotIndex] || 'COMBAT_ACTIVE';
    }

    if (triggerFx) {
      if (shotIndex === 2) {
        triggerClashImpact();
      } else if (shotIndex === 3) {
        emitClashSparks(120);
        playPlasmaClashSFX();
      } else {
        emitClashSparks(25);
      }
    }
  }

  function startSequence() {
    isSequencePlaying = true;
    btnPlay.classList.add('active');
    btnPlayText.textContent = 'PAUSE 3D SEQUENCE';
    showToast('3D Combat Sequence: PLAYING');

    let step = 1;
    setShot(1, true);

    sequenceTimer = setInterval(() => {
      step = step === 3 ? 1 : step + 1;
      setShot(step, true);
    }, 2800);
  }

  function pauseSequence() {
    isSequencePlaying = false;
    btnPlay.classList.remove('active');
    btnPlayText.textContent = 'PLAY 3D SEQUENCE';
    clearInterval(sequenceTimer);
    sequenceTimer = null;
    showToast('3D Combat Sequence: PAUSED');
  }

  btnPlay.addEventListener('click', () => {
    if (isSequencePlaying) {
      pauseSequence();
    } else {
      startSequence();
    }
  });

  btnClash.addEventListener('click', () => {
    setShot(2, true);
    triggerClashImpact();
  });

  shotBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isSequencePlaying) pauseSequence();
      const target = parseInt(btn.dataset.targetShot);
      setShot(target, true);
    });
  });

  if (btnRain) {
    btnRain.addEventListener('click', () => {
      rainActive = !rainActive;
      btnRain.classList.toggle('active', rainActive);
      showToast(rainActive ? 'Neon Rain FX: ENABLED' : 'Neon Rain FX: DISABLED');
    });
  }

  if (btnSparks) {
    btnSparks.addEventListener('click', () => {
      sparksActive = !sparksActive;
      btnSparks.classList.toggle('active', sparksActive);
      showToast(sparksActive ? 'Plasma Sparks: ENABLED' : 'Plasma Sparks: DISABLED');
    });
  }

  let frameCount = 0;
  let fpsTimer = performance.now();

  function animate(time) {
    mouseTilt.x += (mouseTilt.targetX - mouseTilt.x) * 0.08;
    mouseTilt.y += (mouseTilt.targetY - mouseTilt.y) * 0.08;

    scene.style.transform = `rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg) scale(1.02)`;

    ctx.clearRect(0, 0, width, height);

    if (rainActive) {
      for (let i = 0; i < raindrops.length; i++) {
        const drop = raindrops[i];
        drop.y += drop.speed;
        drop.x -= 1.2;

        if (drop.y > height) {
          drop.y = -drop.len;
          drop.x = Math.random() * width;
        }

        ctx.strokeStyle = drop.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = drop.opacity;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 3, drop.y + drop.len);
        ctx.stroke();
      }
    }

    if (sparksActive) {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.18;
        s.life -= s.decay;

        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.life;
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    for (let i = shockwaveRings.length - 1; i >= 0; i--) {
      const ring = shockwaveRings[i];
      ring.radius += 18;
      ring.opacity = 1 - ring.radius / ring.maxRadius;

      if (ring.radius >= ring.maxRadius || ring.opacity <= 0) {
        shockwaveRings.splice(i, 1);
        continue;
      }

      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = ring.opacity * 0.8;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    if (currentShot === 2 && Math.random() > 0.65 && sparksActive) {
      const originX = width * 0.5 + (Math.random() * 20 - 10);
      const originY = height * 0.48 + (Math.random() * 20 - 10);
      sparks.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1,
        decay: 0.04,
        size: Math.random() * 2.5 + 1,
        color: Math.random() > 0.5 ? '#00f0ff' : '#ff0055'
      });
    }

    frameCount++;
    if (time - fpsTimer >= 1000) {
      if (fpsEl) fpsEl.textContent = `${frameCount} FPS`;
      frameCount = 0;
      fpsTimer = time;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
  startSequence();
}

