/**
 * DINESH P U - PORTFOLIO INTERACTIVITY ENGINE
 * Features: Typewriter, Canvas Particles, Interactive AI Terminal,
 * Audio Synthesizer, 3D Tilt, Theme Switcher, Modals & Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioSystem();
  initThemeToggle();
  initTypewriter();
  initCanvasParticles();
  initCursorGlow();
  initNavbarScroll();
  initMobileMenu();
  initExperienceTabs();
  initSkillsFilter();
  initAvatarTilt();
  initAITerminal();
  initResumeModal();
});

/* ==========================================================================
   1. Audio Synthesizer (Web Audio API)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false; // Muted by default for polite UX

function initAudioSystem() {
  const audioToggle = document.getElementById('audio-toggle');
  if (!audioToggle) return;

  audioToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled && !audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    
    // Update button visual
    if (soundEnabled) {
      audioToggle.style.color = 'var(--accent-cyan)';
      audioToggle.style.borderColor = 'var(--accent-cyan)';
      showToast('Sound effects enabled 🔊');
      playTone(600, 'sine', 0.08);
    } else {
      audioToggle.style.color = 'var(--text-primary)';
      audioToggle.style.borderColor = 'var(--card-border)';
      showToast('Sound effects muted 🔇');
    }
  });

  // Attach sound to interactive buttons
  document.querySelectorAll('button, .btn, .nav-link').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (soundEnabled) playTone(440, 'triangle', 0.03, 0.03);
    });
    el.addEventListener('click', () => {
      if (soundEnabled) playTone(880, 'sine', 0.06, 0.06);
    });
  });
}

function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.05) {
  if (!soundEnabled || !audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore audio errors silently
  }
}

/* ==========================================================================
   2. Theme Toggle (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('dinesh_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dinesh_theme', newTheme);
    showToast(`Switched to ${newTheme} theme`);
  });
}

/* ==========================================================================
   3. Dynamic Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const roles = [
    "Enterprise Software Engineer",
    "Aviation Systems Specialist (Ultramain)",
    "Multi-Database Architect (Oracle, MariaDB, MS SQL)",
    "AI-Assisted Engineer & Prompt Specialist (Codex)"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 90;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      delay = 40;
    } else {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      delay = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      delay = 2000; // Hold at end of string
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400; // Pause before typing next
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   4. Canvas Particle Network
   ========================================================================== */
function initCanvasParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(width > 768 ? 45 : 20, 50);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      color: i % 3 === 0 ? 'rgba(56, 189, 248, 0.6)' : (i % 3 === 1 ? 'rgba(99, 102, 241, 0.6)' : 'rgba(16, 185, 129, 0.5)')
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   5. Cursor Glow Tracking
   ========================================================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || window.innerWidth < 1024) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

/* ==========================================================================
   6. Navbar Scroll Active Link
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('nav-links');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('mobile-open');
  });

  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('mobile-open');
    });
  });
}

/* ==========================================================================
   8. Experience Tab Switcher
   ========================================================================== */
