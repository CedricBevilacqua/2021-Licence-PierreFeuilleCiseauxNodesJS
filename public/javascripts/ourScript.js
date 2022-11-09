const socket = io();                                  // création de la connexion
 
socket.emit('greatings', { name : 'timoleon' } );     // envoi du message 'greatings' vers le serveur, ici le paramètre est un objet
socket.on('welcome', () => welcomeReceived() );       // abonnement au message 'welcome' du serveur
 
const welcomeReceived = () => console.log('connection with server done');