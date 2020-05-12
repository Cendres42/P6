//logiques de routes pour la partie sauce de l'application
const express = require('express');
//création router avec méthode Router d'Express, remplace "app" dans les routes    e
const router = express.Router();
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config');
router.post('/',auth, multer, sauceCtrl.createSauce);
router.delete('/:id',auth, sauceCtrl.deleteSauce);
router.put('/:id',auth, multer, sauceCtrl.modifySauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);

//exportation router pour utilisation ext.
module.exports = router;
