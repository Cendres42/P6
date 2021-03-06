const bcrypt = require('bcrypt');
//importation modèle mongoose
const User=require('../models/User');

const cst=require('../constante')
//importation package pour générer des tokens
const jwt = require('jsonwebtoken');
const validator =require('validator');

//chiffrement du mot de passe utilisateur
exports.signup=(req, res, next)=>{
  if((typeof req.body.email == 'undefined')||
     (!validator.isEmail(req.body.email))){
    res.status(500).json({message:"Veuillez entrer un email valide"});
    return;
  }
  if((typeof req.body.password == 'undefined')||
     (!validator.isAscii(req.body.password))){
    res.status(500).json({message:"Veuillez entrer un mot de passe valide"});
    return;
  }
  //appel fonction de hachage de bcrypt qui va « saler » le mot de passe 10 fois
  bcrypt.hash(req.body.password, 10)
  //promise qui résolue et réussie crée un utilisateur, l'enregistre dans la bdd
    .then(hash =>{
      const user = new User({
        userId: req.body.userId,
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(()=> res.status(200).json({message:'Utilisateur crée'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

exports.login =(req, res, next)=>{
  if((typeof req.body.email == 'undefined')||
     (!validator.isEmail(req.body.email))){
    res.status(500).json({message:"Veuillez entrer un email valide"});
    return;
  }
  if((typeof req.body.password == 'undefined')||
     (!validator.isAscii(req.body.password)))
  {
    res.status(500).json({message:"Veuillez entrer un mot de passe valide"});
    return;
  }
  //utilisation modèle Mongoose pour vérifier si e-mail existant dans la bdd
  User.findOne({email: req.body.email})
    .then(user => {
      if(!user){
        return res.status(401).json({error: "Utilisateur non trouvé"});
      }
      //comparaison entre mot de passe entré et hash enregistré dans la bdd
      bcrypt.compare(req.body.password, user.password)
        .then(valid=> {
          if(!valid){
            return res.status(401).json({error: "Mot de passe incorrect"});
          }
          //si identification valide, envoi ID utilisateur et un token
          res.status(200).json({
            userId: user._id,
            //utilisation fonction sign de jwt pour générer un nouveau token
            token: jwt.sign(
              {userId:user._id},
              //chaîne secrète de développement temporaire pour encoder token
              cst.random,
              //durée de validité du token
              {expiresIn:'24h'}
            )
          });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};
