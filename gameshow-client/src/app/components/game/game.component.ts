import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Game, Question } from 'src/app/models/game.model';
import { AudioService } from 'src/app/services/audio.service';
import { GameService } from 'src/app/services/game.service';

export enum KEY_CODE {
  SPACE = ' ',
  ENTER = 'Enter'
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  games: Observable<Game[]> | undefined;
  currentGame: Game = new Game;
  private _gameSub: Subscription = new Subscription;
  id : string = "";
  joinForm = this.formBuilder.group({
    playerName: ''
  });

  playerName : string = "";

  constructor(private activatedRoute: ActivatedRoute, private gameService: GameService, 
              private router: Router, private formBuilder: FormBuilder, private sanitizer: DomSanitizer) { 
    this.games = this.gameService.games;
    this._gameSub = this.gameService.currentGame.subscribe(game => this.currentGame = game);
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];

    });
  } 
  ngOnInit(): void {
    
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
