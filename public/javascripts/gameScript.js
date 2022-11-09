const socket = io(); //Création de la connexion
const statusLabel = document.getElementById("gameInfo"); //Récupération de l'élément d'indication du status de la partie
const BTstone = document.getElementById("stone");
const BTpaper = document.getElementById("paper");
const BTcissors = document.getElementById("cissors");

const refreshStatus = (value) => {
    if(value == 'waiting') {
        statusLabel.innerHTML = "En attente d'un joueur...";  //Actualisation du texte
        disableButtons();
    }
    else if(value == 'playing') {
        statusLabel.innerHTML = "Veuillez choisir quoi jouer"; //Actualisation du texte
        enableButtons();
    }
}

const disableButtons = () => {
    //Désactivation des boutons
    BTstone.disabled = true;
    BTpaper.disabled = true;
    BTcissors.disabled = true;
}

const enableButtons = () => {
    //Désactivation des boutons
    BTstone.disabled = false;
    BTpaper.disabled = false;
    BTcissors.disabled = false;
}

const played = (value, otherAnswer) => {
    if(value == 'win') {
        statusLabel.innerHTML = `Vous avez gagné ! L'autre joueur a joué ${otherAnswer}`; //Actualisation du texte
    }
    else if(value == 'loose') {
        statusLabel.innerHTML = `Vous avez perdu ! L'autre joueur a joué ${otherAnswer}`; //Actualisation du texte
    }
    else if(value == 'egality') {
        statusLabel.innerHTML = `Vous êtes à égalité en ayant tous les deux joués ${otherAnswer}, rejouez  à nouveau !`; //Actualisation du texte
        enableButtons();
    }
    else {
        statusLabel.innerHTML = "Une erreur s'est produite, rechargez la page"; //Actualisation du texte
        socket.disconnect(true); //Déconnexion du socket
    }
}

BTstone.addEventListener("click", () => {
    disableButtons();
    statusLabel.innerHTML = "Vous avez joué la pierre. En attente du choix de l'autre joueur..."; //Actualisation du texte
    socket.emit('play', 'pierre'); //Envoi du message de jeu au serveur
});

BTpaper.addEventListener("click", () => {
    disableButtons();
    statusLabel.innerHTML = "Vous avez joué la feuille. En attente du choix de l'autre joueur..."; //Actualisation du texte
    socket.emit('play', 'feuille'); //Envoi du message de jeu au serveur
});

BTcissors.addEventListener("click", () => {
    disableButtons();
    statusLabel.innerHTML = "Vous avez joué les ciseaux. En attente du choix de l'autre joueur..."; //Actualisation du texte
    socket.emit('play', 'ciseaux'); //Envoi du message de jeu au serveur
});

disableButtons();
socket.emit('newPlayer'); //Envoi du message de connexion au serveur
socket.on('status', value => refreshStatus(value)); //Abonnement au status
socket.on('play', (value, otherAnswer) => played(value, otherAnswer)); //Abonnement au play