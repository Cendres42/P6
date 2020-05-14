//importation package mongoose
const mongoose = require ('mongoose');
//création schéma Mongoose utilisé pour le contenu des requêtes et des réponses
const sauceSchema=mongoose.Schema({
  //sauceId: sera généré par la bdd?! {type:String,required:true},
  name: {type:String, required:true},
  manufacturer:{type:String, required:true},
  description:{type:String,required:true},
  mainPepper:{type:String,required:true},
  imageUrl:{type:String, required:true},
  heat:{type:String,required:true},
  likes:{type:Number,required:false},
  dislikes:{type:Number,required:false},
  usersLiked:[{type:Array,default:[], required:false}],
  usersDisliked:[{type:Array,default:[], required:true}],
});
//exportation du modèle pour utilisation
module.exports= mongoose.model('Sauce', sauceSchema);
