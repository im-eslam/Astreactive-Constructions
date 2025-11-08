import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export class ProjectSlider {
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
      slidesPerView: 1,
      spaceBetween: 20,

      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 30,
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
