/**
 * Jogu Kusuma Manjari - Professional Developer Portfolio Engine
 * Handles: Loader Screen, Theme System, Mobile Menu, Canvas Background, Reveal on Scroll.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initMobileMenu();
  initStickyNavbar();
  initHeroCanvas();
  initScrollReveal();
  initEmailAction();
  initCertModal();
  initNssLightbox();
  initResumePreview();
});

/* ==========================================
   1. LOADER SCREEN
   ========================================== */
function initLoader() {

  const loader = document.getElementById('loader-wrapper');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      document.body.style.overflowY = 'auto';
    }, 600);
  });
}

/* ==========================================
   2. THEME SYSTEM
   ========================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  if (!themeToggle || !themeIcon) return;

  const savedTheme = localStorage.getItem('portfolio-theme');

  let currentTheme = 'dark';
  if (savedTheme) {
    currentTheme = savedTheme;
  }

  applyTheme(currentTheme);

  themeToggle.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');

    if (window.refreshHeroCanvasTheme) {
      window.refreshHeroCanvasTheme(theme);
    }
  }
}

/* ==========================================
   3. MOBILE NAVIGATION MENU
   ========================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!mobileToggle || !navLinks) return;

  mobileToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      navLinks.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.classList.remove('active');
    } else {
      navLinks.classList.add('open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.classList.add('active');
    }
  });

  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.classList.remove('active');
    });
  });
}

/* ==========================================
   4. STICKY NAVBAR CLASS
   ========================================== */
function initStickyNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================
   5. HERO BACKGROUND PARTICLES ANIMATION
   ========================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;
  let particles = [];

  let accentColor = '#A3B18A';
  let particleColor = 'rgba(163, 177, 138, 0.45)';
  let lineColor = 'rgba(163, 177, 138, 0.08)';

  window.refreshHeroCanvasTheme = function (theme) {
    if (theme === 'light') {
      accentColor = '#6B8F71';
      particleColor = 'rgba(107, 143, 113, 0.55)';
      lineColor = 'rgba(107, 143, 113, 0.12)';
    } else {
      accentColor = '#A3B18A';
      particleColor = 'rgba(163, 177, 138, 0.45)';
      lineColor = 'rgba(163, 177, 138, 0.08)';
    }
  };

  const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  window.refreshHeroCanvasTheme(initialTheme);

  const mouse = { x: null, y: null, radius: 110 };

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight || 420;
    createParticles();
  }

  window.addEventListener('resize', resize);

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.baseRadius = Math.random() * 2 + 1;
      this.radius = this.baseRadius;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 0.4;
          this.y -= (dy / dist) * force * 0.4;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    // Adjust density based on screen width (desktop: 45, tablet: 30, mobile: 18)
    let count = 45;
    if (canvas.width < 768) {
      count = 18;
    } else if (canvas.width < 1024) {
      count = 30;
    }
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
  }

  function drawLines() {
    const maxDist = canvas.width < 768 ? 90 : 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.95;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = lineColor.replace('0.08', (opacity * 0.08).toFixed(3))
            .replace('0.12', (opacity * 0.12).toFixed(3));
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    animationId = requestAnimationFrame(loop);
  }

  resize();
  loop();
}

/* ==========================================
   6. INTERSECTION OBSERVER FOR SCROLL REVEAL
   ========================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section, header');

  const revealOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  reveals.forEach(el => observer.observe(el));

  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(sec => activeSectionObserver.observe(sec));
}

/* ==========================================
   7. EMAIL ACTION WITH COPY & TOAST NOTIFICATION
   ========================================== */
function initEmailAction() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

  emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const email = href.replace(/^mailto:/i, '').split('?')[0];

      if (!email) return;

      // Copy email to clipboard
      copyTextToClipboard(email);

      // Display the toast notification
      showEmailToast(email);
    });
  });
}

function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Clipboard API failed, using fallback:', err);
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-99999px';
  textArea.style.top = '-99999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback copy method failed:', err);
  }
  document.body.removeChild(textArea);
}

