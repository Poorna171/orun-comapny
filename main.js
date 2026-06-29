// --- Global variables & state ---
let ready = false;

// --- DOM Elements ---
const loaderOverlay = document.getElementById('loader-overlay');
const mainContent = document.getElementById('main-content');
const body = document.body;

// --- Initialize Lenis Smooth Scroll ---
let lenis;
function initSmoothScroll() {
  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  });

  // Sync Lenis smooth scroll with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  function rafer(time) {
    lenis.raf(time);
    requestAnimationFrame(rafer);
  }
  requestAnimationFrame(rafer);
}

// --- Custom Cursor ---
function initCustomCursor() {
  const ring = document.getElementById('custom-cursor-ring');
  const dot = document.getElementById('custom-cursor-dot');

  const mq = window.matchMedia("(min-width: 1024px) and (hover: hover)");
  if (!mq.matches) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function tick() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;

    if (dot) dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// --- Loader Sequence ---
function initLoader() {
  const lettersCount = 4;
  let filled = 0;
  const filledImages = document.querySelectorAll('.loader-img-filled');

  function fillNextLetter() {
    if (filled < lettersCount) {
      filledImages[filled].classList.add('visible');
      filled++;
      setTimeout(fillNextLetter, 520);
    } else {
      // Invert stage
      setTimeout(() => {
        loaderOverlay.classList.add('dark-stage');
        filledImages.forEach(img => img.classList.add('hidden-stage'));

        // Out stage
        setTimeout(() => {
          gsap.to(loaderOverlay, {
            opacity: 0,
            duration: 0.85,
            ease: "power3.inOut",
            onComplete: () => {
              loaderOverlay.style.display = 'none';
              ready = true;
              revealMainContent();
            }
          });
        }, 750);
      }, 420);
    }
  }

  // Start filling letters after 300ms
  setTimeout(fillNextLetter, 300);
}

function revealMainContent() {
  mainContent.style.opacity = '1';
  initSmoothScroll();
  initCustomCursor();
  initClock();
  initBubbleLetters();
  initClientsCarousel();
  initStackedCards();
  initScrollAnimations();
  initFloatingContact();
  initContactForm();
}

// --- Analog Clock ---
function initClock() {
  const hourHand = document.getElementById('clock-hour');
  const minHand = document.getElementById('clock-min');
  const secHand = document.getElementById('clock-sec');

  const hourHandMob = document.getElementById('clock-hour-mob');
  const minHandMob = document.getElementById('clock-min-mob');
  const secHandMob = document.getElementById('clock-sec-mob');

  function updateClock() {
    const now = new Date();
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + ms / 1000;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;

    const secAngle = s * 6;
    const minAngle = m * 6;
    const hourAngle = h * 30;

    if (hourHand) hourHand.setAttribute('transform', `rotate(${hourAngle} 260 260)`);
    if (minHand) minHand.setAttribute('transform', `rotate(${minAngle} 260 260)`);
    if (secHand) secHand.setAttribute('transform', `rotate(${secAngle} 260 260)`);

    if (hourHandMob) hourHandMob.setAttribute('transform', `rotate(${hourAngle} 260 260)`);
    if (minHandMob) minHandMob.setAttribute('transform', `rotate(${minAngle} 260 260)`);
    if (secHandMob) secHandMob.setAttribute('transform', `rotate(${secAngle} 260 260)`);
  }

  setInterval(updateClock, 50);
}

// --- Bubble Letters Hero Animation ---
function initBubbleLetters() {
  const letters = document.querySelectorAll('.hero-title span');
  const mq = window.matchMedia("(min-width: 1024px) and (hover: hover)");
  if (!mq.matches) return;

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    letters.forEach(span => {
      const rect = span.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      const radius = 180;

      const scale = d < radius ? 1 + (1 - d / radius) * 0.55 : 1;
      span.style.transform = `scale(${scale})`;
    });
  });
}

// --- Clients Carousel (Swiper Auto-moving) ---
function initClientsCarousel() {
  new Swiper('.swiper', {
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 'auto',
    speed: 1000,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    coverflowEffect: {
      rotate: 25,
      stretch: 0,
      depth: 180,
      modifier: 1,
      slideShadows: false,
    },
    effect: 'coverflow',
  });
}

// --- Stacked Cards (Service Sticky Slide Effect) ---
function initStackedCards() {
  const cards = gsap.utils.toArray('.service-sticky-card');
  cards.forEach((card, index) => {
    // Only scale down cards that are stuck under subsequent cards
    if (index === cards.length - 1) return; // skip the last card

    gsap.to(card, {
      scale: 0.94 - (cards.length - 1 - index) * 0.02,
      opacity: 0.45,
      scrollTrigger: {
        trigger: cards[index + 1],
        start: "top 80%",
        end: "top 25%",
        scrub: true,
      }
    });
  });
}

// --- Scroll trigger parallax effects ---
function initScrollAnimations() {
  // Brand Statement Scroll animations (Translate Y and Fade text)
  const brandContent = document.querySelector('.brand-content');
  if (brandContent) {
    gsap.fromTo(brandContent,
      { y: 80, opacity: 0.3 },
      {
        y: -80,
        opacity: 1,
        scrollTrigger: {
          trigger: '.brand-section',
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
  }

  // AI Quote Fade-in trigger
  const quoteTitle = document.getElementById('quote-title');
  if (quoteTitle) {
    gsap.fromTo(quoteTitle,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.quote-section',
          start: "top 75%",
          once: true,
          onEnter: () => {
            quoteTitle.classList.add('visible');
          }
        }
      }
    );
  }
}

// --- Floating Contact Widget ---
function initFloatingContact() {
  const container = document.getElementById('floating-contact');
  const trigger = document.getElementById('floating-trigger');

  if (trigger && container) {
    trigger.addEventListener('click', () => {
      container.classList.toggle('open');
      const isOpen = container.classList.contains('open');
      trigger.setAttribute('aria-label', isOpen ? "Close contact" : "Open contact");
    });
  }
}

// --- Contact Form Submission ---
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = "SENDING...";
      submitBtn.disabled = true;

      // Note: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS dashboard credentials.
      // We are using the Public Key provided: 'service_6gpz3xq'.
      const serviceID = 'service_6gpz3xq';
      const templateID = 'template_xki0xld';
      const publicKey = 'mOy0-J6Ff3ygY9tAI';

      emailjs.sendForm(serviceID, templateID, form, publicKey)
        .then(() => {
          submitBtn.innerHTML = "THANK YOU — WE'LL BE IN TOUCH";
          submitBtn.style.backgroundColor = "var(--color-violet)";
          form.reset();
          submitBtn.disabled = false;

          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.backgroundColor = "";
          }, 4000);
        }, (error) => {
          console.error('EmailJS Error:', error);
          submitBtn.innerHTML = "ERROR — TRY AGAIN";
          submitBtn.style.backgroundColor = "#ff2b2b";
          submitBtn.disabled = false;

          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.backgroundColor = "";
          }, 4000);
        });
    });
  }
}

// --- Mobile Navigation Menu Toggle ---
const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    body.style.overflow = 'hidden';

    // Stagger links animation
    mobileLinks.forEach((link, i) => {
      link.style.transitionDelay = `${0.1 + i * 0.06}s`;
    });
  });
}

function closeMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
    body.style.overflow = '';

    mobileLinks.forEach(link => {
      link.style.transitionDelay = '0s';
    });
  }
}

if (closeMenu) {
  closeMenu.addEventListener('click', closeMobileMenu);
}

mobileLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// --- Initialize Loader on DOM load (Fix for module timing) ---
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoader);
} else {
  initLoader();
}
