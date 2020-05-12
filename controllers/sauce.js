//importation modèle mongoose
const sauce = require('../models/Sauce');
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
      fs.unlink(`images/${filename}`, () =>{
        //suppression sauce
        Sauce.deleteOne({_id: req.params.id})
           .then(() => res.status(200).json({message:'Objet supprimé!'}))
           .catch(error => res.status(400).json({error}));
      });
    })
    .catch(error => res.status(500).json({error}));
};

//mise à jour des informations d'une sauce
///////////////////////////////////////////////////
/////////////////////////////////////////////////
exports.modifySauce=(req, res, next)=>{
  const SauceObject= req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }: {...req.body};
  Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id:req.params.id})
    .then(() => res.status(200).json({message:'Objet modifié!'}))
    .catch(error => res.status(400).json({error}));
}

//////////////////////////////////////////////////////
///////////////////////////////////////////
exports.createSauce =(req,res,next)=>{
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  //création instance modèle Sauce en lui passant un objet JavaScript
  const sauce = new Sauce({
    //opérateur spread utilisé pour faire une copie de tous éléments de req.body
  ...sauceObject,
  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //enregistrement enregistre sauce dans la base de données; renvoie une promise
  sauce.save()
  //réponse de réussite
  .then(()=> res.status(201).json({message:"Objet enregistré!"}))
  //réponse d'erreurs
  .catch(error => res.status(400).json({error}));
}
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////

exports.likeSauce=(req,res,next)=>{

}
