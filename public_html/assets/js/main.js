// ==================== GALLERY FUNCTIONALITY ====================
// Simple gallery with hover effects only - no lightbox

// Ensure body can scroll on page load
document.addEventListener('DOMContentLoaded', function() {
  document.body.style.overflow = 'visible';
  document.body.style.overflowX = 'hidden';
  document.body.style.overflowY = 'auto';
});

function initializeGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  // Add hover effects and animations
  galleryItems.forEach((item, index) => {
    // Initialize animation state - make visible immediately for testing
    item.style.opacity = '1';
    item.style.transform = 'translateY(0)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    item.style.transitionDelay = `${index * 0.1}s`;
    
    // Add hover z-index management
    item.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
    });
  });
}

// ==================== GALLERY CAROUSEL (Side-by-side with arrows) ====================
function setupGalleryCarousel() {
  const viewport = document.querySelector('.gallery-viewport');
  const track = document.querySelector('.gallery-track');
  const cards = document.querySelectorAll('.gallery-card');
  const left = document.querySelector('.gallery-arrow-left');
  const right = document.querySelector('.gallery-arrow-right');

  if (!viewport || !track || cards.length === 0 || !left || !right) return;

  let index = 0;
  let step = 0; // pixel amount to move per index
  let visible = 1; // how many cards fit in viewport

  function computeMetrics() {
    const first = cards[0];
    const firstRect = first.getBoundingClientRect();
    const styles = window.getComputedStyle(track);
    // gap may be reported as '20px' or '0px 20px'; try gap then columnGap
    const gapStr = styles.gap || styles.columnGap || '0px';
    const gap = parseFloat((gapStr.split(' ')[0] || '0').replace('px','')) || 0;
    step = firstRect.width + gap;
    visible = Math.max(1, Math.floor(viewport.clientWidth / step));
    // clamp index
    const maxIndex = Math.max(0, cards.length - visible);
    if (index > maxIndex) index = maxIndex;
    apply();
    updateButtons();
  }

  function apply() {
    const translateX = -(index * step);
    track.style.transform = `translateX(${translateX}px)`;
  }

  function maxIndex() {
    return Math.max(0, cards.length - visible);
  }

  function updateButtons() {
    left.disabled = index <= 0;
    right.disabled = index >= maxIndex();
  }

  left.addEventListener('click', () => {
    if (index > 0) {
      index -= 1;
      apply();
      updateButtons();
    }
  });

  right.addEventListener('click', () => {
    if (index < maxIndex()) {
      index += 1;
      apply();
      updateButtons();
    }
  });

  window.addEventListener('resize', () => {
    // slight debounce
    clearTimeout(window.__galleryRszT);
    window.__galleryRszT = setTimeout(computeMetrics, 100);
  });

  // init
  computeMetrics();
}

document.addEventListener('DOMContentLoaded', setupGalleryCarousel);

// ==================== GALLERY SCROLL ANIMATIONS ====================
function animateGalleryOnScroll() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }
  });
}

// ==================== GALLERY LAZY LOADING ====================
function initializeLazyLoading() {
  const galleryImages = document.querySelectorAll('.gallery-item img');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        img.onload = () => {
          img.style.opacity = '1';
        };
        
        observer.unobserve(img);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  galleryImages.forEach(img => {
    imageObserver.observe(img);
  });
}

// ==================== INITIALIZE GALLERY ====================
document.addEventListener('DOMContentLoaded', function() {
  initializeGallery();
  initializeLazyLoading();
});

// Gallery animations will be handled by unified scroll handler below
// window.addEventListener('scroll', animateGalleryOnScroll);
window.addEventListener('load', animateGalleryOnScroll);

// ==================== WORD SPLIT + SCROLL ANIMATION ====================
function splitWordsForAnimation() {
  const para = document.querySelector('.scroll-fade-words');
  if (!para) return; // Guard
  const words = para.innerText.trim().split(/\s+/);
  para.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');
}
splitWordsForAnimation();

