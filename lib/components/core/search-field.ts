import {Component, Input, ElementRef, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: "mn-search-field",
    inputs: ['delay'],
    outputs: ['onSearch'],
    template: `
        <div class="input-group">  
            <input name="search" type="text" [(ngModel)]="search" class="form-control" placeholder="Search...">
            <span class="input-group-addon">
                <i class="glyphicon glyphicon-search"></i>
            </span>
        </div>
    `
})
export class SearchField {
    search: string;
    delay: number = 500;
    onSearch: EventEmitter<string>;
    constructor(private _elementRef: ElementRef) {
        
        this.onSearch = new EventEmitter<string>();
        const eventStream = Observable.fromEvent(_elementRef.nativeElement, 'keyup')
            .map(() => this.search)
            .debounceTime(this.delay)
            .distinctUntilChanged();

        eventStream.subscribe(input => {
            console.log("search emit", input);
            this.onSearch.emit(input);
        });
    }

}