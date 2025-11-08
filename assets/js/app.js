import { LanguageSwitcher } from './lang-switcher.js';
import { NavClickOutside } from './nav-click-outside.js';
import { ProjectSlider } from './project-slider.js';
import { LogoScroller } from './logo-scroller.js';

class App {
  constructor() {
    this.languageSwitcher = new LanguageSwitcher();
    this.projectSlider = new ProjectSlider('#project-swiper-main');
    this.logoScroller = new LogoScroller('.logo-scroller');
    const navMenu = document.getElementById('main-nav');
    const navToggle = document.querySelector('.navbar-toggler');
    this.navClickHandler = new NavClickOutside(navMenu, navToggle);
  }

  async init() {
    await this.languageSwitcher.init();
    this.navClickHandler.init();
    this.projectSlider.init();
    this.logoScroller.init();
    this._bindGlobalEvents();
  }

  _bindGlobalEvents() {
    document.addEventListener('languageChanged', () => {
      if (this.projectSlider) {
        this.projectSlider.reinit();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
