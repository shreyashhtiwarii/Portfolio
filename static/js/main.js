document.addEventListener('DOMContentLoaded', () => {
    // 1. Typed.js Initialization
    const typed = new Typed('#typewriter', {
        strings: ['Web Applications.', 'Interactive Experiences.', '3D Interfaces.', 'Full Stack Solutions.'],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true
    });

    // 2. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    const revealElements = document.querySelectorAll(".gs_reveal");
    
    revealElements.forEach((elem, i) => {
        let x = 0, y = 50;

        if (elem.classList.contains("gs_reveal_fromLeft")) {
            x = -100;
            y = 0;
        } else if (elem.classList.contains("gs_reveal_fromRight")) {
            x = 100;
            y = 0;
        } else if (elem.classList.contains("gs_reveal_fromBottom")) {
            x = 0;
            y = 100;
        }

        gsap.fromTo(elem, 
            { autoAlpha: 0, x: x, y: y }, 
            {
                duration: 1, 
                autoAlpha: 1, 
                x: 0, 
                y: 0, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%", // when top of element hits 85% of viewport
                    end: "bottom 20%", // when bottom of elem hits 20% of viewport
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Navbar blur on scroll
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 10px 30px -10px rgba(2, 12, 27, 0.7)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });

    // 3. Form Submission via AJAX
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = contactForm.querySelector('.submit-btn');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable button, show loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                formMessage.textContent = result.message;
                formMessage.className = 'form-message success';
                contactForm.reset();
            } else {
                throw new Error('Something went wrong.');
            }
        } catch (error) {
            formMessage.textContent = 'Failed to send message. Please try again.';
            formMessage.className = 'form-message error';
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Clear message after 5 seconds
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
        }
    });
});
