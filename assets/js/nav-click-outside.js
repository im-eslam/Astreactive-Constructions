export class NavClickOutside {
  constructor(menuElement, toggleElement) {
    this.navMenu = menuElement;
    this.navToggle = toggleElement;

    if (!this.navMenu || !this.navToggle) {
      console.warn('NavClickOutside: Menu or toggle element not found.');
      return;
    }
  }

  init() {
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(event) {
    if (!this.navMenu || !this.navToggle) {
      return;
    }

    const isMenuOpen = this.navMenu.classList.contains('show');
    const isClickInsideMenu = this.navMenu.contains(event.target);
    const isClickOnToggle = this.navToggle.contains(event.target);

    if (isMenuOpen && !isClickInsideMenu && !isClickOnToggle) {
      const bsCollapse = bootstrap.Collapse.getInstance(this.navMenu);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  }
}
