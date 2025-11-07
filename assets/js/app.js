import { LanguageSwitcher } from './lang-switcher.js';
import { NavClickOutside } from './nav-click-outside.js';
import { ProjectSlider } from './project-slider.js';

function initLogoScrollers() {
  const scrollers = document.querySelectorAll('.logo-scroller');

  if (!scrollers.length) return;

  scrollers.forEach((scroller) => {
    const scrollerInner = scroller.querySelector('.logo-scroller__inner');
    if (!scrollerInner) return;

    const scrollerContent = Array.from(scrollerInner.children);

    // Duplicate all logos and add them to the list
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute('aria-hidden', true);
      scrollerInner.appendChild(duplicatedItem);
    });

    // Set a custom property for the gap
    const gap = getComputedStyle(scrollerInner).gap || '3rem';
    scrollerInner.style.setProperty('--_gap', gap);
  });
}

class App {
  constructor() {
    this.languageSwitcher = new LanguageSwitcher();

    this.projectSlider = new ProjectSlider('#project-swiper-main');

    const navMenu = document.getElementById('main-nav');
    const navToggle = document.querySelector('.navbar-toggler');
    this.navClickHandler = new NavClickOutside(navMenu, navToggle);
  }

  async init() {
    await this.languageSwitcher.init();
    this.navClickHandler.init();
    this.projectSlider.init();
    initLogoScrollers();
    this._bindGlobalEvents();
  }

  _bindGlobalEvents() {
    document.addEventListener('languageChanged', () => {
      this.projectSlider.reinit();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
