import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Contact} from '../models/Contact';
import {ContactService} from '../services/ContactService';
import {Selection} from './interfaces/selection';


@Component({
    selector: "[mn-contact-list-item]",
    templateUrl: '/partials/contact-list-item.html'      
})
export class ContactListItem implements OnInit, OnChanges {
    @Input() item: Contact
    @Input() selected: boolean
    @Output() checkItem: EventEmitter<Selection>
    _selectedItem: Contact
    silent: boolean = false
    editRoute: Array<string>
	constructor(private _contactService: ContactService, private _route: ActivatedRoute) {
        this.checkItem = new EventEmitter<Selection>();
        this._selectedItem = new Contact();
	}
    ngOnInit() {
        this.editRoute = [`/contacts/edit/${this.item._id}`];
    }
    set selectedItem(val: boolean) {
        this._selectedItem = this.item;

        if (!this.silent) {
            let selection: Selection = {"itemId": String(this.item._id), "selected": val};
            this.checkItem.emit(selection);
        }
    }
    set isSelected(val: boolean) {
        this.selectedItem = val;
    }
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        let log: string[] = [];
        for (let propName in changes) {
            let changedProp = changes[propName];
            let from = JSON.stringify(changedProp.previousValue);
            let to = JSON.stringify(changedProp.currentValue);
            if (from != '' && propName == "selected") {
                this.silent = true;
                this.selectedItem = changedProp.currentValue;
                this.silent = false;
            }
        }        
    }
}