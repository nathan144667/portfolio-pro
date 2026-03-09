require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({
    origin: 'https://nathan144667.github.io'
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Le serveur API du portfolio est en ligne !");
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Veuillez remplir tous les champs du formulaire."
            });
        }

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'nathan.cottais@gmail.com',
            subject: `Portfolio : Nouveau message de ${name}`,
            html: `
                <h3>Nouveau message de contact</h3>
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Message :</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        res.status(200).json({
            success: true,
            message: "Votre message a été envoyé avec succès !"
        });

    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
        res.status(500).json({
            success: false,
            message: "Une erreur interne s'est produite."
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});