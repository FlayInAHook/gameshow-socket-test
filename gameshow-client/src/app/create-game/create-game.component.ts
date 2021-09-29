import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BuzzGame } from '../models/game.model';
import { BuzzGameService } from '../services/buzz-game.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {

  constructor(public buzzGameService: BuzzGameService, private router: Router) { }

  ngOnInit(): void {
  }

  createBuzzGame(){
    var host = this.generateHostID();
    //localStorage.setItem("host", host);
    this.buzzGameService.addGame(host, new BuzzGame());
    this.router.navigate(["/host/buzz/" + host])
  }

  createSortGame(){

  }




  generateHostID() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}
