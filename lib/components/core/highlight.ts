import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[mnHighlight]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  }
})
export class HighlightDirective {
  private _defaultColor = 'blue';
  private el: HTMLElement;
  @Output() onHover: EventEmitter<any>;
  @Output() onLeave: EventEmitter<any>;
  constructor(el: ElementRef) { 
    this.el = el.nativeElement; 
    this.onHover = new EventEmitter<any>();
    this.onLeave = new EventEmitter<any>();
  }

  @Input('mnHighlight') highlightColor: string;

  onMouseEnter() { this.highlight(this.highlightColor || this._defaultColor); this.onHover.emit(true);}
  onMouseLeave() { this.highlight(null); this.onLeave.emit(true);}

   private highlight(color:string) {
    this.el.style.backgroundColor = color;
  }

}