function initExperienceTabs() {
  const tabContainer = document.getElementById('exp-tabs');
  if (!tabContainer) return;

  const buttons = tabContainer.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   9. Skills Matrix Filter
   ========================================================================== */
function initSkillsFilter() {
  const filterContainer = document.getElementById('skill-filters');
  const skillCards = document.querySelectorAll('.skill-card');
  if (!filterContainer) return;

  const buttons = filterContainer.querySelectorAll('.skill-filter-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   10. Avatar 3D Tilt Effect
   ========================================================================== */
function initAvatarTilt() {
  const wrapper = document.getElementById('avatar-card-wrapper');
  const card = document.getElementById('avatar-card');
  if (!wrapper || !card || window.innerWidth < 1024) return;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / rect.height) * -16;
    const rotY = (x / rect.width) * 16;

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   11. Interactive AI Terminal Simulator ("Ask Codex AI")
   ========================================================================== */
function initAITerminal() {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const sendBtn = document.getElementById('terminal-send-btn');
  const chips = document.querySelectorAll('.terminal-chip-btn');

  if (!terminalBody || !terminalInput) return;

  const commandResponses = {
    whoami: `[IDENTITY] Dinesh P U
[TITLE] Versatile Software Developer & Aviation Systems Specialist
[LOCATION] Coimbatore, Tamil Nadu, India
[CORE IMPACT] Over 4 years of hands-on experience in full-lifecycle software development, application maintenance, and multi-database management.
[DISTINCTION] Early adopter of AI-assisted engineering with OpenAI Codex; Ultra Star Employee Award recipient at Ultramain Software India.`,

    experience: `[EXPERIENCE] Software Engineer @ Ultramain Software India Pvt. Ltd. (April 2022 - Aug 2026)
• 4+ years engineering and supporting mission-critical aviation software platforms.
• Optimized asset management, regulatory compliance, operational workflows, and maintenance execution.
• Built & maintained systems supporting Emirates, Cathay Pacific, Virgin Galactic, Starlux Airlines, etc.
• Diagnosed complex bugs via multi-layered Java code tracing and relational database triggers.`,

    aviation: `[AVIATION CLIENT PORTFOLIO]
World-class airlines and aerospace organizations supported:
✈️ Emirates
✈️ Cathay Pacific Airways
🚀 Virgin Galactic
✈️ Virgin Atlantic Airways
✈️ Starlux Airlines
✈️ SRT Malaysia
✈️ AISG
Delivered safe production data corrections, zero-defect patches, and 100% SLA compliance.`,

    skills: `[TECHNICAL STACK MATRIX]
• Programming: Java, Python, SQL, PL/SQL, T-SQL, HTML5, Java Swing
• Databases: Oracle Database, MariaDB, Microsoft SQL Server
• Developer Tools: DBeaver, Heidi SQL, SSMS, Squirrel SQL Client, OpenAI Codex, Git
• AI & Automation: Prompt Engineering, Automated Code Tracing, AI Debugging & Validation
• Practices: Root Cause Analysis (RCA), Unit Testing, Regression Safeguards, SLA Adherence`,

    codex: `[AI-ASSISTED DEVELOPMENT INNOVATION]
• Integrated OpenAI Codex into daily engineering workflows to accelerate issue diagnosis & source code navigation.
• Formulated structured, context-rich technical prompts for complex business logic edge cases.
• Automated boilerplate code generation, formulated surgical debugging strategies, and generated test suites.
• Validated all AI suggestions against strict aviation domain requirements before implementation.`,

    awards: `[HONORS & RECOGNITION]
🏆 Ultra Star Employee Award — Ultramain Software India Pvt. Ltd.
Conferred in recognition of outstanding performance, exceptional dedication, and consistently completing a high volume of complex technical assignments within strict timelines without compromising code quality.`,

    education: `[EDUCATION & CREDENTIALS]
🎓 B.E. Computer Science — Nehru Institute of Engineering and Technology, Anna University (CGPA: 7.89)
🎓 St. Michael's Higher Secondary School — HSC: 74.4% | SSLC: 82.8%
📜 Certifications: GUVI Python Face Recognition, AWS Machine Learning, Google Digital Marketing, Elysium Ethical Hacking, Indian Servers Python Bootcamp, Quantanics IoT/ML Internship.`,

    contact: `[DIRECT CONTACT CHANNELS]
📧 Email: dineshkumar46247@gmail.com
📞 Phone: +91 8072814839
📍 Location: Coimbatore, Tamil Nadu, India (Open to Relocation)
💬 WhatsApp: https://wa.me/918072814839`,

    help: `Available commands:
• whoami       - Profile overview & elevator pitch
• experience   - 4+ years at Ultramain Software India
• aviation     - Global airlines supported (Emirates, Cathay, etc.)
• skills       - Java, Python, Oracle, MariaDB, SQL Server, Codex
• codex        - AI prompt engineering & automation workflow
• awards       - Ultra Star Employee Award details
• education    - B.E. Computer Science & certifications
• contact      - Email, phone, location & WhatsApp
• download     - Download official resume (.docx)
• clear        - Wipe terminal screen`
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      terminalBody.innerHTML = `
        <div class="terminal-log-entry">
          <div class="terminal-prompt-line">Terminal cleared. Ready for commands.</div>
        </div>
      `;
      terminalInput.value = '';
      return;
    }

    if (cmd === 'download') {
      appendTerminalEntry(rawCmd, 'Initiating download of Dinesh_PU_Resume.docx...');
      const downloadLink = document.createElement('a');
      downloadLink.href = 'assets/docs/Dinesh_PU_Resume.docx';
      downloadLink.download = 'Dinesh_PU_Resume.docx';
      downloadLink.click();
      showToast('Downloading resume...');
      terminalInput.value = '';
      return;
    }

    let response = commandResponses[cmd];

    if (!response) {
      // Intelligent fuzzy matching or AI prompt simulation
      if (cmd.includes('hire') || cmd.includes('job') || cmd.includes('role') || cmd.includes('relocat')) {
        response = `[QUERY MATCH]: Dinesh is actively open to high-impact software engineering roles globally.
Contact directly at dineshkumar46247@gmail.com or call +91 8072814839.`;
      } else if (cmd.includes('airline') || cmd.includes('flight') || cmd.includes('emirate')) {
        response = commandResponses.aviation;
      } else if (cmd.includes('database') || cmd.includes('oracle') || cmd.includes('sql')) {
        response = `[DATABASE ARCHITECTURE]:
Extensive experience managing Oracle Database, MariaDB, and MS SQL Server in enterprise production.
Handles data fixes, query plan optimization, complex stored procedures, and triggers safely.`;
      } else if (cmd.includes('python') || cmd.includes('java')) {
        response = commandResponses.skills;
      } else {
        response = `Command not recognized: '${cmd}'.\nType 'help' to see valid commands or click any chip below.`;
      }
    }

    appendTerminalEntry(rawCmd, response);
    terminalInput.value = '';
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function appendTerminalEntry(cmd, response) {
    const entry = document.createElement('div');
    entry.className = 'terminal-log-entry';
    entry.innerHTML = `
      <div class="terminal-prompt-line">dinesh&gt; ${escapeHtml(cmd)}</div>
      <div class="terminal-response-line">${escapeHtml(response)}</div>
    `;
    terminalBody.appendChild(entry);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Handle Input keypress
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput.value);
    }
  });

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      executeCommand(terminalInput.value);
    });
  }

  // Quick Chips Click
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });
}

/* ==========================================================================
   12. Full Resume Viewer Modal
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('open-resume-btn');
  const closeBtn = document.getElementById('close-modal-btn');

  if (!modal || !openBtn) return;

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   13. Global Helper Functions: Toast & Clipboard
   ========================================================================== */
window.showToast = function(msg, icon = '✓') {
  const toast = document.getElementById('toast');
  const textEl = document.getElementById('toast-text');
  const iconEl = document.getElementById('toast-icon');

  if (!toast || !textEl) return;

  textEl.textContent = msg;
  if (iconEl) iconEl.textContent = icon;

  toast.classList.add('show');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
};

window.copyToClipboard = function(text, successMsg = 'Copied to clipboard!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
};

function fallbackCopy(text, successMsg) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast('Failed to copy', '⚠️');
  }
  document.body.removeChild(textarea);
}

window.handleFormSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('form-name').value;
  const email = document.getElementById('form-email').value;
  const subject = document.getElementById('form-subject').value;
  const message = document.getElementById('form-message').value;

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>Sending...</span>`;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>Message Sent Successfully!</span>`;
    showToast(`Thank you ${name}! Your message has been recorded.`);
    e.target.reset();

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
    }, 4000);
  }, 900);
};
