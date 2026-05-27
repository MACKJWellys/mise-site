/* ============================================
   MISE — Main JavaScript
   Lenis smooth scroll, GSAP animations,
   mobile menu, sticky CTA, platform bar
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- DYNAMIC YEAR ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- PRELOADER ----------
  const preloader = document.querySelector('.preloader');
  const preloaderLogo = document.querySelector('.preloader__logo');

  if (preloader && preloaderLogo) {
    gsap.fromTo(preloaderLogo,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
    );

    window.addEventListener('load', () => {
      gsap.to(preloaderLogo, {
        opacity: 0,
        scale: 1.1,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          preloader.classList.add('is-hidden');
          initAnimations();
        }
      });
    });

    setTimeout(() => {
      if (!preloader.classList.contains('is-hidden')) {
        preloader.classList.add('is-hidden');
        initAnimations();
      }
    }, 3000);
  }

  // ---------- LENIS SMOOTH SCROLL ----------
  let lenis;
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof gsap !== 'undefined' && gsap.ticker) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);
    }
  } catch (e) {
    console.log('Lenis not available, using native scroll');
  }

  // ---------- SMOOTH ANCHOR SCROLLING ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -80 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ---------- NAVIGATION ----------
  const nav = document.getElementById('nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('is-open');
      hamburger.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', !isOpen);
      mobileMenu.setAttribute('aria-hidden', isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';

      if (!isOpen) {
        const links = mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');
        links.forEach((link, i) => {
          link.style.transitionDelay = `${0.1 + i * 0.08}s`;
        });
      } else {
        const links = mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');
        links.forEach(link => link.style.transitionDelay = '0s');
      }
    });

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- STICKY MOBILE CTA ----------
  const stickyCta = document.getElementById('sticky-cta');
  const heroSection = document.querySelector('.hero');

  if (stickyCta && heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stickyCta.classList.add('is-visible');
        } else {
          stickyCta.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(heroSection);
  }

  // ---------- SCROLL TO TOP ----------
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > window.innerHeight) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // ---------- GSAP ANIMATIONS ----------
  function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const heroTitle = document.querySelectorAll('.hero__title-line');
    const heroBadge = document.querySelector('.hero__badge');
    const heroSubtitle = document.querySelector('.hero__subtitle');
    const heroCtas = document.querySelector('.hero__ctas');

    const heroTl = gsap.timeline({ delay: 0.2 });

    if (heroBadge) {
      heroTl.fromTo(heroBadge,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }

    heroTitle.forEach((line, i) => {
      heroTl.fromTo(line,
        { opacity: 0, y: 60, clipPath: 'inset(0 0 100% 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.out' },
        `-=${0.5}`
      );
    });

    if (heroSubtitle) {
      heroTl.fromTo(heroSubtitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );
    }

    if (heroCtas) {
      heroTl.fromTo(heroCtas,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.2'
      );
    }

    // Section entrances
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      const labels = section.querySelectorAll('.section-label');
      const titles = section.querySelectorAll('.section-title');
      const subtitles = section.querySelectorAll('.section-subtitle');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true
        }
      });

      labels.forEach(el => {
        tl.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0);
      });

      titles.forEach(el => {
        tl.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.1);
      });

      subtitles.forEach(el => {
        tl.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.3);
      });
    });

    // Platform bar links stagger
    const platformLinks = document.querySelectorAll('.platform-bar__link');
    if (platformLinks.length) {
      gsap.fromTo(platformLinks,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.platform-bar',
            start: 'top 90%',
            once: true
          }
        }
      );
    }

    // About section image
    const aboutImage = document.querySelector('.about__image-wrap');
    if (aboutImage) {
      gsap.fromTo(aboutImage,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: aboutImage,
            start: 'top 85%',
            once: true
          }
        }
      );
    }

    // About credentials stagger
    const credentials = document.querySelectorAll('.about__credential');
    if (credentials.length) {
      gsap.fromTo(credentials,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about__credentials',
            start: 'top 85%',
            once: true
          }
        }
      );
    }

    // Gallery cards stagger
    const galleryCards = document.querySelectorAll('.gallery__card');
    if (galleryCards.length && document.querySelector('.gallery__grid')) {
      gsap.fromTo(galleryCards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.gallery__grid',
            start: 'top 85%',
            once: true
          }
        }
      );
    }

    // Music embed
    const musicEmbed = document.querySelector('.music-embed__player');
    if (musicEmbed) {
      gsap.fromTo(musicEmbed,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: musicEmbed,
            start: 'top 85%',
            once: true
          }
        }
      );
    }

    // CTA section
    const ctaSection = document.querySelector('.cta-section__inner');
    if (ctaSection) {
      gsap.fromTo(ctaSection,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaSection,
            start: 'top 85%',
            once: true
          }
        }
      );
    }
  }

  if (!preloader) {
    initAnimations();
  }
});
