class MobileMenuAccordion {
  constructor() {
    this.toggleButtons = null;
    this.submenus = null;
    this.arrows = null;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.bindEvents());
    } else {
      this.bindEvents();
    }
  }

  bindEvents() {
    this.toggleButtons = document.querySelectorAll('.mobile-menu-toggle[data-menu]');

    if (this.toggleButtons.length === 0) return;

    this.submenus = document.querySelectorAll('.mobile-submenu[data-submenu]');
    this.arrows = document.querySelectorAll('.mobile-menu-toggle .menu-arrow');

    // ✅ Make ALL menus open by default
    this.setDefaultState();

    this.toggleButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const menuId = button.getAttribute('data-menu');
        this.toggleMenu(menuId);
      });
    });
  }

  // ✅ Open ALL menus by default
  setDefaultState() {
    this.submenus.forEach((submenu) => {
      submenu.classList.remove('hidden');
      submenu.classList.add('block');
    });

    this.arrows.forEach((arrow) => {
      arrow.classList.add('rotate-90');
    });
  }

  // ✅ Toggle independently (NO accordion behavior)
  toggleMenu(menuId) {
    const submenu = document.querySelector(`.mobile-submenu[data-submenu="${menuId}"]`);
    const button = document.querySelector(`.mobile-menu-toggle[data-menu="${menuId}"]`);
    const arrow = button?.querySelector('.menu-arrow');

    if (!submenu || !button) return;

    const isOpen = submenu.classList.contains('block');

    if (isOpen) {
      submenu.classList.add('hidden');
      submenu.classList.remove('block');
      if (arrow) arrow.classList.remove('rotate-90');
    } else {
      submenu.classList.remove('hidden');
      submenu.classList.add('block');
      if (arrow) arrow.classList.add('rotate-90');
    }
  }
}

// ✅ Initialize
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuExists = document.querySelector('.mobile-menu-toggle[data-menu]');

  if (mobileMenuExists) {
    window.mobileMenuAccordion = new MobileMenuAccordion();
  }
});