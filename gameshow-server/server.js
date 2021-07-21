const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
  });


const hosts = {};
const games = {};

function gameExists(gameID){
    return Object.keys(games).includes(gameID);
}


io.on("connection", socket => {
    let previousId;
  
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
        previousId = currentId;
    };
  
    socket.on("join", event => {
        if (!gameExists(event.gameID)) return;
        games[event.gameID].players[event.playerName] = 0;
        safeJoin(event.gameID);
        io.in(event.gameID).emit("game", games[event.gameID]);
        io.in(event.gameID).emit("playAudio", {type: "join"});
    });

    socket.on("buzz", event => {
        if (!gameExists(event.gameID)) return;
        if (games[event.gameID].buzz == false){
            games[event.gameID].buzz = true;
            games[event.gameID].buzzing = event.playerName; 
            io.in(event.gameID).emit("game", games[event.gameID]);
            io.in(event.gameID).emit("playAudio", {type: "buzz"});
        }
    });

    socket.on("playAudioServer", event => {
        if (!Object.keys(hosts).includes(event.host)){ return;}
        io.in(hosts[event.host]).emit("playAudio", {type: event.type});
    });

    socket.on("hostJoin", event => {
        console.log("hostJoin")
        if (!Object.keys(hosts).includes(event.host)){ return;}
        gameID = hosts[event.host];
        safeJoin(hosts[event.host]);
        io.in(gameID).emit("game", games[gameID]);
    });

    socket.on("addGame", newGame => {
        console.log("adding");
        hosts[newGame.host] = newGame.game.gameID;
        games[newGame.game.gameID] = newGame.game;
        console.log(games);
        safeJoin(newGame.game.gameID);
        io.emit("games", Object.keys(games));
        socket.emit("game", games[newGame.game.gameID]);
    });

    socket.on("changeQuestion", event => {
        if (!Object.keys(hosts).includes(event.host)){ return;}
        const gameID = hosts[event.host];
        games[gameID].question = event.question;
        
        io.in(gameID).emit("game", games[gameID]);
    });

    socket.on("clearBuzzer", event => {
        if (!Object.keys(hosts).includes(event.host)){ return;}
        const gameID = hosts[event.host];
        games[gameID].buzz = false;
        
        io.in(gameID).emit("game", games[gameID]);
    });

    socket.on("addPoint", event => {
        if (!Object.keys(hosts).includes(event.host)){ return;}
        const gameID = hosts[event.host];
        games[gameID].players[event.playerName] += event.points;
        
        io.in(gameID).emit("game", games[gameID]);
    });

    socket.on("endGame", event => {
        if (!Object.keys(hosts).includes(event.host)){ return;}
        const gameID = hosts[event.host];
        games[gameID].end = true;
        
        io.in(gameID).emit("game", games[gameID]);
    });

    socket.on("reopenGame", event => {
        if (!Object.keys(hosts).includes(event.host)){ return;}
        const gameID = hosts[event.host];
        games[gameID].end = false;
        
        io.in(gameID).emit("game", games[gameID]);
    });

    socket.on("close", event => {
        if (!Object.keys(hosts).includes(event.host)){ return;}
        const gameID = hosts[event.host];
       
        // TBD

    });

    socket.on('disconnect', () => {
        console.log('a user disconnected!');
    });


    io.emit("games", Object.keys(games));
    //io.emit("game", "bull");
    console.log(`Socket ${socket.id} has connected`);

  });

  http.listen(4444, () => {
    console.log('Listening on port 4444');
  });