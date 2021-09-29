const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
  });



const hosts = {}; //Map<sHostID, sGameID> 
const games = {};
const hostUsers = {}; //Map<sGameID, sHostSocketID>

function gameExists(gameID){
    return Object.keys(games).includes(gameID);
}

function gameEnded(gameID){
    return games[gameID].end;
}


io.on("connection", socket => {
    let previousId;
  
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
        previousId = currentId;
    };

    const emitPlayers = (roomID, event, value) => {
        io.in(roomID).emit(event, value);
    }

    const emitHost = (roomID, event, value) => {
        io.to(hostUsers[roomID]).emit(event, value);
    }
  
    const emitAll = (roomID, event, value) => {
        emitPlayers(roomID, event, value);
        emitHost(roomID, event, value);
    }



    socket.on("join", event => {
        if (!gameExists(event.gameID)) return;
        games[event.gameID].players[event.playerName] = 0;
        safeJoin(event.gameID);
        emitAll(event.gameID, "game", games[event.gameID]);
        emitAll(event.gameID, "playAudio", {type: "join"});
        //io.in(event.gameID).emit("playAudio", {type: "join"});
        //io.in(event.gameID).emit("game", games[event.gameID]);
    });

    socket.on("buzz", event => {
        if (!gameExists(event.gameID)) return;
        if (gameEnded(event.gameID)) return;
        if (games[event.gameID].question.input) return;
        if (games[event.gameID].buzz == false){
            games[event.gameID].buzz = true;
            games[event.gameID].buzzing = event.playerName;
            emitAll(event.gameID, "game", games[event.gameID]);
            emitAll(event.gameID, "playAudio", {type: "buzz"}); 
            //io.in(event.gameID).emit("game", games[event.gameID]);
            //io.in(event.gameID).emit("playAudio", {type: "buzz"});
        }
    });

    socket.on("typingAnswer", event => {
        if (!gameExists(event.gameID)) return;
        if (gameEnded(event.gameID)) return;
        console.log("typing...")
        emitHost(event.gameID, "typedAnswer", {playerName: event.playerName, answer: event.answer});
        //io.to(hostUsers[event.gameID]).emit("typedAnswer", {playerName: event.playerName, answer: event.answer})
    });

    socket.on("playAudioServer", event => {
        if (!Object.keys(hosts).includes(event.host)){ return;}
        emitAll(hosts[event.host], "playAudio", {type: event.type});
        //io.in(hosts[event.host]).emit("playAudio", {type: event.type});
    });

    socket.on("hostJoin", event => {
        console.log("hostJoin")
        if (!Object.keys(hosts).includes(event.host)){ return;}
        gameID = hosts[event.host];
        hostUsers[gameID] = socket.id;
        safeJoin(hosts[event.host]);
        emitAll(gameID, "game", games[gameID]);
        //io.in(gameID).emit("game", games[gameID]);
    });

    socket.on("addGame", newGame => {
        console.log("adding");
        hosts[newGame.host] = newGame.game.gameID;
        games[newGame.game.gameID] = newGame.game;
        hostUsers[newGame.game.gameID] = socket.id;
        console.log(games);
        safeJoin(newGame.game.gameID);
        //io.emit("games", Object.keys(games));
        //socket.emit("game", games[newGame.game.gameID]); shouldnt be required witht he new routing structure?
    });

    socket.on("changeQuestion", event => {
        if (!Object.keys(hosts).includes(event.host)){ return;}
        const gameID = hosts[event.host];
        games[gameID].question = event.question;
        
        emitAll(gameID, "game", games[gameID]);
        //io.in(gameID).emit("game", games[gameID]);
    });

    socket.on("clearBuzzer", event => {
        if (!Object.keys(hosts).includes(event.host)){ return;}
        const gameID = hosts[event.host];
        games[gameID].buzz = false;
        
        emitAll(gameID, "game", games[gameID]);
        //io.in(gameID).emit("game", games[gameID]);
    });

    socket.on("addPoint", event => {
        if (!Object.keys(hosts).includes(event.host)){ return;}
        const gameID = hosts[event.host];
        games[gameID].players[event.playerName] += event.points;
        
        emitAll(gameID, "game", games[gameID]);
        //io.in(gameID).emit("game", games[gameID]);
    });

    socket.on("endGame", event => {
        if (!Object.keys(hosts).includes(event.host)){ return;}
        const gameID = hosts[event.host];
        games[gameID].end = true;
        
        emitAll(gameID, "game", games[gameID]);
        //io.in(gameID).emit("game", games[gameID]);
    });

    socket.on("reopenGame", event => {
        if (!Object.keys(hosts).includes(event.host)){ return;}
        const gameID = hosts[event.host];
        games[gameID].end = false;
        
        emitAll(gameID, "game", games[gameID]);
        //io.in(gameID).emit("game", games[gameID]);
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