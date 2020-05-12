const bcrypt = require('bcrypt');
//importation modèle mongoose
const Auth=require('../models/Auth');

const jwt = require('jsonwebtoken');

//chiffrement du mot de passe utilisateur
exports.signup=(req, res, next)=>{
  bcrypt.hash(req.body.password, 10)
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
  Auth.findOne({email: req.body.email})
    .then(auth => {
      if(!auth){
        return res.status(401).json({error: "Utilisateur non trouvé"});
      }
      bcrypt.compare(req.body.password, auth.password)
        .then(valid=> {
          if(!valid){
            return res.status(401).json({error: "Mot de passe incorrect"});
          }
          res.status(200).json({
            authId: auth._id,
            token: jwt.sign(
              {authId:auth._id},
              'RANDOM_TOKEN_SECRET',
              {expiresIn:'24h'}
            )
          });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};
