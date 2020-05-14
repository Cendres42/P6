const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    //extraction token du header Authorization de la requête entrante
    // récupération sous-chaine sans "Bearer"
    const token = req.headers.authorization.split(' ')[1];
    //fonction verify pour décoder token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if(req.body.userId && req.body.userId !== userId){
      throw 'User ID non valable!';
    } else{
      next();
    }
  } catch(error){
    res.status(401).json({
      error: new Error ('Requête non authentifiée!')
    });
  }
};
