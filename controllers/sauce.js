//importation modèle mongoose
const Sauce = require('../models/Sauce');
//"file system": accès aux fonctions permettant modification système de fichiers
const fs = require('fs');

//récupération de la liste de sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
}

//récupération d'une sauce à aprtir de son identifiant
exports.getOneSauce = (req, res, next)=>{
  Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
}

// suppression d'une sauce et de l'image associée
exports.deleteSauce =(req, res, next)=>{
  //trouve la sauce à supprimer à partir de son id
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      //suppression image sauce
      const filename = sauce.imageUrl.split('/images/')[1];
      //suppression sauce avec fonction unlike du package fs
      fs.unlink(`images/${filename}`, () =>{
        //fichier à supprimer et callback à exécuter quand fichier supprimé
        Sauce.deleteOne({_id: req.params.id})
           .then(() => res.status(200).json({message:'Objet supprimé!'}))
           .catch(error => res.status(400).json({error}));
      });
    })
    .catch(error => res.status(500).json({error}));
};

//mise à jour des informations d'une sauce
exports.modifySauce=(req, res, next)=>{
  //vérification existance de req.file
  const sauceObject= req.file ?
  //si fichier trouvé
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }:
  // si fichier non trouvé
  {...req.body};
  Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id:req.params.id})
    .then(() => res.status(200).json({message:'Objet modifié!'}))
    .catch(error => res.status(400).json({error}));
}

//////////////////////////////////////////////////////
///////////////////////////////////////////
exports.createSauce =(req,res,next)=>{
  //"traduction" requête en JSON pour utilisation
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  //création instance modèle Sauce en lui passant un objet JavaScript
  const sauce = new Sauce({
    //opérateur spread utilisé pour faire une copie de tous éléments de req.body
  ...sauceObject,
  //construction url image
  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  likes: 0,
  dislikes:0,
  usersLiked:[],
  usersDisliked:[]
  });
  //enregistrement sauce dans la base de données; renvoie une promise
  sauce.save()
  //réponse de réussite
  .then(()=> res.status(201).json({message:"Objet enregistré!"}))
  //réponse d'erreurs
  .catch(error => res.status(400).json({error}));
}
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////

exports.likeSauce=(req,res,next)=>{
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      console.log(req.body.like);
      if (req.body.like==1){
        sauce.likes += 1;
        sauce.usersLiked.push(req.body.userId);
        sauce.save();
        }
      else if (req.body.like==-1) {
        sauce.dislikes += 1;
        sauce.usersDisliked.push(req.body.userId);
          }
      else if (req.body.like==0){
        //sauce.saucesDisliked.delete(req.body.userId);
        //sauce.saucesLiked.delete(req.body.userId);
        sauce.likes-=1;
        sauce.save();
      }
      res.status(200).json({likes: sauce.likes, message:"Like enregistré!"});
  })
    .catch(error => res.status(500).json({error}));
}
