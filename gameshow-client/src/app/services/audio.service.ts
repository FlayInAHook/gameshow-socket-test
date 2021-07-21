import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { Game } from 'src/app/models/game.model';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

    buzz : HTMLAudioElement = new Audio("../../../assets/sounds/buzzer.mp3");
    correct : HTMLAudioElement = new Audio("../../../assets/sounds/correct.mp3");
    wrong : HTMLAudioElement = new Audio("../../../assets/sounds/wrong.mp3");
    sad : HTMLAudioElement = new Audio("../../../assets/sounds/sad.mp3");
    join : HTMLAudioElement = new Audio("../../../assets/sounds/join.mp3");

    constructor() {
        this.buzz.volume = 0.5;
        this.buzz.load();   
        this.correct.load();   
        this.wrong.load();
        this.sad.load();
        this.join.load();
    }

    playBuzz(){
        this.buzz.play();
    }
    
    playCorrect(){
        this.correct.play();
    }

    playWrong(){
        this.wrong.play();
    }

    playSad(){
        this.sad.play();
    }

    playJoin(){
        this.join.play();
    }
  
  
}
