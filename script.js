document.addEventListener('DOMContentLoaded', () => {

    // 1. MENU MOBILE
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // 2. ANIMATION AU SCROLL
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // 3. FORMULAIRE DE CONTACT
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = contactForm.querySelector('.btn-submit');
            const originalButtonText = submitButton.innerText;
            submitButton.innerText = 'Envoi en cours...';
            submitButton.disabled = true;

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            try {
                const formData = { name, email, message };

                const response = await fetch('https://portfolio-pro-st6f.onrender.com/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    alert('Merci ! Votre message a bien été envoyé.');
                    contactForm.reset();
                } else {
                    alert('Désolé, une erreur est survenue : ' + result.message);
                }
            } catch (error) {
                console.error("Erreur de connexion au serveur :", error);
                alert("Impossible de contacter le serveur.");
            } finally {
                submitButton.innerText = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    // 4. TOOLTIPS
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            badges.forEach(b => {
                if (b !== badge) b.classList.remove('active-tooltip');
            });
            badge.classList.toggle('active-tooltip');
        });
    });

    document.addEventListener('click', () => {
        badges.forEach(badge => badge.classList.remove('active-tooltip'));
    });

});