import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, AfterViewInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Game } from 'src/app/models/game.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {
  games: Observable<Game[]> | undefined;
  currentGame: Game = new Game;
  private _gameSub: Subscription = new Subscription;
  id : string = "";
  
  imageDataString: string = "";

  questionForm = this.formBuilder.group({
    question: '',
    image: ''
  });

  settingsForm = this.formBuilder.group({
    pointsForValid: '',
    pointsForEOneOnInvalid : ''
  });

  constructor(private activatedRoute: ActivatedRoute, private gameService: GameService, 
              private router: Router, private formBuilder: FormBuilder, private sanitizer: DomSanitizer) { 
    this.games = this.gameService.games;
    this._gameSub = this.gameService.currentGame.subscribe(game => this.currentGame = game);
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(){
    console.log("after init " + this.id);
    if (this.id.length != undefined){
      console.log("kekw");
      this.gameService.hostJoin(this.id);
    }
  }

  createGame(){
    var host = this.generateHostID();
    localStorage.setItem("host", host);
    this.gameService.addGame(host);
    this.router.navigate(["/host/" + host])
  }


  generateHostID() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  clearBuzzer(){
    this.gameService.clearBuzzer(this.getHost());
  }

  falseBuzzer(){
    for (let player of Object.keys(this.currentGame.players)){
      if (player === this.currentGame.buzzing) continue;
      this.gameService.addPoint(this.getHost(), player, parseInt(this.settingsForm.value.pointsForEOneOnInvalid))
    }
    this.gameService.clearBuzzer(this.getHost());
    this.gameService.playSound({"type": "wrong", "gameID": this.currentGame.gameID})
  }

  rightBuzzer(){
    this.gameService.addPoint(this.getHost(), this.currentGame.buzzing, parseInt(this.settingsForm.value.pointsForValid))
    this.gameService.clearBuzzer(this.getHost());
    this.gameService.playSound({"type": "correct", "gameID": this.currentGame.gameID})
  }

  getHost(): string {
    return localStorage.getItem("host") || "";
  }

  changeQuestion(){
    this.gameService.changeQuestion(this.getHost(), this.questionForm.value.question, this.questionForm.value.image);
    this.questionForm.setValue({"question": "", "image": ""});
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

  addPoints(playerName : string, points : number){
    this.gameService.addPoint(this.getHost(), playerName, points);
  }


  onFileDropped(event: any) {
    /*let fileReader = new FileReader();
    console.log(event[0].name);
    let questionForm : any;
    fileReader.addEventListener("loadend", function () {
      // convert image file to base64 string
      questionForm.setValue({"image": stringify(fileReader.result)});
    }, false);
    fileReader.readAsDataURL(event[0]);*/
    const promise = this.readFile(event[0]);
    promise.then((res) => {
      this.questionForm.setValue({"image": res, "question": this.questionForm.value.question});
    });
    promise.catch((err) => {
      // This is never called
    });
  }

  readFile(file: File){
    return new Promise((resolve, reject) => {
      var fr = new FileReader();  
      fr.onload = () => {
        resolve(fr.result )
      };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }



  getImage(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.currentGame.question.image);
  }

}
