import { Component, ContentChild, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { fromEvent, Subject } from 'rxjs';
import { EditModeDirective } from 'src/app/edit-mode.directive';
import { ViewModeDirective } from 'src/app/view-mode.directive';
import { filter, take, switchMapTo } from 'rxjs/operators';

@Component({
  selector: 'editable',
  template: `
    <ng-container *ngTemplateOutlet="currentView"></ng-container>
  `
})
export class EditableComponent {
  @Output() update = new EventEmitter();
  @ContentChild(ViewModeDirective) viewModeTpl!: ViewModeDirective;
  @ContentChild(EditModeDirective) editModeTpl!: EditModeDirective;

  editMode = new Subject();
  editMode$ = this.editMode.asObservable();

  mode: 'view' | 'edit' = 'view';

  constructor(private host: ElementRef) {
  }
  
  get currentView() {
    return this.mode === 'view' ? this.viewModeTpl.tpl : this.editModeTpl.tpl;
  }

  ngOnInit() {
    this.viewModeHandler();
    this.editModeHandler();
  }

  ngOnDestroy(){
    
  }

  private get element() {
    return this.host.nativeElement;
  }

  private viewModeHandler() { 
    fromEvent(this.element, 'dblclick').pipe(
     untilDestroyed(this)
   ).subscribe(() => {
     this.mode = 'edit';
     this.editMode.next(true);
   });
 }
 
 private editModeHandler() {
  const clickOutside$ = fromEvent(document, 'click').pipe(
    filter(({ target }) => this.element.contains(target) === false),
    take(1)
  )

  this.editMode$.pipe(
    switchMapTo(clickOutside$),
    untilDestroyed(this)
  ).subscribe(event => {
    this.update.next();
    this.mode = 'view';
  });
}


}