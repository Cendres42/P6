//importation package express
const express = require('express');
//importation package pour tranformation corps requête en objet JSON
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//importation package pour traiter les requêtes vers la route /image
const path = require('path')


//importation routeurs
const sauceRoutes=require('./routes/sauce');
const authRoutes = require('./routes/auth');

mongoose.connect('mongodb+srv://Cendres42:Gara42!!@cluster0-veqby.mongodb.net/Projet6?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//création appli qui appelle méthode express
const app = express();

//package pour éviter les injections
var mongoSanitize = require('express-mongo-sanitize');

//fonction pour tout type de requête (middleware)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  //appel prochain middleware
  next();
});

//middleware global application tranformant corps requête en objet JSON
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// enleve les caractères:
app.use(mongoSanitize());


//limitation taille requetes pour les securiser
app.use(express.urlencoded({ limit: "1kb" }));
app.use(express.json({ limit: "1kb" }));
//app.use(express.multipart({ limit:"10mb" }));
//app.use(express.limit("10kb"));

//gestionnaire de routage qui va gérer la ressource images de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// attribution d'une route: url visée par appli, end-point)
app.use ('/api/sauces', sauceRoutes);
app.use('/api/auth', authRoutes);

//exportation appli pour pouvoir l'appeler depuis autres fichiers dont serveur
module.exports = app;
