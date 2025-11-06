class LanguageSwitcher {
  // --- Configuration Properties ---
  #supportedLangs = ['en', 'ar', 'ru'];
  #defaultLang = 'en';
  #currentLang;

  constructor() {
    this.#currentLang = this.#defaultLang;
  }

  // --- Public Methods ---
  async init() {
    this.#determineLanguage();
    await this.#loadTranslations();
    this.#bindEvents();
  }

  async changeLanguage(lang) {
    if (!this.#supportedLangs.includes(lang)) {
      console.warn(`Language '${lang}' not supported.`);
      return;
    }

    this.#currentLang = lang;
    localStorage.setItem('lang', lang);

    const url = new URL(window.location);
    if (lang === this.#defaultLang) {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    window.history.replaceState({}, '', url);

    await this.#loadTranslations();
    this.#closeDropdown();
  }

  // --- Private Helper Methods ---
  #bindEvents() {
    const langLinks = document.querySelectorAll('.lang-switcher .dropdown-item');
    langLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const newLang = link.getAttribute('data-lang');
        this.changeLanguage(newLang);
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
      const response = await fetch(`lang/${this.#currentLang}.json`);
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
        } else {
          console.warn(`No translation found for key: ${key}`);
        }
      });

      this.#applyRtlStyles();
    } catch (error) {
      console.error(error);
      if (this.#currentLang !== this.#defaultLang) {
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
      rtlStylesheet.removeAttribute('disabled');
    } else {
      htmlElement.setAttribute('lang', this.#currentLang);
      htmlElement.setAttribute('dir', 'ltr');
      rtlStylesheet.setAttribute('disabled', 'true');
    }
  }

  #closeDropdown() {
    const dropdownElement = document.getElementById('languageDropdown');
    if (dropdownElement) {
      const dropdown = window.bootstrap.Dropdown.getInstance(dropdownElement);
      if (dropdown) {
        dropdown.hide();
      }
    }
  }
}

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
  }

  async init() {
    await this.languageSwitcher.init();
    initLogoScrollers();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
