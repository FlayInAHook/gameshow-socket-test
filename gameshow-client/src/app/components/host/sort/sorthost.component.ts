import { Clipboard } from '@angular/cdk/clipboard';
import { KeyValue } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BuzzGame, Game, GameType, SortGame } from 'src/app/models/game.model';
import { BuzzGameService } from 'src/app/services/buzz-game.service';
import { GameService } from 'src/app/services/game.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sorthost',
  templateUrl: './sorthost.component.html',
  styleUrls: ['./sorthost.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SortHostComponent implements OnInit {
  currentGame: SortGame = new SortGame(3);
  hostID : string = "";

  roundForms : FormArray[] = [];
  
  rounds: String[][] = []

  round: number = 0;

  constructor(private activatedRoute: ActivatedRoute, public gameService: BuzzGameService, 
              private router: Router, private formBuilder: FormBuilder, private sanitizer: DomSanitizer,
              private clipboard: Clipboard) { 
    //this._gameSub = this.gameService.currentGame.subscribe(game => this.currentGame = game);
    this.activatedRoute.params.subscribe(params => {
      this.hostID = params['id'];
    });
    //this.hostID = route.params['id'];
    for (let i = 0; i <= 3; i++){
      this.rounds.push([]);
      let formArray: FormControl[] = [];
      for (let ii = 1; ii <= 20; ii++){
        formArray.push(new FormControl("Option" + ii + " - Solution"));
        this.rounds[i].push("Option" + ii + " - Solution"); 
      }
      this.roundForms.push(this.formBuilder.array(formArray));
    }
  }

  ngOnInit(): void {}

  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  getControl(i: number): FormControl{
    //console.log("getting control: " + JSON.stringify(this.roundForms[this.round].at(i)))
    return this.roundForms[this.round].at(i) as FormControl;
  }

  updateField(i: number){
    if (this.roundForms[this.round].at(i).value == "" || this.roundForms[this.round].at(i).value.match(/^ *$/) !== null){
      this.roundForms[this.round].at(i).setValue("Empty");
    }
    this.rounds[this.round][i] = this.roundForms[this.round].at(i).value;
    this.updateDragable();
  }

  updateDragable(){
    this.currentGame.rounds[this.currentGame.round].options = this.rounds[this.currentGame.round].map(val =>{
      return val.substring(0,val.indexOf("-") - 1);
    })
  }

}