function animateWordsOnScroll() {
  const section = document.querySelector('.about-section');
  const words = document.querySelectorAll('.scroll-fade-words span');
  if (!section || words.length === 0) return; // Guard

  const sectionTop = section.getBoundingClientRect().top;
  const viewportHeight = window.innerHeight;

  // Adjust triggers based on viewport
  const startTrigger = viewportHeight * 0.9;
  const endTrigger = viewportHeight * 0.3;

  let progress = 1 - (sectionTop - endTrigger) / (startTrigger - endTrigger);
  progress = Math.max(0, Math.min(1, progress));

  const startColor = [167, 163, 156]; // Ashlite
  const endColor = [37, 37, 37];      // Nero
  const color = `rgb(${startColor.map((start, i) => Math.round(start + (endColor[i] - start) * progress)).join(',')})`;

  words.forEach((word, i) => {
    const rect = word.getBoundingClientRect();
    const isVisible = rect.top < viewportHeight && rect.bottom > 0;

    if (isVisible) {
      requestAnimationFrame(() => { // smoother than setTimeout on scroll
        word.classList.add('visible');
        word.style.color = color;
      });
    }
  });
}

// Word animations will be handled by unified scroll handler below
// window.addEventListener('scroll', animateWordsOnScroll);
window.addEventListener('load', animateWordsOnScroll);

// ==================== HAMBURGER MENU ====================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mainContent = document.getElementById('mainContent');

// Create backdrop element
const backdrop = document.createElement('div');
backdrop.className = 'menu-backdrop';
document.body.appendChild(backdrop);

let isMenuOpen = false;

function openMenu() {
  if (isMenuOpen) return;
  isMenuOpen = true;
  
  // Just add classes - DON'T change body position
  document.body.classList.add('menu-open');
  
  requestAnimationFrame(() => {
    backdrop.classList.add('active');
    mainContent.classList.add('shift');
    hamburger.classList.add('active');
    
    setTimeout(() => {
      mobileMenu.classList.add('active');
    }, 10);
  });
  
  mobileMenu.setAttribute('aria-hidden', 'false');
}

function closeMenu() {
  if (!isMenuOpen) return;
  isMenuOpen = false;
  
  // Just remove classes - DON'T change body position
  mobileMenu.classList.remove('active');
  backdrop.classList.remove('active');
  mainContent.classList.remove('shift');
  hamburger.classList.remove('active');
  document.body.classList.remove('menu-open');
  
  mobileMenu.setAttribute('aria-hidden', 'true');
}

