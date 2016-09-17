import {Component, Input, EventEmitter, OnInit, OnChanges, SimpleChange} from '@angular/core';
import {Router} from '@angular/router';
import {Contact} from '../models/Contact';
import {Group} from '../models/Group';
import {ContactService} from '../services/ContactService';
import {GroupService} from '../services/GroupService';
import {NgForm} from '@angular/forms';

const returnUrl = 'contacts/list';

@Component({
    selector: "mn-contact-create-form",
    providers: [GroupService, ContactService],
    styles: [`
        [hidden] {
            display: none;
        }
    `],
    templateUrl: '/partials/create-new.html'
})
export class ContactCreateForm implements OnInit {
    newItem: Contact;
    active: boolean = true;
    submitted: boolean = false;
    groups: Array<Group>;
    title: string = 'Create Contact';
	constructor(
        private _groupService: GroupService,
        private _contactService: ContactService, 
        private _router: Router) {
		this.newItem = new Contact();
        this.groups = new Array<Group>();
	}
    onSubmit() {        
        this._contactService.create(this.newItem).subscribe(() => {
            this.submitted = true;
            this._router.navigate([returnUrl]);
        }, (error) => {
            console.log("error", error);
        })
    }
    ngOnInit() {
        this._groupService.getAll().subscribe((items) => {
            this.groups = items;
        })
    }
    onCancel(event) {
        event.preventDefault();
        this._router.navigate([returnUrl]);
    }
    get diagnostic() { return JSON.stringify(this.newItem); }
}