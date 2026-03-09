// Importation des modules nécessaires
require('dotenv').config(); // Charge les variables du fichier .env
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Initialisation de l'application Express
const app = express();
// Définition du port (par défaut 3000, ou celui défini dans le fichier .env)
const PORT = process.env.PORT || 3000;

// === MIDDLEWARES ===
// Active CORS pour autoriser les requêtes provenant d'autres origines
// (nécessaire car le front-end et le back-end ne tournent souvent pas sur la même URL en développement)
app.use(cors());

// Permet à Express de lire le corps des requêtes en format JSON (envoyées par fetch)
app.use(express.json());


// === CONFIGURATION DE L'ENVOI D'EMAIL (Nodemailer) ===
const transporter = nodemailer.createTransport({
    // Exemple avec Gmail. Pour d'autres services, la configuration peut varier.
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Récupéré depuis le fichier .env
        pass: process.env.EMAIL_PASS  // Récupéré depuis le fichier .env
    }
});


// === ROUTES ===

// 1. Route de test simple pour vérifier que le serveur tourne correctement
app.get('/', (req, res) => {
    res.send("Le serveur API du portfolio est en ligne !");
});

// 2. Route POST pour recevoir les données du formulaire de contact
app.post('/api/contact', async (req, res) => {
    try {
        // Extraction des données contenues dans le corps (body) de la requête
        const { name, email, message } = req.body;

        // Validation basique : on vérifie que les 3 champs sont la
        if (!name || !email || !message) {
            // On retourne une erreur statut 400 (Bad Request)
            return res.status(400).json({ 
                success: false, 
                message: "Veuillez remplir tous les champs du formulaire." 
            });
        }

        // Configuration du contenu de l'email
        const mailOptions = {
            from: process.env.EMAIL_USER,          // Qui envoie (le serveur/vous)
            to: process.env.EMAIL_TO,              // Qui reçoit (vous)
            subject: `Portfolio : Nouveau message de ${name}`, // L'objet de l'email
            // Version texte brute (fallback)
            text: `
                Nouveau message depuis le portfolio !
                
                Nom : ${name}
                Email : ${email}
                Message :
                ${message}
            `,
            // Version HTML (plus jolie dans le client mail)
            html: `
                <h3>Nouveau message de contact</h3>
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Message :</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        };

        // Envoi de l'email avec Nodemailer en utilisant 'await' car c'est asynchrone
        await transporter.sendMail(mailOptions);

        // Si on arrive ici, l'envoi a réussi ! On répond au front-end.
        res.status(200).json({ 
            success: true, 
            message: "Votre message a été envoyé avec succès !" 
        });

    } catch (error) {
        // Si une erreur se produit (ex: mot de passe .env incorrect, problème réseau)
        console.error("Erreur lors de l'envoi de l'email :", error);
        
        // On retourne une erreur statut 500 (Internal Server Error) au front
        res.status(500).json({ 
            success: false, 
            message: "Une erreur interne s'est produite lors de l'envoi du message." 
        });
    }
});


// === DÉMARRAGE DU SERVEUR ===
app.listen(PORT, () => {
    console.log(`📡 Serveur démarré avec succès sur http://localhost:${PORT}`);
});