if (hamburger && mobileMenu && mainContent) {
  hamburger.addEventListener('click', () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking backdrop
  backdrop.addEventListener('click', closeMenu);

  // Close menu when clicking a link
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// ==================== SCROLL TO TOP BUTTON ====================
// Create scroll to top button dynamically
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.id = 'scrollTopBtn';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollToTopBtn);

// Handle scroll behavior - show/hide hamburger and scroll button
function handleScrollBehavior() {
  const scrollPosition = window.scrollY || window.pageYOffset;
  const hamburgerBtn = document.getElementById('hamburger');
  const scrollBtn = document.getElementById('scrollTopBtn');
  
  if (scrollPosition > 300) {
    // User has scrolled down - HIDE hamburger, SHOW scroll button
    if (hamburgerBtn) {
      hamburgerBtn.classList.add('hide-on-scroll');
    }
    if (scrollBtn) {
      scrollBtn.classList.add('show-on-scroll');
    }
  } else {
    // User is at top - SHOW hamburger, HIDE scroll button
    if (hamburgerBtn) {
      hamburgerBtn.classList.remove('hide-on-scroll');
    }
    if (scrollBtn) {
      scrollBtn.classList.remove('show-on-scroll');
    }
  }
}

// Optimized scroll listener with requestAnimationFrame for smooth performance
// UNIFIED SCROLL HANDLER - critical functions run every frame, heavy ones throttled
let ticking = false;
let lastHeavyAnimationTime = 0;
const HEAVY_ANIMATION_THROTTLE = 150; // Run heavy animations every 150ms

window.addEventListener('scroll', function() {
  if (!ticking) {
    window.requestAnimationFrame(function() {
      const now = Date.now();
      
      // Run critical functions every frame (smooth)
      handleScrollBehavior();
      revealOnScroll();
      
      // Run heavy animations only every 150ms (throttled for smoothness)
      if (now - lastHeavyAnimationTime > HEAVY_ANIMATION_THROTTLE) {
        animateGalleryOnScroll();
        animateWordsOnScroll();
        lastHeavyAnimationTime = now;
      }
      
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Run immediately on page load
document.addEventListener('DOMContentLoaded', handleScrollBehavior);
window.addEventListener('load', handleScrollBehavior);

// Scroll to top when button is clicked
scrollToTopBtn.addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ==================== AWARDS CAROUSEL ====================
const carousel = document.querySelector('.awards-carousel');
const cards = document.querySelectorAll('.award-card');
const leftBtn = document.querySelector('.awards-arrow-left');
const rightBtn = document.querySelector('.awards-arrow-right');
let currentIndex = 0;

function isMobile() {
  return window.innerWidth <= 700;
}

function showCard(index) {
  if (isMobile()) {
    // On mobile, only show the active card, no transform
    carousel.style.transform = 'none';
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  } else {
    // On desktop, show all cards, no active class
    carousel.style.transform = 'none';
    cards.forEach(card => card.classList.remove('active'));
  }
}

if (carousel && leftBtn && rightBtn && cards.length) {
  leftBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    showCard(currentIndex);
  });

  rightBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length;
    showCard(currentIndex);
  });

  // Show first card on load
  showCard(currentIndex);
  // Update on resize
  window.addEventListener('resize', () => {
    showCard(currentIndex);
  });
}

// ==================== SCROLL REVEAL ANIMATIONS ====================
function revealOnScroll() {
  const reveals = document.querySelectorAll('.scroll-reveal');
  
  reveals.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('revealed');
    }
  });
}

// Reveal animations will be handled by unified scroll handler below
// window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ==================== PARALLAX EFFECT FOR HERO ====================
// Disabled to prevent hero staying in background
// window.addEventListener('scroll', () => {
//   const scrolled = window.pageYOffset;
//   const parallaxElements = document.querySelectorAll('.hero');
//   
//   parallaxElements.forEach(element => {
//     const speed = 0.5;
//     element.style.transform = `translateY(${scrolled * speed}px)`;
//   });
// });

// ==================== ENHANCED CARD INTERACTIONS ====================
// Exclude .award-card to remove hover behaviors from Awards section
const interactiveCards = document.querySelectorAll('.feature-card, .benefit-card, .team-section .card');

interactiveCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.zIndex = '10';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.zIndex = '1';
  });
});

// ==================== SOCIAL ICONS ANIMATION ====================
const socialIcons = document.querySelectorAll('.socials a');

socialIcons.forEach((icon, index) => {
  icon.style.animationDelay = `${index * 0.1}s`;
  
  icon.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.2) rotate(5deg)';
  });
  
  icon.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1) rotate(0deg)';
  });
});

// ==================== INTERSECTION OBSERVER FOR SECTIONS ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all major sections
const sections = document.querySelectorAll('section');
sections.forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  sectionObserver.observe(section);
});

// Don't animate hero section
const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroSection.style.opacity = '1';
  heroSection.style.transform = 'translateY(0)';
}

// ==================== LOADING ANIMATION ====================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// ==================== CONTACT FORM (Optional) ====================
// Uncomment and configure your endpoint if needed
/*
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
      name: this.name.value,
      email: this.email.value,
      message: this.message.value,
      phone: this.phone.value,
      company: this.company.value
    };

    fetch('YOUR_GOOGLE_SCRIPT_URL_HERE', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(() => {
      alert('Message sent successfully!');
      this.reset();
    })
    .catch(err => {
      console.error('Error:', err);
      alert('There was a problem sending your message.');
    });
  });
}
*/
