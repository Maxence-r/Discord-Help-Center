// Import librairies
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Import routes

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


app.get('/', (req, res) => {
    res.render('../views/index');
});


module.exports = app;

