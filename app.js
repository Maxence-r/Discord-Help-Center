// Import librairies
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Import routes
const DiscordLogin = require('./routes/DiscordLogin');
// Definition des outils
app.use(cookieParser());
app.use(express.json());
app.use(express.static('./views'));

// Connexion à la base de données
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/support-center', 
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


app.use('/api/discord', DiscordLogin);

app.get('/', (req, res) => {
    console.log(req.cookies.token);
    if (!req.cookies.token) {
        res.redirect('https://discord.com/api/oauth2/authorize?client_id=839526461349822485&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fdiscord&response_type=code&scope=identify%20guilds%20email');
    } else {
        res.sendFile(__dirname + '/views/main.html');
    }
});


module.exports = app;

