/*
 * This file IMPORTS Swiper from the CDN.
 */
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export class ProjectSlider {
  constructor(selector) {
    this.selector = selector;
    this.swiper = null;
  }

  init() {
    const swiperEl = document.querySelector(this.selector);
    if (!swiperEl) {
      return; // Do nothing if element not found
    }

    // Destroy existing instance if it exists
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }

    this.swiper = new Swiper(this.selector, {
      // Force LTR direction to prevent reversal on language change
      rtl: false,

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
        nextEl: '.project-nav-next',
        prevEl: '.project-nav-prev',
      },
    });
  }

  // FIXED: Added reinit method
  reinit() {
    this.init();
  }

  // Optional: Add destroy method for cleanup
  destroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }
}
