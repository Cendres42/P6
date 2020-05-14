const bcrypt = require('bcrypt');
//importation modèle mongoose
const Auth=require('../models/Auth');

//importation package pour générer des tokens
const jwt = require('jsonwebtoken');

//chiffrement du mot de passe utilisateur
exports.signup=(req, res, next)=>{
  //appel fonction de hachage de bcrypt qui va « saler » le mot de passe 10 fois
  bcrypt.hash(req.body.password, 10)
  //promise qui résolue et réussie crée un utilisateur, l'enregistre dans la bdd
    .then(hash =>{
      const auth = new Auth({
        authId: req.body.authId,
        email: req.body.email,
        password: hash
      });
      auth.save()
        .then(()=> res.status(200).json({message:'Utilisateur crée'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

exports.login =(req, res, next)=>{
  //utilisation modèle Mongoose pour vérifier si e-mail existant dans la bdd
  Auth.findOne({email: req.body.email})
    .then(auth => {
      if(!auth){
        return res.status(401).json({error: "Utilisateur non trouvé"});
      }
      //comparaison entre mot de passe entré et hash enregistré dans la bdd
      bcrypt.compare(req.body.password, auth.password)
        .then(valid=> {
          if(!valid){
            return res.status(401).json({error: "Mot de passe incorrect"});
          }
          //si identification valide, envoi ID utilisateur et un token
          res.status(200).json({
            authId: auth._id,
            //utilisation fonction sign de jwt pour générer un nouveau token
            token: jwt.sign(
              {authId:auth._id},
              //chaîne secrète de développement temporaire pour encoder token
              'RANDOM_TOKEN_SECRET',
              //durée de validité du token
              {expiresIn:'24h'}
            )
          });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};
