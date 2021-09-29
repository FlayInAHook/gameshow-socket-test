import { Clipboard } from '@angular/cdk/clipboard';
import { KeyValue } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BuzzGame, Game, GameType } from 'src/app/models/game.model';
import { BuzzGameService } from 'src/app/services/buzz-game.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-buzzhost',
  templateUrl: './buzzhost.component.html',
  styleUrls: ['./buzzhost.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class BuzzHostComponent implements OnInit {
  games: Observable<Game[]> | undefined;
  currentGame: BuzzGame = new BuzzGame();
  answers: Map<string, string> = new Map<string, string>();
  private _gameSub: Subscription = new Subscription;
  private _answerSub: Subscription = new Subscription;
  hostID : string = "";
  
  imageDataString: string = "";

  questionForm = this.formBuilder.group({
    question: '',
    image: '',
    input: false

  });

  settingsForm = this.formBuilder.group({
    pointsForValid: '',
    pointsForEOneOnInvalid : ''
  });

  valueAscOrder = (a: KeyValue<string,number>, b: KeyValue<string,number>): number => {
    return a.value > b.value ? -1 : (b.value > a.value ? 1 : 0);
  }

  constructor(private activatedRoute: ActivatedRoute, public gameService: BuzzGameService, 
              private router: Router, private formBuilder: FormBuilder, private sanitizer: DomSanitizer,
              private clipboard: Clipboard) { 
    this._gameSub = this.gameService.currentGame.subscribe(game => this.currentGame = game);
    this.activatedRoute.params.subscribe(params => {
      this.hostID = params['id'];
    });
    //this.hostID = route.params['id'];
  }

  ngOnInit(): void {}

  ngAfterViewInit(){
    //console.log("after init " + this.id);
    if (this.hostID.length != undefined){
      console.log("kekw");
      this.gameService.hostJoin(this.hostID);
    }
  }

  createGame(){
    var host = this.generateHostID();
    localStorage.setItem("host", host);
    this.gameService.addGame(host, new BuzzGame());
    this.router.navigate(["/host/" + host])
  }

  copyLink(){
    this.clipboard.copy("https://gameshow.flayinahook.de/join/buzz/" + this.currentGame.gameID);
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
    this.gameService.playSound(this.getHost(), "wrong")
  }

  rightBuzzer(){
    this.gameService.addPoint(this.getHost(), this.currentGame.buzzing, parseInt(this.settingsForm.value.pointsForValid))
    this.gameService.clearBuzzer(this.getHost());
    this.gameService.playSound(this.getHost(), "correct")
  }

  getHost(): string {
    return this.hostID; //localStorage.getItem("host") || "";
  }

  changeQuestion(inputChange: boolean){
    if (inputChange){
      /*console.log("inputChange: " + !this.questionForm.value.input)
      this.gameService.changeQuestion(this.getHost(), "", "", !this.questionForm.value.input);
      this.questionForm.setValue({"question": "", "image": "", "input": !this.questionForm.value.input});*/
    } else {
      this.gameService.changeQuestion(this.getHost(), this.questionForm.value.question, this.questionForm.value.image, this.questionForm.value.input);
      this.questionForm.setValue({"question": "", "image": "", "input": this.questionForm.value.input});
    }
    
    console.log(this.currentGame);
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

  playSad(){
    this.gameService.playSound(this.getHost(), "sad")
  }

  endGame(){
    this.gameService.endGame(this.getHost());
  }

  reopenGame(){
    this.gameService.reopenGame(this.getHost());
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
    console.log("dropped");
    const promise = this.readFile(event[0]);
    promise.then((res) => {
      this.questionForm.setValue({"image": res, "question": this.questionForm.value.question, "input": this.questionForm.value.input});
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
