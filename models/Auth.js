//importation package mongoose
const mongoose = require ('mongoose');
//importation package uniqueValidator pour éviter doublons
const uniqueValidator = require ('mongoose-unique-validator');

//création schéma Mongoose utilisé pour le contenu des requêtes et des réponses
const authSchema = mongoose.Schema({
  //authId sera généré par la bdd
  email: {type:String, required: true, unique: true},
  password: {type: String, required: true}
});

//le compte doit être unique, pas de doublons dans les données
authSchema.plugin(uniqueValidator);

//exportation du modèle pour utilisation
module.exports = mongoose.model('Auth',authSchema);
