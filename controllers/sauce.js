//importation modèle mongoose
const Sauce = require('../models/Sauce');
//"file system": accès aux fonctions permettant modification système de fichiers
const fs = require('fs');

const cst = require('../constante');

const jwt = require('jsonwebtoken');

const validator =require('validator');

//récupération de la liste de sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
}

//récupération d'une sauce à partir de son identifiant
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
      const filename = sauce.imageUrl.split('/images/')[1];
      //suppression image avec fonction unlike du package fs
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
  if((typeof sauceObject.name == 'undefined')||
    (!validator.isAlphanumeric(sauceObject.name, 'fr-FR'))) {
      res.status(500).json({message:"Nom invalide"});
      return;
    }
  if((typeof sauceObject.manufacturer == 'undefined')||
  (!validator.isAlphanumeric(sauceObject.manufacturer, 'fr-FR'))){
    res.status(500).json({message:"Manufacturer invalide"});
    return;
  }
  let description = sauceObject.description.replace(/ /g, "");
  if((typeof sauceObject.description == 'undefined')||
     (!validator.isAlphanumeric(description, 'fr-FR'))) {
       res.status(500).json({message:"Description invalide"});
       return;
     }
  if((typeof sauceObject.mainPepper == 'undefined')||
     (!validator.isAlphanumeric(sauceObject.mainPepper, 'fr-FR'))){
    res.status(500).json({message:"Ingrédient invalide"});
    return;
  }
  Sauce.updateOne({_id: req.params.id}, {...sauceObject,_id:req.params.id})
    .then(() => res.status(200).json({message:'Objet modifié!'}))
    .catch(error => res.status(400).json({error}));
}

exports.createSauce =(req,res,next)=>{
    if((typeof req.body.sauce == 'undefined')||
    (!validator.isJSON(req.body.sauce))){
      res.status(500).json({message:"Veuillez vérifier votre saisie"});
      return;
    }
    //"traduction" requête en JSON pour utilisation
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    // Recuperation de l'id de l'utilisateur qui cree la sauce
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, cst.random);
    const userId = decodedToken.userId;
    if((typeof sauceObject.name == 'undefined')||
      (!validator.isAlphanumeric(sauceObject.name, 'fr-FR'))) {
        res.status(500).json({message:"Nom invalide"});
        return;
      }
    if((typeof sauceObject.manufacturer == 'undefined')||
    (!validator.isAlphanumeric(sauceObject.manufacturer, 'fr-FR'))){
      res.status(500).json({message:"Manufacturer invalide"});
      return;
    }
    description = sauceObject.description.replace(/ /g, "");
    if((typeof sauceObject.description == 'undefined')||
       (!validator.isAlphanumeric(description, 'fr-FR'))){
         res.status(500).json({message:"Description invalide"});
         return;
     }
    if((typeof sauceObject.mainPepper == 'undefined')||
       (!validator.isAlphanumeric(sauceObject.mainPepper, 'fr-FR'))){
      res.status(500).json({message:"Ingrédient invalide"});
      return;
    }
    //création instance modèle Sauce en lui passant un objet JavaScript
    const sauce = new Sauce({
      name:sauceObject.name ,
      manufacturer:sauceObject.manufacturer,
      description: sauceObject.description,
      mainPepper: sauceObject.mainPepper,
      heat:sauceObject.heat,
      //construction url image
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      userId:    userId,
      likes:     0,
      dislikes:  0,
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


exports.likeSauce=(req,res,next)=>{
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, cst.random);
      const userId = decodedToken.userId;
      console.log(userId);
      console.log(sauce);
      if (req.body.like==1){
        if (!sauce.usersLiked.includes(userId)){
          sauce.likes += 1;
          sauce.usersLiked.push(userId);
          sauce.save();
        }
      }
      else if (req.body.like==-1) {
        if (!sauce.usersDisliked.includes(userId)){
          sauce.dislikes += 1;
          sauce.usersDisliked.push(userId);
          sauce.save();
          console.log(sauce);
        }
      }
      else if (req.body.like==0){
        // Parcours le tableau des utilisateurs qui ont "dislike"
        for (let i = 0; i < sauce.usersDisliked.length; i++) {
          // Si le i-eme utilisateur n'est pas celui recherche: rien a faire
          if (sauce.usersDisliked[i] != userId)
            continue;
            // Suppression de l'utilisateur qui dislike
            console.log("Supprime dislike " + userId + "(index " +i+")");
            sauce.usersDisliked.splice(i, 1);
            sauce.dislikes-=1;
        }
       for (let i = 0; i < sauce.usersLiked.length; i++) {
         // Si le i-eme utilisateur n'est pas celui recherche: rien a faire
          if (sauce.usersLiked[i] != userId)
          continue;
          // Suppression de l'utilisateur qui like
          console.log("Supprime like " + userId + "(index " +i+")");
          sauce.usersLiked.splice(i, 1);
          sauce.likes-=1;
        }
        sauce.save();
      }
      res.status(200).json({likes: sauce.likes, dislikes: sauce.dislikes, message:"Like enregistré!"});
  })
    .catch(error => res.status(500).json({error}));
}
