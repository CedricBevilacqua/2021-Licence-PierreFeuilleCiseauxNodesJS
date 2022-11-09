class IoController {
 
    constructor(io) {
      this.io = io;

      this.player1ID = '';
      this.player1Socket;
      this.player1Choice = '';

      this.player2ID = '';
      this.player2Socket;
      this.player2Choice = '';

      this.finishedGame = false;
    }
  
    registerSocket(socket) {
      socket.on('newPlayer', () => this.registerPlayer(socket));  //Ecoute des messages de connexion de nouveaux joueurs
      socket.on('play', value => this.play(socket, value));
      socket.on('disconnect', () => this.leave(socket)); //Ecoute de déconnexion
    }

    registerPlayer(socket) {
        console.log(`Nouvelle connexion ID : ${socket.id}`);
        if(this.player1ID == '') {
            this.player1ID = socket.id; //Enregistrement du joueur 1
            this.player1Socket = socket; //Enregistrement de la socket du joueur 2
            console.log('Connexion J1 enregistrée');
        }
        else if(this.player2ID == '') {
            this.player2ID = socket.id; //Enregistrement du joueur 2
            this.player2Socket = socket; //Enregistrement de la socket du joueur 2
            console.log('Connexion J2 enregistrée');
        }
        else {
            socket.disconnect(true); //Déconnexion du socket
            console.log('Nouvelle connexion refusée : 2 joueurs maximum');
        }
        this.sayIfReady();
    }
  
    leave(socket) {
      console.log(`Déconnexion ID : ${socket.id}`);
      if(this.player1ID == socket.id) {
        this.player1ID = '';
        console.log('J1 s\'est déconnecté');
      }
      else if(this.player2ID == socket.id) {
          this.player2ID = '';
          console.log('J2 s\'est déconnecté');
      }
      if(!this.finishedGame) { this.sayIfReady(); }
      else { this.finishedGame = true; }
    }

    sayIfReady() {
        if(this.player1ID == '' && !this.player2ID == '') {
            this.player2Socket.emit('status', 'waiting'); //Envoi d'une demande d'attente
        }
        else if(this.player2ID == '' && !this.player1ID == '') {
            this.player1Socket.emit('status', 'waiting'); //Envoi d'une demande d'attente
        }
        else if(!this.player2ID == '' && !this.player1ID == '') {
            this.player1Socket.emit('status', 'playing'); //Envoi d'une demande de jeu
            this.player2Socket.emit('status', 'playing'); //Envoi d'une demande de jeu
        }
    }

    play(socket, value) {
        if(socket.id == this.player1ID) {
            this.player1Choice = value;
        }
        else if(socket.id == this.player2ID) {
            this.player2Choice = value;
        }
        if(this.player1Choice != '' && this.player2Choice != '') {
            this.determine();
        }
    }

    determine() {
        if(this.player1Choice == 'pierre' && this.player2Choice == 'pierre') {
            this.player1Socket.emit('play', 'egality', this.player2Choice); //Envoi de l'état de partie au J1
            this.player2Socket.emit('play', 'egality', this.player1Choice); //Envoi de l'état de partie au J2
            //Réinitialisation des égalités
            this.player1Choice = '';
            this.player2Choice = '';
        }
        else if(this.player1Choice == 'pierre' && this.player2Choice == 'feuille') {
            this.player1Socket.emit('play', 'loose', this.player2Choice); //Envoi de l'état de partie au J1
            this.player2Socket.emit('play', 'win', this.player1Choice); //Envoi de l'état de partie au J2
            this.endGame();
        }
        else if(this.player1Choice == 'pierre' && this.player2Choice == 'ciseaux') {
            this.player1Socket.emit('play', 'win', this.player2Choice); //Envoi de l'état de partie au J1
            this.player2Socket.emit('play', 'loose', this.player1Choice); //Envoi de l'état de partie au J2
            this.endGame();
        }
        else if(this.player1Choice == 'feuille' && this.player2Choice == 'pierre') {
            this.player1Socket.emit('play', 'win', this.player2Choice); //Envoi de l'état de partie au J1
            this.player2Socket.emit('play', 'loose', this.player1Choice); //Envoi de l'état de partie au J2
            this.endGame();
        }
        else if(this.player1Choice == 'feuille' && this.player2Choice == 'feuille') {
            this.player1Socket.emit('play', 'egality', this.player2Choice); //Envoi de l'état de partie au J1
            this.player2Socket.emit('play', 'egality', this.player1Choice); //Envoi de l'état de partie au J2
            //Réinitialisation des égalités
            this.player1Choice = '';
            this.player2Choice = '';
        }
        else if(this.player1Choice == 'feuille' && this.player2Choice == 'ciseaux') {
            this.player1Socket.emit('play', 'loose', this.player2Choice); //Envoi de l'état de partie au J1
            this.player2Socket.emit('play', 'win', this.player1Choice); //Envoi de l'état de partie au J2
            this.endGame();
        }
        else if(this.player1Choice == 'ciseaux' && this.player2Choice == 'pierre') {
            this.player1Socket.emit('play', 'loose', this.player2Choice); //Envoi de l'état de partie au J1
            this.player2Socket.emit('play', 'win', this.player1Choice); //Envoi de l'état de partie au J2
            this.endGame();
        }
        else if(this.player1Choice == 'ciseaux' && this.player2Choice == 'feuille') {
            this.player1Socket.emit('play', 'win', this.player2Choice); //Envoi de l'état de partie au J1
            this.player2Socket.emit('play', 'loose', this.player1Choice); //Envoi de l'état de partie au J2
            this.endGame();
        }
        else if(this.player1Choice == 'ciseaux' && this.player2Choice == 'ciseaux') {
            this.player1Socket.emit('play', 'egality', this.player2Choice); //Envoi de l'état de partie au J1
            this.player2Socket.emit('play', 'egality', this.player1Choice); //Envoi de l'état de partie au J2
            //Réinitialisation des égalités
            this.player1Choice = '';
            this.player2Choice = '';
        }
        else {
            this.player1Socket.emit('play', 'error'); //Envoi de l'état de partie au J1
            this.player2Socket.emit('play', 'error'); //Envoi de l'état de partie au J2
            this.endGame();
        }
    }

    endGame() {
        this.finishedGame = true; //Indication que la partie est terminée
        this.leave(this.player1Socket); //Arrêt de la connexion avec J1
        this.leave(this.player2Socket); //Arrêt de la connexion avec J2
        //Réinitialisation des attributs opérationnels
        this.player1ID = '';
        this.player2ID = '';
        this.player1Choice = '';
        this.player2Choice = '';
    }

 }
  
 module.exports =  io => new IoController(io) ;