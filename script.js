// Smooth scroll for anchor links (only for in-page anchors like #privacy, #terms)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Modal links (#privacy, #terms) use hash-based modal system - don't prevent default
        if (href === '#privacy' || href === '#terms') {
            return;
        }
        
        // For other hash links, check if target exists on current page before scrolling
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close mobile menu if open
            if (navMenu && hamburger) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Update aria-expanded for accessibility
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    });
}

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQs
        faqQuestions.forEach(q => {
            if (q !== question) {
                q.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Toggle current FAQ
        question.setAttribute('aria-expanded', !isExpanded);
    });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.about, .features, .requirements, .changelog, .guides, .faq, .purchase, .newsletter, .social-proof');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('scroll-reveal', 'revealed');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

// Newsletter Form Handler
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Simple validation
        if (email && email.includes('@')) {
            alert('Thank you for subscribing! We\'ll keep you updated on NeoArcadeX news.');
            newsletterForm.reset();
        } else {
            alert('Please enter a valid email address.');
        }
    });
}

// Modal Handlers
const modals = document.querySelectorAll('.modal');
const modalCloses = document.querySelectorAll('.modal-close');

// Close modal when clicking close button
modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        const modal = closeBtn.closest('.modal');
        if (modal) {
            window.location.hash = '';
            modal.setAttribute('aria-hidden', 'true');
        }
    });
});

// Close modal when clicking outside
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            window.location.hash = '';
            modal.setAttribute('aria-hidden', 'true');
        }
    });
});

// Handle modal visibility on hash change
window.addEventListener('hashchange', () => {
    modals.forEach(modal => {
        if (window.location.hash === `#${modal.id}`) {
            modal.setAttribute('aria-hidden', 'false');
        } else {
            modal.setAttribute('aria-hidden', 'true');
        }
    });
});

// ESC key to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            if (window.location.hash === `#${modal.id}`) {
                window.location.hash = '';
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    }
});

// Smooth reveal for cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards for animation
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.feature-card, .requirement-card, .guide-card, .changelog-entry, .testimonial-card, .stat-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});
// ============================================
// REVIEWS CAROUSEL FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const cards = document.querySelectorAll('.review-card');
    
    if (!track || !prevBtn || !nextBtn || !dotsContainer || cards.length === 0) {
        return; // Exit if carousel elements don't exist
    }
    
    let currentIndex = 0;
    let cardsPerView = window.innerWidth > 768 ? 2 : 1;
    const totalSlides = Math.ceil(cards.length / cardsPerView);
    let autoScrollInterval;
    
    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update dots
    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        const cardWidth = cards[0].offsetWidth;
        const gap = 32; // 2rem gap
        const offset = -(currentIndex * cardsPerView * (cardWidth + gap));
        track.style.transform = `translateX(${offset}px)`;
        updateDots();
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Auto scroll
    function startAutoScroll() {
        autoScrollInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoScroll();
        startAutoScroll();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoScroll();
        startAutoScroll();
    });
    
    // Pause on hover
    track.addEventListener('mouseenter', stopAutoScroll);
    track.addEventListener('mouseleave', startAutoScroll);
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newCardsPerView = window.innerWidth > 768 ? 2 : 1;
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                currentIndex = 0;
                createDots();
                goToSlide(0);
            }
        }, 250);
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoScroll();
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoScroll();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide();
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoScroll();
            startAutoScroll();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoScroll();
            startAutoScroll();
        }
    });
    
    // Initialize
    createDots();
    goToSlide(0);
    startAutoScroll();
});
