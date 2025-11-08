export class LogoScroller {
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

    document.addEventListener('languageChanged', () => {
      this.#updateDirectionClass();
    });
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
    const dir = document.documentElement.dir || document.documentElement.lang;
    const isRTL = dir === 'rtl' || dir.startsWith('ar') || dir.startsWith('he');

    if (isRTL) {
      this.scroller.classList.add('logo-scroller--rtl');
    } else {
      this.scroller.classList.add('logo-scroller--ltr');
    }
  }

  #updateDirectionClass() {
    this.scroller.classList.remove('logo-scroller--rtl', 'logo-scroller--ltr');
    this.#applyDirectionClass();
  }
}