function showEmailToast(email) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>Email copied & launching mail client: ${email}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3500);
}

/* ==========================================
   8. CERTIFICATES & HACKATHONS MODAL SYSTEM
   ========================================== */

const CERTIFICATES_DATA = {
  'cisco': {
    title: 'Cisco Networking Academy',
    subtitle: 'Computer Networking & Network Simulation',
    badge: '5 Certificates',
    certificates: [
      {
        title: 'CCNA: Introduction to Networks',
        issuer: 'Cisco Networking Academy',
        id: '4c4bc82d-3214-44d4-8e2b-5927649c9f98',
        skills: 'Network Protocols • IP Subnetting • Ethernet Architecture • Device Configuration',
        pdf: 'CERTIFICATES/CISCO/CCNA-_Introduction_to_Networks_certificate_23r01a6614-cmrithyderabad-edu-in_4c4bc82d-3214-44d4-8e2b-5927649c9f98.pdf'
      },
      {
        title: 'CCNA: Switching, Routing, and Wireless Essentials',
        issuer: 'Cisco Networking Academy',
        id: '7ec60598-fae1-4e17-9f2f-b14f0fa54438',
        skills: 'VLANs • STP • EtherChannel • Routing Protocols & WLAN Architecture',
        pdf: 'CERTIFICATES/CISCO/CCNA-_Switching-_Routing-_and_Wireless_Essentials_certificate_23r01a6614-cmrithyderabad-edu-in_7ec60598-fae1-4e17-9f2f-b14f0fa54438.pdf'
      },
      {
        title: 'CCNA: Enterprise Networking, Security, and Automation',
        issuer: 'Cisco Networking Academy',
        id: '0f885eb6-a865-4962-a96c-25ce384af904',
        skills: 'OSPF • Network Security • VPNs • REST APIs & Network Automation',
        pdf: 'CERTIFICATES/CISCO/CCNA-_Enterprise_Networking-_Security-_and_Automation_certificate_23r01a6614-cmrithyderabad-edu-in_0f885eb6-a865-4962-a96c-25ce384af904.pdf'
      },
      {
        title: 'Exploring Networking with Cisco Packet Tracer',
        issuer: 'Cisco Networking Academy',
        id: '127e4215-82b0-4911-a6cc-164eefa6acbe',
        skills: 'Network Topology Design • Packet Simulation • Traffic Analysis',
        pdf: 'CERTIFICATES/CISCO/Exploring_Networking_with_Cisco_Packet_Tracer_certificate_23r01a6614-cmrithyderabad-edu-in_127e4215-82b0-4911-a6cc-164eefa6acbe.pdf'
      },
      {
        title: 'Getting Started with Cisco Packet Tracer',
        issuer: 'Cisco Networking Academy',
        id: '8b3aec5c-7005-420e-ac85-efc3cabd77cd',
        skills: 'Network Modeling • Virtual Hardware Configuration • Troubleshooting',
        pdf: 'CERTIFICATES/CISCO/Getting_Started_with_Cisco_Packet_Tracer_certificate_23r01a6614-cmrithyderabad-edu-in_8b3aec5c-7005-420e-ac85-efc3cabd77cd.pdf'
      }
    ]
  },
  'google': {
    title: 'Google Cloud',
    subtitle: 'Cloud Engineering & Generative AI',
    badge: '2 Certificates',
    certificates: [
      {
        title: 'Google Cloud Certified Associate Cloud Engineer',
        issuer: 'Google Cloud',
        id: 'Series ID: 199939 • Aug 11, 2026',
        skills: 'Cloud Infrastructure • Virtual Machines • Kubernetes • IAM & Cloud Security',
        pdf: 'CERTIFICATES/Google/Document from Kusuma.pdf'
      },
      {
        title: 'Google Cloud Certified Generative AI Leader',
        issuer: 'Google Cloud',
        id: 'Series ID: 74827 • Jul 27, 2026',
        skills: 'Generative AI Strategy • LLM Deployment • Vertex AI • Responsible AI Governance',
        pdf: 'CERTIFICATES/Google/Document from Kusuma(1).pdf'
      }
    ]
  },
  'infosys': {
    title: 'Infosys Springboard',
    subtitle: 'Java Development, Cloud Architecture & Generative AI',
    badge: '11 Certificates',
    certificates: [
      {
        title: 'Java Foundation Certification',
        issuer: 'Infosys Springboard',
        id: 'Issued Jan 17, 2026',
        skills: 'Core Java • Object-Oriented Architecture • Data Structures • Algorithmic Foundations',
        pdf: 'CERTIFICATES/Infosys/1-b62164ce-d097-4bb2-a7c3-726d8c40bedf.pdf'
      },
      {
        title: 'Essentials of Cloud Computing',
        issuer: 'Infosys Springboard',
        id: 'Issued Feb 4, 2026',
        skills: 'Cloud Architecture • Virtualization • IaaS, PaaS, SaaS Models • Resource Provisioning',
        pdf: 'CERTIFICATES/Infosys/1c01154e-63f8-40ad-bc09-8ea21b0657d9.pdf'
      },
      {
        title: 'Introduction to Cloud Computing',
        issuer: 'Infosys Springboard',
        id: 'Issued Feb 4, 2026',
        skills: 'Distributed Computing • Cloud Infrastructure • Elastic Storage & Networking',
        pdf: 'CERTIFICATES/Infosys/d3b666c7-7638-4226-9e78-97ba3db9c365.pdf'
      },
      {
        title: 'An Introduction to Generative AI',
        issuer: 'Infosys Springboard',
        id: 'Issued Feb 4, 2026',
        skills: 'Transformer Models • LLM Foundations • Neural Synthesis • Prompt Engineering',
        pdf: 'CERTIFICATES/Infosys/aa62c46e-1a9d-4957-8bb3-e727398ff9f3.pdf'
      },
      {
        title: 'Generative AI Foundations: Advanced Generative AI Techniques for IT',
        issuer: 'Infosys Springboard',
        id: 'Issued Feb 4, 2026',
        skills: 'Fine-Tuning Strategies • RAG Architectures • Embeddings • Autonomous Agents',
        pdf: 'CERTIFICATES/Infosys/b7c281a2-e3be-4932-885c-e181537d46a4.pdf'
      },
      {
        title: 'Generative AI Foundations: IT Integration with Generative AI',
        issuer: 'Infosys Springboard',
        id: 'Issued Feb 4, 2026',
        skills: 'Enterprise IT Workflows • API Integration • Prompt Pipelines • System Integration',
        pdf: 'CERTIFICATES/Infosys/23ff9767-949a-4c62-ab44-99828c1078dc.pdf'
      },
      {
        title: 'Programming using Java',
        issuer: 'Infosys Springboard',
        id: 'Issued Dec 12, 2025',
        skills: 'Java OOP Principles • Polymorphism • Exception Handling • Collections Framework',
        pdf: 'CERTIFICATES/Infosys/Document from Kusuma(1).pdf'
      },
      {
        title: 'Database Management System Part - 1',
        issuer: 'Infosys Springboard',
        id: 'Issued Dec 12, 2025',
        skills: 'Relational Model • SQL Queries • Schema Design • ER Modeling',
        pdf: 'CERTIFICATES/Infosys/Document from Kusuma.pdf'
      },
      {
        title: 'Database Management System Part - 2',
        issuer: 'Infosys Springboard',
        id: 'Issued Dec 12, 2025',
        skills: 'Transactions • Indexing • Concurrency Control • Normalization',
        pdf: 'CERTIFICATES/Infosys/Document from Kusuma(2).pdf'
      },
      {
        title: 'Introduction to NoSQL databases',
        issuer: 'Infosys Springboard',
        id: 'Issued Dec 10, 2025',
        skills: 'Document Stores • MongoDB • Key-Value Systems • Scalable Data Models',
        pdf: 'CERTIFICATES/Infosys/Document from Kusuma(3).pdf'
      },
      {
        title: 'Software Engineering and Agile Software Development',
        issuer: 'Infosys Springboard',
        id: 'Issued Dec 10, 2025',
        skills: 'Agile Methodologies • Scrum Workflows • SDLC • Quality Assurance',
        pdf: 'CERTIFICATES/Infosys/2025-12-12 17-50-01.pdf'
      }
    ]
  }
};

