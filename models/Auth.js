//importation package mongoose
const mongoose = require ('mongoose');
//importation package uniqueValidator pour éviter doublons
const uniqueValidator = require ('mongoose-unique-validator');

//création schéma Mongoose utilisé pour le contenu des requêtes et des réponses
const authSchema = mongoose.Schema({
  //authId sera généré par la bdd
  //valeur unique s'assurera qu'aucun des deux utilisateurs n'a le même mail
  email: {type:String, required: true, unique: true},
  password: {type: String, required: true}
});

//élément mongoose-unique-validator passé comme plug-in
authSchema.plugin(uniqueValidator);

//exportation du modèle pour utilisation
module.exports = mongoose.model('Auth',authSchema);
