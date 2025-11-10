import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

/* ============================== */
/* LOGO SCROLLER CLASS            */
/* ============================== */
class LogoScroller {
  constructor(selector) {
    this.scroller = document.querySelector(selector);
    if (!this.scroller) {
      console.warn(`LogoScroller: Element with selector "${selector}" not found.`);
      return;
    }

    this.scrollerInner = this.scroller.querySelector('.logo-scroller__inner');
    if (!this.scrollerInner) {
      console.warn(`LogoScroller: Inner element ".logo-scroller__inner" not found.`);
      return;
    }
  }

  init() {
    if (!this.scroller || !this.scrollerInner) return;
    if (!this.scroller.hasAttribute('data-animated')) return;

    this.#duplicateLogos();
    this.#applyDirectionClass();
  }

  #duplicateLogos() {
    const scrollerContent = Array.from(this.scrollerInner.children);

    for (let i = 0; i < 25; i++) {
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        duplicatedItem.setAttribute('aria-hidden', true);
        this.scrollerInner.appendChild(duplicatedItem);
      });
    }
  }

  #applyDirectionClass() {
    const dir = document.documentElement.getAttribute('dir');
    const isRTL = dir === 'rtl';

    this.scroller.classList.remove('logo-scroller--rtl', 'logo-scroller--ltr');

    if (isRTL) {
      this.scroller.classList.add('logo-scroller--rtl');
    } else {
      this.scroller.classList.add('logo-scroller--ltr');
    }
  }

  updateDirection() {
    this.#applyDirectionClass();
  }
}

/* ============================== */
/* PROJECTS SLIDER CLASS          */
/* ============================== */
class ProjectSlider {
  constructor(selector) {
    this.selector = selector;
    this.swiper = null;
  }

  init() {
    const swiperEl = document.querySelector(this.selector);
    if (!swiperEl) {
      return;
    }

    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }

    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

    this.swiper = new Swiper(this.selector, {
      rtl: isRTL,
      loop: true,

      slidesPerView: 1.1,
      spaceBetween: 20,

      centeredSlides: true,

      breakpoints: {
        // Small tablets (576px)
        576: {
          slidesPerView: 2,
          spaceBetween: 20,
          centeredSlides: false, 
        },
        // Large tablets (992px)
        992: {
          slidesPerView: 3,
          spaceBetween: 30,
          centeredSlides: false,
        },
      },

      pagination: {
        el: '.project-pagination',
        clickable: true,
      },

      navigation: {
        nextEl: isRTL ? '.project-nav-prev' : '.project-nav-next',
        prevEl: isRTL ? '.project-nav-next' : '.project-nav-prev',
      },
    });
  }

  reinit() {
    this.init();
  }

  destroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }
}

/* ============================== */
/* APP INITIALIZATION             */
/* ============================== */
function initComponents() {
  // 1. Initialize Logo Scroller
  const logoScroller = new LogoScroller('.logo-scroller');
  logoScroller.init();
  window.logoScroller = logoScroller;

  // 2. Initialize Project Slider
  const projectSlider = new ProjectSlider('#project-swiper-main');
  projectSlider.init();

  // 3. Listen for custom 'languageChanged' event
  document.addEventListener('languageChanged', () => {
    console.log('Language changed, re-initializing sliders.');
    if (projectSlider) {
      projectSlider.reinit();
    }
    if (logoScroller) {
      logoScroller.updateDirection();
    }
  });
}

// "wait for content-loaded" logic
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('content-loaded')) {
    initComponents();
  } else {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('content-loaded')) {
          initComponents();
          observer.disconnect();
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }
});
