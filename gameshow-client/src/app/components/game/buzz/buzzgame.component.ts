import { KeyValue } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BuzzGame, Game } from 'src/app/models/game.model';
import { AudioService } from 'src/app/services/audio.service';
import { BuzzGameService } from 'src/app/services/buzz-game.service';
import { GameService } from 'src/app/services/game.service';

export enum KEY_CODE {
  SPACE = ' ',
  ENTER = 'Enter'
}

@Component({
  selector: 'app-buzzgame',
  templateUrl: './buzzgame.component.html',
  styleUrls: ['./buzzgame.component.scss']
})
export class BuzzGameComponent implements OnInit {

  games: Observable<Game[]> | undefined;
  currentGame: BuzzGame = new BuzzGame();
  private _gameSub: Subscription = new Subscription;
  id : string = "";
  joinForm = this.formBuilder.group({
    playerName: ''
  });
  answerForm = this.formBuilder.group({
    answer: ''
  });

  valueAscOrder = (a: KeyValue<string,number>, b: KeyValue<string,number>): number => {
    return a.value > b.value ? -1 : (b.value > a.value ? 1 : 0);
  }

  playerName : string = "";

  constructor(private activatedRoute: ActivatedRoute, private gameService: BuzzGameService, 
              private router: Router, private formBuilder: FormBuilder, private sanitizer: DomSanitizer) { 
    this._gameSub = this.gameService.currentGame.subscribe(game => this.currentGame = game);
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];

    });
  } 
  ngOnInit(): void {
    this.answerForm.get("answer")?.valueChanges.subscribe(selectedValue => {
      setTimeout(() => {
        this.typingAnswer() //shows the latest first name
      })
         
    })
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === KEY_CODE.SPACE || event.key == KEY_CODE.ENTER) {
      this.buzz()
    }
  }

  joinGame(){
    this.gameService.join(this.id, this.joinForm.value.playerName);
    this.playerName = this.joinForm.value.playerName;
    console.log(this.currentGame)
  }

  logGame(){
    console.log(this.currentGame)
  }

  buzz(){
    this.gameService.buzz(this.playerName, this.currentGame.gameID);
    this.logGame();
  }

  typingAnswer(){
    console.log("typing...");
    this.gameService.typingAnswer(this.playerName, this.answerForm.value.answer, this.currentGame.gameID);
  }

  hasActiveQuestionMessage(){
    if (this.currentGame.question.message !== ""){
      return true;
    }
    return false;
  }

  hasActiveQuestionImage(){
    if (this.currentGame.question.image !== ""){
      return true;
    }
    return false;
  }

  getImage(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.currentGame.question.image);
  }

}
