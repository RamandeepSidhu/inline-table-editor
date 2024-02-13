import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective {

 constructor( private ngControl : NgControl ) {
  }
  @Input() set disableControl( condition : boolean ) {
    console.log(this.ngControl);
    if(this.ngControl){
        const action = condition ? 'disable' : 'enable';
        
        // this.ngControl.control[action]();
      }
    }
}