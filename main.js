/* ============================================================
   THEME TOGGLE
   ============================================================ */

const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

// Load saved theme on page load
if (localStorage.getItem('theme') === 'dark') {
  root.setAttribute('data-theme', 'dark');
}

// Click handler
themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';

  if (isDark) {
    root.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
});


/* ============================================================
   MOBILE MENU TOGGLE
   ============================================================ */

const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navToggleIcon = document.getElementById('navToggleIcon').querySelector('use');

let menuJustOpened = false;

navToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('is-open');

  if (isOpen) {
    mobileMenu.classList.remove('is-open');
    navToggleIcon.setAttribute('href', '#i-menu');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu'); // Accessibility fix
  } else {
    mobileMenu.classList.add('is-open');
    navToggleIcon.setAttribute('href', '#i-x');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu'); // Accessibility fix

    menuJustOpened = true;
    setTimeout(() => {
      menuJustOpened = false;
    }, 300);
  }
});


/* ============================================================
   CLOSE MENU IF WINDOW IS RESIZED TO DESKTOP
   ============================================================ */

const desktopQuery = window.matchMedia('(min-width: 1025px)');

desktopQuery.addEventListener('change', (e) => {
  if (e.matches) {
    mobileMenu.classList.remove('is-open');
    navToggleIcon.setAttribute('href', '#i-menu');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }
});


/* ============================================================
   CLOSE MENU WHEN A LINK IS CLICKED
   ============================================================ */

const mobileLinks = mobileMenu.querySelectorAll('a');

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    navToggleIcon.setAttribute('href', '#i-menu');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu'); // Accessibility fix
  });
});


/* ============================================================
   STICKY NAVBAR SHADOW + CLOSE MENU ON SCROLL
   ============================================================ */

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  // Toggle scrolled state for navbar shadow
  if (window.scrollY > 50) {
    navbar.classList.add('is-scrolled');
  } else {
    navbar.classList.remove('is-scrolled');
  }

  // Close mobile menu on scroll (unless just opened)
  if (mobileMenu.classList.contains('is-open') && !menuJustOpened) {
    mobileMenu.classList.remove('is-open');
    navToggleIcon.setAttribute('href', '#i-menu');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu'); // Accessibility fix
  }
});


/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */

const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach((el) => observer.observe(el));


/* ============================================================
   CLOSE MENU WHEN CLICKING OUTSIDE
   ============================================================ */

document.addEventListener('click', (e) => {
  const isMenuOpen = mobileMenu.classList.contains('is-open');
  const clickedInsideMenu = mobileMenu.contains(e.target);
  const clickedHamburger = navToggle.contains(e.target);

  if (isMenuOpen && !clickedInsideMenu && !clickedHamburger) {
    mobileMenu.classList.remove('is-open');
    navToggleIcon.setAttribute('href', '#i-menu');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu'); // Accessibility fix
  }
});


/* ============================================================
   CONTACT FORM (Web3Forms)
   ============================================================ */

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const formStatus = document.getElementById('formStatus');
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status small';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        formStatus.textContent = 'Thank you! Your message has been sent.';
        formStatus.classList.add('is-success');
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
        formStatus.classList.add('is-error');
      }
    } catch (error) {
      formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
      formStatus.classList.add('is-error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}


/* ============================================================
   SMART PORTFOLIO FILTERING & LOAD MORE
   ============================================================ */

const filterBar = document.querySelector('.filter-bar');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const projectsPerBatch = 3; // Show 3 at a time
let currentlyVisible = projectsPerBatch;

if (filterBar) {
  const allProjectCards = document.querySelectorAll('.card-grid--portfolio .project-card');
  const filterButtons = filterBar.querySelectorAll('.filter-btn');

  const updateGrid = () => {
    const activeBtn = filterBar.querySelector('.filter-btn.is-active');
    const filterValue = activeBtn ? activeBtn.textContent.trim() : 'All';
    
    let matchingCardsCount = 0;

    allProjectCards.forEach((card) => {
      const cardTag = card.querySelector('.tag').textContent.trim();
      const matchesFilter = (filterValue === 'All' || filterValue === cardTag);

      if (matchesFilter) {
        matchingCardsCount++;
        
        // Show the card if it's within the allowed limit
        if (matchingCardsCount <= currentlyVisible) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      } else {
        card.style.display = 'none';
      }
    });

    // SMART BUTTON LOGIC
    if (loadMoreBtn) {
      // Show button only if there are more matching cards than currently visible
      if (matchingCardsCount > currentlyVisible) {
        loadMoreBtn.style.display = 'inline-flex';
      } else {
        loadMoreBtn.style.display = 'none';
      }
    }
  };

  // Filter Button Click
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');
      currentlyVisible = projectsPerBatch; // Reset the view to 3
      updateGrid();
    });
  });

  // Load More Button Click
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentlyVisible += projectsPerBatch; // Reveal the next batch
      updateGrid();
    });
  }

  // Run on page load
  updateGrid();
}