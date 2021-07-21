import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Game } from 'src/app/models/game.model';

import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit, OnDestroy {
  games: Observable<Game[]> | undefined;
  currentGame: Game = new Game;
  private _gameSub: Subscription = new Subscription;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.games = this.gameService.games;
    this._gameSub = this.gameService.currentGame.subscribe(game => this.currentGame = game);
  }

  ngOnDestroy() {
    this._gameSub.unsubscribe();
  }

  joinGame(gameID: string, playerName: string) {
    this.gameService.join(gameID, playerName);
  }

  addGame(host: string) {
    this.gameService.addGame(host);
  }

}