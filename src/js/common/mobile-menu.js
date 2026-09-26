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
    this.toggleButtons = document.querySelectorAll(
      '.mobile-menu-toggle[data-menu]'
    );

    if (this.toggleButtons.length === 0) return;

    this.submenus = document.querySelectorAll(
      '.mobile-submenu[data-submenu]'
    );

    this.arrows = document.querySelectorAll(
      '.mobile-menu-toggle .menu-arrow'
    );

    // Prepare smooth animation
    this.prepareSubmenus();

    // Open first menu by default
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

  // Prepare all submenus
  prepareSubmenus() {
    this.submenus.forEach((submenu) => {
      submenu.style.overflow = 'hidden';
      submenu.style.maxHeight = '0px';
      submenu.style.opacity = '0';
      submenu.style.transform = 'translateY(-6px)';

      submenu.style.transition =
        'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), ' +
        'opacity 0.25s ease, ' +
        'transform 0.25s ease';

      // Make sure animation works even if HTML has hidden/block
      submenu.classList.remove('hidden');
      submenu.classList.add('block');
    });
  }

  // Open only first menu
  setDefaultState() {
    this.submenus.forEach((submenu) => {
      submenu.style.maxHeight = '0px';
      submenu.style.opacity = '0';
      submenu.style.transform = 'translateY(-6px)';
    });

    this.arrows.forEach((arrow) => {
      arrow.classList.remove('rotate-90');
    });

    const firstSubmenu = this.submenus[0];
    const firstArrow = this.arrows[0];

    if (firstSubmenu) {
      this.openSubmenu(firstSubmenu);
    }

    if (firstArrow) {
      firstArrow.classList.add('rotate-90');
    }
  }

  // Smooth open
  openSubmenu(submenu) {
    submenu.style.maxHeight = submenu.scrollHeight + 'px';
    submenu.style.opacity = '1';
    submenu.style.transform = 'translateY(0)';
  }

  // Smooth close
  closeSubmenu(submenu) {
    submenu.style.maxHeight = '0px';
    submenu.style.opacity = '0';
    submenu.style.transform = 'translateY(-6px)';
  }

  // Accordion behavior
  toggleMenu(menuId) {
    const submenu = document.querySelector(
      `.mobile-submenu[data-submenu="${menuId}"]`
    );

    const button = document.querySelector(
      `.mobile-menu-toggle[data-menu="${menuId}"]`
    );

    const arrow = button?.querySelector('.menu-arrow');

    if (!submenu || !button) return;

    const isOpen =
      submenu.style.maxHeight !== '0px' &&
      submenu.style.maxHeight !== '';

    // Close every other submenu
    this.submenus.forEach((otherSubmenu) => {
      if (otherSubmenu !== submenu) {
        this.closeSubmenu(otherSubmenu);
      }
    });

    // Reset all arrows
    this.arrows.forEach((otherArrow) => {
      otherArrow.classList.remove('rotate-90');
    });

    // Close current menu
    if (isOpen) {
      this.closeSubmenu(submenu);
    }

    // Open current menu
    else {
      this.openSubmenu(submenu);

      if (arrow) {
        arrow.classList.add('rotate-90');
      }
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuExists = document.querySelector(
    '.mobile-menu-toggle[data-menu]'
  );

  if (mobileMenuExists) {
    window.mobileMenuAccordion = new MobileMenuAccordion();
  }
});