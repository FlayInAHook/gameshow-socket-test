import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { Game } from 'src/app/models/game.model';
import { AudioService } from './audio.service';

@Injectable({
  providedIn: 'root'
})
export abstract class GameService {


  //currentGame = this.socket.fromEvent<Game>('game');

  constructor(public socket: Socket, private audio: AudioService) {
    socket.on("playAudio", (event: any) => {
      console.log("playAudio")
      switch (event.type) {
        case "buzz":
          audio.playBuzz();
          break;
        case "correct":
          audio.playCorrect();
          break;
        case "sad":
          audio.playSad();
          break;
        case "wrong":
          audio.playWrong();
          break;
        case "join":
          audio.playJoin();
          break;
        default:
          break;
      }
    })
  }

  addGame(host: string, game: Game) {
    console.log("adding");
    game.gameID = this.gameID();
    console.log(this.socket.emit("addGame", {'host': host, 'game': game}));
  }

  playSound(host: string, type: string){
    this.socket.emit("playAudioServer", {"host": host, "type": type});
  }

  join(gameID: string, playerName: string) {
    this.socket.emit('join', {'gameID': gameID, 'playerName': playerName});
  }

  //in case the hosts disconnects he can reconnect with the link
  hostJoin(host: string) {
    this.socket.emit('hostJoin', {'host': host});
  }
  changeQuestion(host: string, question: string, image: string, input: boolean) {
    this.socket.emit('changeQuestion', {'host': host, 'question': { 'message': question, 'image': image, 'input': input}});
  }

  
  addPoint(host: string, playerName: string, points: number) {
    this.socket.emit('addPoint', {'host': host, 'playerName': playerName, "points": points});
  }

  endGame(host: string) {
    this.socket.emit('endGame', {'host': host});
  }

  reopenGame(host: string) {
    this.socket.emit('reopenGame', {'host': host});
  }

  close(host: string) {
    this.socket.emit('close', {'host': host});
  }

  private gameID() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
  
  
}
