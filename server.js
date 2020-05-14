
// importation package http
const http = require('http');

// importation application
const app = require ('./app');

//fonction qui renvoie un port valide, fourni sous forme de numéro ou de chaîne
const normalizePort = val =>{
  const port = parseInt(val, 10);
  if (isNaN(port)){
    return val;
  }
  if (port>=0){
    return port;
  }
  return false;
};
// écoute sur port 3000 ou celui envoyé
const port = normalizePort(process.env.PORT || 3000);
app.set('port',port);

//fonction qui recherche les erreurs et les gère de manière appropriée.
const errorHandler = error => {
  if (error.syscall !== 'listen'){
    throw error;
  }
  const address = server. address();
  const bind = typeof address === "string" ? "pipe" + address: "port:" + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + 'requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + 'is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
    }
};

// création serveur Node et écouteur d'évènements
const server =http.createServer(app);
server.on('error', errorHandler);
server.on('listening',() => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;
});
//serveur doit écouter requêtes envoyées
server.listen(port);
