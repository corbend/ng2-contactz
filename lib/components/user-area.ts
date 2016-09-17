import {Component, Input, EventEmitter, OnInit, OnChanges, SimpleChange} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {ActivatedRoute, Router, ActivatedRouteSnapshot} from '@angular/router';
import {ContactListItem} from './contact-list-item';
import {Group} from '../models/Group';
import {Contact} from '../models/Contact';
import {User} from '../models/User';
import {GroupList} from './group-list';
import {ContactList} from './contact-list';
import {ContactCreateForm} from './contact-create-form';
import {ContactService} from '../services/ContactService';
import {GroupService} from '../services/GroupService';
import {FilterService} from '../services/FilterService';
import UserService from '../services/UserService';
import {SearchField} from './core/search-field';
import BootstrapNav from './bootstrap-nav';

@Component({
    selector: "mn-contact-list",
    outputs: ['selectItem'],
    providers: [GroupService, ContactService, FilterService, UserService],
    templateUrl: '/partials/user-area.html',
    styles: [
        `
            .ttable {display: table;}
            .ttable > .trow {display: table-row;}
            .ttable > .trow > .tcell {display: table-cell;}
            .info {
                background-color: #d9edf7;
                border-color: #bce8f1;
                padding: 0px 15px;
                border: 1px solid transparent;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                width: 100%;
            }
            .user-data.info {
                padding: 0 !important;
            }
            .user-data .img-cell {
                width: 65px;
                border-right: 1px solid #bce8f1;
            }
            .user-data .img-cell img {
                width: 64px;
                height: 79px;
            }
            .user-data .name-cell {
                text-align: center;               
                margin: 0 15px;                
            }
        `
    ]
})
export class UserArea implements OnInit {
	items: Array<Contact>;
    userId: string;
	search: string;
    title: string;
    createShow: boolean = false;
    navs: Array<any>;
    loggedUser: User;
    @Input() selectedGroup: Group
    selectItem: EventEmitter<Contact>    
	constructor(
        private _userService: UserService,
        private _contactService: ContactService,
        private _route: ActivatedRoute,
        private _router: Router) {
		this.items = [];
        this.title = "Contacts";
        this.selectItem = new EventEmitter<Contact>();
        this.loggedUser = new User();

        this.navs = [
            {name: 'list', title: 'Contact List', url: '/contacts/list'},
            {name: 'create', title: 'Create New', url: '/contacts/create'},
            {name: 'import', title: 'Import', url: '/contacts/import'}
        ]
	}
    onSearchContact(contactName: string) {
        this._contactService.searchByName(contactName).subscribe((items) => {
            this.items = items;
        })
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
    onCreate(newItem: Contact) {
        this._contactService.create(newItem).subscribe((resp) => {
            this.createShow = false;
            this.refreshDataWithFilter(this.selectedGroup);
        });
    }
    create() {
        this.createShow = true;
    }
    ngOnInit() {
        this.refreshData();
        this._userService.isLoggedIn().subscribe((user) => {
            if (user) {
                this.loggedUser = user;
                if (this._route.snapshot && this._route.snapshot.url.length == 0) {
                    this._router.navigate([this.navs[0].url]);
                }
            }
        })
    }
}