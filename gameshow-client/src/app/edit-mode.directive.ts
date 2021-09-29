import { TemplateRef } from '@angular/core';
import { Directive } from '@angular/core';

@Directive({
  selector: '[editMode]'
})
export class EditModeDirective {

  constructor(public tpl: TemplateRef<any>) { }

}
