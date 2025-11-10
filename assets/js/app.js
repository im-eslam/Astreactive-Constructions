// ============================
// LANGUAGE SWITCHER CLASS
// ============================
class LanguageSwitcher {
  #supportedLangs = ['en', 'ar', 'ru'];
  #defaultLang = 'en';
  #currentLang;

  constructor() {
    this.#currentLang = this.#defaultLang;
  }

  async init() {
    this.#determineLanguage();
    await this.#loadTranslations();
    this.#bindEvents();
  }

  #bindEvents() {
    const langLinks = document.querySelectorAll('.lang-switcher__option');

    langLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const newLang = link.getAttribute('data-lang');

        localStorage.setItem('lang', newLang);

        const url = new URL(window.location);

        if (newLang === this.#defaultLang) {
          url.searchParams.delete('lang');
        } else {
          url.searchParams.set('lang', newLang);
        }

        url.hash = '';

        window.location.href = url.toString();
      });
    });
  }

  #determineLanguage() {
    const lang = this.#getLangFromURL() || this.#getLangFromStorage() || this.#getLangFromBrowser() || this.#defaultLang;
    this.#currentLang = lang;
    localStorage.setItem('lang', this.#currentLang);
  }

  #getLangFromURL() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    return lang && this.#supportedLangs.includes(lang) ? lang : null;
  }

  #getLangFromStorage() {
    const lang = localStorage.getItem('lang');
    return lang && this.#supportedLangs.includes(lang) ? lang : null;
  }

  #getLangFromBrowser() {
    const lang = navigator.language.split('-')[0];
    return this.#supportedLangs.includes(lang) ? lang : null;
  }

  async #loadTranslations() {
    try {
      const response = await fetch(`assets/lang/${this.#currentLang}.json`);
      if (!response.ok) {
        throw new Error(`Could not load language file: ${this.#currentLang}.json`);
      }

      const translations = await response.json();
      const elements = document.querySelectorAll('[data-lang-key]');

      elements.forEach((el) => {
        const key = el.getAttribute('data-lang-key');
        const translation = key.split('.').reduce((obj, k) => {
          return obj && obj[k];
        }, translations);

        if (translation) {
          if (el.tagName === 'META') {
            el.setAttribute('content', translation);
          } else if (el.tagName === 'BUTTON') {
            el.setAttribute('aria-label', translation);
          } else {
            el.textContent = translation;
          }
        }
      });

      this.#applyRtlStyles();

      document.body.style.visibility = 'visible';
      document.body.style.opacity = 1;

      document.body.classList.add('content-loaded');
    } catch (error) {
      console.error('Translation loading error:', error);
      if (this.#currentLang !== this.#defaultLang) {
        console.log(`Falling back to default language: ${this.#defaultLang}`);
        this.#currentLang = this.#defaultLang;
        await this.#loadTranslations();
      }
    }
  }

  #applyRtlStyles() {
    const htmlElement = document.documentElement;
    const rtlStylesheet = document.getElementById('rtl-stylesheet');

    if (this.#currentLang === 'ar') {
      htmlElement.setAttribute('lang', 'ar');
      htmlElement.setAttribute('dir', 'rtl');
      if (rtlStylesheet) {
        rtlStylesheet.removeAttribute('disabled');
      }
    } else {
      htmlElement.setAttribute('lang', this.#currentLang);
      htmlElement.setAttribute('dir', 'ltr');
      if (rtlStylesheet) {
        rtlStylesheet.setAttribute('disabled', 'true');
      }
    }
  }
}

// ============================
// HEADER CLASS
// ============================
class Header {
  _isScrolling = false;

  constructor(headerSelector, navMenuSelector, navToggleSelector) {
    this.header = document.querySelector(headerSelector);
    this.navMenu = document.getElementById(navMenuSelector);
    this.navToggle = document.querySelector(navToggleSelector);

    this.ctaButton = document.getElementById('header-cta');

    if (!this.header || !this.navMenu || !this.navToggle) {
      console.warn('Header component: One or more elements not found.');
      return;
    }
  }

  init() {
    if (!this.header) return;

    this._bindScrollEvent();
    this._bindClickOutsideEvent();
    this._bindCtaClick(); 
  }

  _bindCtaClick() {
    if (!this.ctaButton) return;

    this.ctaButton.addEventListener('click', () => {
      const isMenuOpen = this.navMenu.classList.contains('show');

      if (isMenuOpen) {
        this.navToggle.click();
      }
    });
  }

  _bindScrollEvent() {
    const shrinkThreshold = 50;

    const handleScroll = () => {
      if (this._isScrolling) return;

      this._isScrolling = true;

      requestAnimationFrame(() => {
        if (window.scrollY > shrinkThreshold) {
          this.header.classList.add('header--shrunk');
        } else {
          this.header.classList.remove('header--shrunk');
        }

        this._isScrolling = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  _bindClickOutsideEvent() {
    document.addEventListener('click', (event) => {
      const isMenuOpen = this.navMenu.classList.contains('show');
      const isClickInsideHeader = this.header.contains(event.target);

      if (isMenuOpen && !isClickInsideHeader) {
        this.navToggle.click();
      }
    });
  }
}

// ============================
// APP INITIALIZATION
// ============================
document.addEventListener('DOMContentLoaded', async () => {
  const languageSwitcher = new LanguageSwitcher();
  await languageSwitcher.init();

  const header = new Header('.header', 'main-nav', '.navbar-toggler');
  header.init();
});
