// Attendre que tout le document HTML soit chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------------
    // 1. MENU MOBILE (Burger Menu)
    // ---------------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Quand on clique sur l'icône du menu (bouton 3 lignes) sur téléphone
    menuToggle.addEventListener('click', () => {
        // Alterne la présence de la classe "active" (affiche/cache le menu)
        navMenu.classList.toggle('active');
    });

    // Fermer le menu si on clique sur un lien (sur mobile)
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });


    // ---------------------------------------------------------
    // 2. ANIMATION AU SCROLL (Apparition des éléments)
    // ---------------------------------------------------------
    // On sélectionne tous les éléments qui ont la classe 'fade-in'
    const fadeElements = document.querySelectorAll('.fade-in');

    // On utilise IntersectionObserver pour détecter quand l'élément entre dans l'écran
    const observerOptions = {
        root: null, // observe par rapport au viewport (l'écran)
        threshold: 0.15, // se déclenche quand 15% de l'élément est visible
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si l'élément est visible à l'écran
            if (entry.isIntersecting) {
                // On ajoute la classe 'visible' (voir CSS .fade-in.visible)
                entry.target.classList.add('visible');
                // On arrête d'observer cet élément une fois apparu (optionnel)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // On applique l'observateur à chaque élément ".fade-in"
    fadeElements.forEach(element => {
        scrollObserver.observe(element);
    });


    // ---------------------------------------------------------
    // 3. GESTION DU FORMULAIRE DE CONTACT (CONNECTÉ AU BACKEND)
    // ---------------------------------------------------------
    const contactForm = document.getElementById('contact-form');

    // On écoute l'événement "submit" (envoi) du formulaire
    if (contactForm) {
        // On ajoute le mot-clé "async" car on va utiliser "await" avec fetch
        contactForm.addEventListener('submit', async (event) => {
            // On empêche le rechargement de la page par défaut
            event.preventDefault();

            // On récupère le bouton pour changer son texte pendant l'envoi
            const submitButton = contactForm.querySelector('.btn-submit');
            const originalButtonText = submitButton.innerText;

            // Changement purement visuel pour l'utilisateur
            submitButton.innerText = 'Envoi en cours...';
            submitButton.disabled = true;

            // On récupère les valeurs entrées par l'utilisateur
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            try {
                // 1. Préparation des données à envoyer au format Objet JS
                const formData = {
                    name: name,
                    email: email,
                    message: message
                };

                // 2. Appel au serveur Node.js distant (API Fetch)
                const response = await fetch('https://portfolio-pro-st6f.onrender.com/api/contact', {
                    method: 'POST', // Le type de requête (Envoi de données)
                    headers: {
                        'Content-Type': 'application/json' // On indique qu'on parle en format JSON
                    },
                    body: JSON.stringify(formData) // On convertit notre objet JS en chaîne de caractères JSON
                });

                // 3. On attend que le serveur réponde et on extrait le JSON
                const result = await response.json();

                // 4. On gère le retour en fonction du succès ou non
                if (result.success) {
                    alert('Merci ! Votre message a bien été envoyé.');
                    contactForm.reset(); // On vide le formulaire
                } else {
                    alert('Désolé, une erreur est survenue : ' + result.message);
                }

            } catch (error) {
                // Ce bloc capte les erreurs majeures (ex: le serveur est éteint)
                console.error("Erreur de connexion au serveur :", error);
                alert("Impossible de contacter le serveur. Assurez-vous qu'il est bien démarré.");
            } finally {
                // Quoi qu'il arrive (succès ou échec), on remet le bouton à son état normal
                submitButton.innerText = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

});