function initCertModal() {
  const modal = document.getElementById('cert-modal');
  const modalOverlay = document.getElementById('cert-modal-overlay');
  const modalCloseBtn = document.getElementById('cert-modal-close-btn');

  if (modalOverlay) modalOverlay.addEventListener('click', closeCertModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCertModal);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const isModalOpen = modal && modal.classList.contains('open');
    if (e.key === 'Escape' && isModalOpen) {
      closeCertModal();
    }
  });

  // Global openCertGroup function
  window.openCertGroup = function (groupId) {
    const group = CERTIFICATES_DATA[groupId];
    if (!group) return;

    const titleEl = document.getElementById('cert-modal-title');
    const subtitleEl = document.getElementById('cert-modal-subtitle');
    const badgeEl = document.getElementById('cert-modal-badge');
    const bodyEl = document.getElementById('cert-modal-body');

    if (titleEl) titleEl.textContent = group.title;
    if (subtitleEl) subtitleEl.textContent = group.subtitle;
    if (badgeEl) badgeEl.textContent = `${group.certificates.length} Certificate${group.certificates.length > 1 ? 's' : ''}`;

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="cert-gallery-grid">
          ${group.certificates.map((cert) => `
            <div class="cert-item-card">
              <div class="cert-doc-header">
                <div class="cert-doc-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <span class="cert-doc-format">PDF</span>
              </div>
              <div class="cert-item-info">
                <h4 class="cert-item-title">${cert.title}</h4>
                <span class="cert-item-issuer">${cert.issuer} • ${cert.id}</span>
                <p class="cert-item-skills">${cert.skills}</p>
                <div class="cert-item-actions">
                  <a href="${cert.pdf}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm btn-full">
                    <span>View PDF</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  function closeCertModal() {
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }
}

/* ==========================================
   9. NSS PHOTO LIGHTBOX SYSTEM
   ========================================== */
const NSS_PHOTOS_DATA = [
  {
    src: 'NSS/20241030_123042.jpg',
    title: 'Cleanliness Drive',
    desc: 'Participated in a community cleanliness drive promoting hygiene and a cleaner environment.'
  },
  {
    src: 'NSS/IMG_20260723_213233.jpg',
    title: 'Independence Day Rally',
    desc: 'Participated in an Independence Day rally as part of NSS activities promoting patriotism and social awareness.'
  },
  {
    src: 'NSS/IMG_20260723_213248.jpg',
    title: 'Independence Day Parade',
    desc: 'Participated in the Independence Day parade as an NSS volunteer.'
  },
  {
    src: 'NSS/IMG_20260820_181634.jpg',
    title: 'NSS Orientation Day',
    desc: 'An NSS orientation initiative to engage college students, spread awareness about NSS, and encourage them to join and serve the nation.'
  },
  {
    src: 'NSS/IMG_20260820_181700.jpg',
    title: 'Orphanage Visit',
    desc: 'Participated in an NSS visit to an orphanage, spending time with the children and contributing to community service.'
  },
  {
    src: 'NSS/IMG-20241104-WA0041.jpg',
    title: 'Swachh Bharat Abhiyan',
    desc: 'Participated in Swachh Bharat activities promoting cleanliness, hygiene, and community responsibility.'
  }
];

let currentNssIndex = 0;

function initNssLightbox() {
  const lightbox = document.getElementById('nss-lightbox');
  const overlay = document.getElementById('nss-lightbox-overlay');
  const closeBtn = document.getElementById('nss-lightbox-close-btn');
  const prevBtn = document.getElementById('nss-lightbox-prev-btn');
  const nextBtn = document.getElementById('nss-lightbox-next-btn');
  const counterEl = document.getElementById('nss-lightbox-counter');
  const imgEl = document.getElementById('nss-lightbox-img');
  const titleEl = document.getElementById('nss-lightbox-caption-title');
  const descEl = document.getElementById('nss-lightbox-caption-desc');

  if (overlay) overlay.addEventListener('click', closeNssLightbox);
  if (closeBtn) closeBtn.addEventListener('click', closeNssLightbox);

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrevNssPhoto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNextNssPhoto();
    });
  }

  // Keyboard Navigation: Esc, ArrowLeft, ArrowRight
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeNssLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrevNssPhoto();
    } else if (e.key === 'ArrowRight') {
      showNextNssPhoto();
    }
  });

  // Mobile Touch Swipe Gesture Support
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    }, { passive: true });
  }

  function handleSwipeGesture() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped left -> Next photo
      showNextNssPhoto();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped right -> Previous photo
      showPrevNssPhoto();
    }
  }

  window.openNssLightboxIndex = function (index) {
    if (index < 0 || index >= NSS_PHOTOS_DATA.length) index = 0;
    currentNssIndex = index;
    renderNssPhoto(currentNssIndex);
    if (lightbox) {
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  // Backwards compatibility if called with direct string
  window.openNssLightbox = function (imgSrc, titleText) {
    const foundIdx = NSS_PHOTOS_DATA.findIndex(p => p.src === imgSrc);
    if (foundIdx !== -1) {
      window.openNssLightboxIndex(foundIdx);
    } else {
      currentNssIndex = 0;
      if (imgEl) imgEl.src = imgSrc;
      if (titleEl) titleEl.textContent = titleText || 'NSS Activity';
      if (descEl) descEl.textContent = '';
      if (counterEl) counterEl.textContent = `1 of ${NSS_PHOTOS_DATA.length}`;
      if (lightbox) {
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }
  };

  function renderNssPhoto(index) {
    const photo = NSS_PHOTOS_DATA[index];
    if (!photo) return;

    if (imgEl) {
      imgEl.style.opacity = '0';
      setTimeout(() => {
        imgEl.src = photo.src;
        imgEl.alt = photo.title;
        imgEl.style.opacity = '1';
      }, 120);
    }

    if (counterEl) {
      counterEl.textContent = `${index + 1} of ${NSS_PHOTOS_DATA.length}`;
    }

    if (titleEl) {
      titleEl.textContent = photo.title;
    }

    if (descEl) {
      descEl.textContent = photo.desc || '';
      descEl.style.display = photo.desc ? 'block' : 'none';
    }
  }

  function showPrevNssPhoto() {
    currentNssIndex = (currentNssIndex - 1 + NSS_PHOTOS_DATA.length) % NSS_PHOTOS_DATA.length;
    renderNssPhoto(currentNssIndex);
  }

  function showNextNssPhoto() {
    currentNssIndex = (currentNssIndex + 1) % NSS_PHOTOS_DATA.length;
    renderNssPhoto(currentNssIndex);
  }

  function closeNssLightbox() {
    if (lightbox) {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }
}

/* ==========================================
   10. RESUME PREVIEW SYSTEM
   ========================================== */
function initResumePreview() {
  const resumeCard = document.getElementById('resume-preview-card');
  const fullscreenBtn = document.getElementById('btn-resume-fullscreen');
  if (!resumeCard || !fullscreenBtn) return;

  fullscreenBtn.addEventListener('click', () => {
    resumeCard.classList.toggle('is-fullscreen');
    const isFull = resumeCard.classList.contains('is-fullscreen');
    document.body.style.overflow = isFull ? 'hidden' : '';
    const textSpan = fullscreenBtn.querySelector('span');
    if (textSpan) {
      textSpan.textContent = isFull ? 'Exit' : 'Fullscreen';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeCard.classList.contains('is-fullscreen')) {
      resumeCard.classList.remove('is-fullscreen');
      document.body.style.overflow = '';
      const textSpan = fullscreenBtn.querySelector('span');
      if (textSpan) {
        textSpan.textContent = 'Fullscreen';
      }
    }
  });
}





