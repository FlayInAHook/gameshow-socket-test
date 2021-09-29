import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { BuzzGame, Game } from 'src/app/models/game.model';
import { AudioService } from './audio.service';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class BuzzGameService extends GameService {

  answers : Map<string, string> = new Map<string, string>();
  currentGame = this.socket.fromEvent<BuzzGame>('game');

  constructor(socket: Socket, audio: AudioService){
    super(socket, audio);
    socket.on("typedAnswer", (event: any) => {
      console.log("got answer")
      this.answers.set(event.playerName, event.answer);
    })
  }

  buzz(playerName: string, gameID : string) {
    this.socket.emit('buzz', {'playerName': playerName, 'gameID' : gameID});
  }

  clearBuzzer(host: string) {
    this.socket.emit('clearBuzzer', {'host': host});
  }

  typingAnswer(playerName: string, answer: string, gameID: string){
    this.socket.emit('typingAnswer', {'playerName': playerName, 'answer': answer, 'gameID' : gameID});
  }
  
}
