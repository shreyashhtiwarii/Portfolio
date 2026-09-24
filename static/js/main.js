document.addEventListener('DOMContentLoaded', () => {
    // 1. Typed.js Initialization
    const typewriterElem = document.getElementById('typewriter');
    if (typewriterElem && window.Typed) {
        new Typed('#typewriter', {
            strings: [
                'Data Analytics & Insights.',
                'Interactive Dashboards.',
                'Predictive ML Models.',
                'Creative Web Applications.'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2200,
            loop: true
        });
    }

    // 2. GSAP Animations
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        const revealElements = document.querySelectorAll(".gs_reveal");
        revealElements.forEach((elem) => {
            let x = 0, y = 40;

            if (elem.classList.contains("gs_reveal_fromLeft")) {
                x = -80;
                y = 0;
            } else if (elem.classList.contains("gs_reveal_fromRight")) {
                x = 80;
                y = 0;
            } else if (elem.classList.contains("gs_reveal_fromBottom")) {
                x = 0;
                y = 80;
            }

            gsap.fromTo(elem, 
                { autoAlpha: 0, x: x, y: y }, 
                {
                    duration: 0.9, 
                    autoAlpha: 1, 
                    x: 0, 
                    y: 0, 
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 88%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }

    // 3. Navbar Styling, Scroll Indicator Fade & Scroll-to-Top Button
    const nav = document.querySelector('.glass-nav');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const scrollTopBtn = document.getElementById('scroll-to-top');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Navbar shadow
        if (scrollY > 50) {
            nav.style.boxShadow = '0 10px 30px -10px rgba(2, 12, 27, 0.8)';
            nav.style.borderBottomColor = 'rgba(100, 255, 218, 0.25)';
        } else {
            nav.style.boxShadow = 'none';
            nav.style.borderBottomColor = 'rgba(100, 255, 218, 0.15)';
        }

        // Fade out hero scroll indicator
        if (scrollIndicator) {
            if (scrollY > 80) {
                scrollIndicator.classList.add('fade-out');
            } else {
                scrollIndicator.classList.remove('fade-out');
            }
        }

        // Scroll to top button visibility
        if (scrollTopBtn) {
            if (scrollY > 350) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }

        // ScrollSpy (Active nav link)
        let currentSectionId = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach((link) => {
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial run

    // Scroll to Top Click
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. Mobile Hamburger Menu
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-menu-overlay .resume-btn');

    const toggleMobileMenu = (open) => {
        const shouldOpen = open !== undefined ? open : !hamburgerBtn.classList.contains('is-active');
        if (shouldOpen) {
            hamburgerBtn.classList.add('is-active');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            mobileMenu.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        } else {
            hamburgerBtn.classList.remove('is-active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('is-open');
            document.body.style.overflow = '';
        }
    };

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => toggleMobileMenu());

        mobileLinks.forEach((link) => {
            link.addEventListener('click', () => toggleMobileMenu(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                toggleMobileMenu(false);
            }
        });
    }

    // 5. Contact Form Submission (Supports both Netlify Forms & Local Flask Server)
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = contactForm ? contactForm.querySelector('.submit-btn') : null;
    const submitBtnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const spinner = submitBtn ? submitBtn.querySelector('.spinner') : null;

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Set loading state
            if (submitBtn) submitBtn.disabled = true;
            if (spinner) spinner.style.display = 'inline-block';
            if (submitBtnText) submitBtnText.textContent = 'Sending...';

            formMessage.style.display = 'none';
            formMessage.className = 'form-message';

            const formData = new FormData(contactForm);
            
            // Encode as URLSearchParams for standard Netlify Forms compatibility
            const urlEncodedData = new URLSearchParams(formData).toString();

            // Decide endpoint:
            // If running on Flask localhost, /contact is the Flask route.
            // If running on Netlify (or other static host), / is the Netlify Forms endpoint.
            const isLocalFlask = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
            const endpoint = isLocalFlask ? '/contact' : '/';

            try {
                let response;
                if (isLocalFlask) {
                    response = await fetch(endpoint, {
                        method: 'POST',
                        body: formData
                    });
                } else {
                    response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: urlEncodedData
                    });
                }

                let responseData = null;
                try {
                    responseData = await response.json();
                } catch (_) {
                    // Not JSON response
                }

                if (response.ok) {
                    const successText = (responseData && responseData.message)
                        ? responseData.message
                        : 'Thank you! Your message has been sent successfully.';

                    formMessage.textContent = successText;
                    formMessage.className = 'form-message success';
                    formMessage.style.display = 'block';
                    contactForm.reset();
                } else {
                    const errorMsg = (responseData && responseData.message)
                        ? responseData.message
                        : `Submission failed (${response.status}). Please try again or reach out via direct email!`;
                    throw new Error(errorMsg);
                }
            } catch (err) {
                console.error('Contact Form error:', err);
                formMessage.textContent = err.message || 'Failed to send message. Please reach out via direct email!';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                if (spinner) spinner.style.display = 'none';
                if (submitBtnText) submitBtnText.textContent = 'Send Message';

                // Auto-clear message after 6 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 6000);
            }
        });
    }
});
