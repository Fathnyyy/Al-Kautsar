// JavaScript untuk Animasi Navbar
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements with error checking
  const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
    
    // Check if essential elements exist
    if (!navbar) {
        console.error('Navbar element not found');
        return;
    }
    
    if (!mobileMenuBtn || !mobileMenu || !mobileMenuOverlay || !closeMobileMenuBtn) {
        console.warn('Mobile menu elements not found, mobile functionality disabled');
    }
    
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let isMobileMenuOpen = false;
    
    // Close mobile menu when clicking nav links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isMobileMenuOpen) {
                toggleMobileMenu();
            }
        });
    });

    // Throttle function for better performance
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Navbar scroll effect
  function handleScroll() {
        if (!navbar) return;
        
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scroll effect class when scrolled past 100px
        if (currentScrollY > 100) {
            navbar.classList.add('default-navbar-scroll');
    } else {
            navbar.classList.remove('default-navbar-scroll');
        }
        
        lastScrollY = currentScrollY;
    }

    // Throttled scroll handler
    const throttledScrollHandler = throttle(handleScroll, 10);

    // Mobile menu toggle
    function toggleMobileMenu() {
        if (!mobileMenuOverlay || !mobileMenu) return;
        
        if (!isMobileMenuOpen) {
            // Open mobile menu
            mobileMenuOverlay.classList.remove('hidden');
            setTimeout(() => {
                mobileMenu.classList.remove('translate-x-full');
            }, 10);
            isMobileMenuOpen = true;
            document.body.style.overflow = 'hidden';
        } else {
            // Close mobile menu
            mobileMenu.classList.add('translate-x-full');
            setTimeout(() => {
                mobileMenuOverlay.classList.add('hidden');
            }, 300);
            isMobileMenuOpen = false;
            document.body.style.overflow = '';
        }
    }

    // Event listeners
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Add mobile menu event listeners only if elements exist
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    if (closeMobileMenuBtn) {
        closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                toggleMobileMenu();
            }
        });
    }

    // Close mobile menu when pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMobileMenuOpen) {
            toggleMobileMenu();
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target && navbar) {
                // Calculate offset accounting for navbar height
                const navbarHeight = navbar.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                
                // Smooth scroll with better browser compatibility
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback for browsers that don't support smooth scroll
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = 800;
                    let start = null;
                    
                    function animation(currentTime) {
                        if (start === null) start = currentTime;
                        const timeElapsed = currentTime - start;
                        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                        window.scrollTo(0, run);
                        if (timeElapsed < duration) requestAnimationFrame(animation);
                    }
                    
                    function easeInOutQuad(t, b, c, d) {
                        t /= d/2;
                        if (t < 1) return c/2*t*t + b;
                        t--;
                        return -c/2 * (t*(t-2) - 1) + b;
                    }
                    
                    requestAnimationFrame(animation);
                }
                
                // Close mobile menu if open
                if (isMobileMenuOpen) {
                    toggleMobileMenu();
                }
            }
    });

    // Initialize scroll effect on page load with delay to ensure DOM is ready
      setTimeout(() => {
        handleScroll();
    }, 50);

    // Add loading animation to navbar with safety check
    if (navbar) {
        setTimeout(() => {
            if (navbar && navbar.style) {
                navbar.style.animationDelay = '0.2s';
            }
        }, 100);
    }
    
    // Ensure navbar is properly initialized on page load
    window.addEventListener('load', function() {
      setTimeout(() => {
            handleScroll();
        }, 100);
    });

    // Hero Image Slider
    const heroImage = document.getElementById('hero-image');
    if (heroImage) {
        const images = ['assets/Asrama1.png', 'assets/logo DU (2).png'];
        let currentIndex = 0;
        
        // Initial transition setup
        heroImage.style.transition = 'opacity 0.5s ease-in-out';

        setInterval(() => {
             // Fade out
            heroImage.style.opacity = '0';
            
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % images.length;
                heroImage.src = images[currentIndex];
                // Fade in
                heroImage.style.opacity = '1';
            }, 500); // Wait for fade out to complete (matches transition duration)
        }, 3000); // Change image every 3 seconds
    }
});

