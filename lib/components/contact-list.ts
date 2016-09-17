import {Component, Input, EventEmitter, OnInit, OnChanges, SimpleChange} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

import {Group} from '../models/Group';
import {Contact} from '../models/Contact';


import {ContactService} from '../services/ContactService';
import {FilterService} from '../services/FilterService';
import {SearchField} from './core/search-field';
import {Selection} from './interfaces/selection';



@Component({
    selector: "mn-contact-list",
    outputs: ['selectItem'],
    // pipes: [JsonPipe],
    styles: [
        `
            .highlight {
                background: #eee;
            }

            th {
                padding: 8px 12px;
            }

            .toolbar {
                padding: 0 10px 10px 0;
            }

            tr td:first-child {
                text-align: center;
            }

            .empty-label {
                padding: 20px 0;
            }
        `
    ],
    templateUrl: '/partials/contact-list.html'
})
export class ContactList implements OnInit {
	items: Array<Contact>;
	search: string;
    createShow: boolean = false;
    @Input() selectedGroup: Group;
    selectedItem: Contact;
    selectItem: EventEmitter<Contact>;
    selection: Object;
    _selectAll: boolean;
    title: string = "Contacts";
    showFilter: boolean = false;
	constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _contactService: ContactService, 
        private _filterService: FilterService) {
		this.items = [];
        this.selection = {};
        this.selectItem = new EventEmitter<Contact>();
	}
    refreshData() {
        this._contactService.getAll().subscribe((items) => {
            this.items = items;
        })
    }
    refreshDataWithFilter(group: Group) {

        if (group) {
            this._contactService.getByCategory(group._id).subscribe((items) => {
                this.items = items;
            })
        } else {
            this.refreshData();
        }
    }
    searchWithFilter(filter: Array<any>) {
        if (filter.length > 0) {
            this._contactService.searchBy(filter).subscribe((items) => {
                this.items = items;
            })
        } else {
            this.refreshData();
        }
    }
    searchByName(name: string) {
        this._contactService.searchByName(name).subscribe((items) => {
            this.items = items;
        })
    }
    onCreate(newItem: Contact) {
        this._contactService.create(newItem).subscribe((resp) => {
            console.log("Feed created", resp);
            this.createShow = false;
            this.refreshDataWithFilter(this.selectedGroup);
        });
    }
    create() {
        this.createShow = true;
    }
    set selectAll(val: boolean) {
        this.items.forEach((item) => {
            this.selection[item._id] = val;
        })            
    }
    onSelect(event, item: Contact) {
        console.log("select", item);
        this.selectedItem = item;
        this.selectItem.emit(item);
    }
    onCheckItem(selection: Selection) {
        this.selection[selection.itemId] = selection.selected;
        console.log("selection", this.selection);
    }
    isSelected(item) {
        return this.selectedItem == item;
    }
    removeSelected() {
        for (let k in this.selection) {

            let v = this.selection[k];
            if (v) {
                console.log("Remove item", k);
                this._contactService.delete(k).subscribe((res) => {
                    console.log("removed", res);
                    this.refreshDataWithFilter(this.selectedGroup);
                });
            }
        }
    }
    ngOnInit() {
        this.refreshData();
        this._filterService.subscribe('selectedGroup', (value: Group) => {
            this.selectedGroup = value;
            this.refreshDataWithFilter(value);
        });

        // this._router
        //     .routerState
        //     .queryParams
        //     .subscribe(params => {
        //         console.log(params);
        //         //this.userId = +params['userId'];
        //     });
    }

}