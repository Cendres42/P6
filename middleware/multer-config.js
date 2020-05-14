const multer = require("multer");

//création middleware pour gérer les images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//constante qui contient la logique pour indiquer où enregistrer les fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    //indique d'utiliser le nom d'origine, de remplacer les espaces par des _
    const name= file.originalname.split(' ').join('_');
    //résout l'extension de fichier appropriée
    const extension = MIME_TYPES[file.mimetype];
    //ajout timestamp Date.now() pour rendre nom unique
    callback(null, name + Date.now() + '.' + extension);
  }
});

//exportation élément configuré avec constante storage, ne télécharge qu'images
module.exports = multer({storage}).single('image');
