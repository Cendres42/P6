const express = require('express');
//création router avec méthode Router d'Express, remplace "app" dans les routes    e
const router = express.Router();
//importation middleware de protection des routes
const auth = require('../middleware/auth');
//importation controlleur contenant le détail des routes
const sauceCtrl = require('../controllers/sauce');
//package pour gérer les fichiers entrants dans les requêtes HTTP
const multer = require('../middleware/multer-config');

//logiques de routes pour la partie sauce de l'application
router.post  ('/',    auth, multer, sauceCtrl.createSauce);
router.delete('/:id',  auth, sauceCtrl.deleteSauce);
router.put   ('/:id', auth, multer, sauceCtrl.modifySauce);
router.get   ('/:id', auth, sauceCtrl.getOneSauce);
router.get   ('/',    auth, sauceCtrl.getAllSauces);
router.post  ('/:id/like', auth, sauceCtrl.likeSauce);
//exportation router pour utilisation ext.
module.exports = router;
