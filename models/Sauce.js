//importation package mongoose
const mongoose = require ('mongoose');
//création schéma Mongoose utilisé pour le contenu des requêtes et des réponses
const sauceSchema=mongoose.Schema({
  //sauceId: sera généré par la bdd
  name:       {type:String, required:true},
  manufacturer:{type:String, required:true},
  description:{type:String, required:true},
  mainPepper: {type:String, required:true},
  imageUrl:   {type:String, required:true},
  heat:       {type:String, required:true},
  userId:     {type:String, required:true}, // User qui a cree la sauce
  likes:      {type:Number, required:false},
  dislikes:   {type:Number, required:false},
  usersLiked:[{type:String, required:false}],
  usersDisliked:[{type:String, required:false}],
});
//exportation du modèle pour utilisation
module.exports= mongoose.model('Sauce', sauceSchema);
