import {Component, Input, EventEmitter, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FileUploader} from 'ng2-file-upload';
import {GroupService} from '../services/GroupService';
import {ContactService} from '../services/ContactService';
import {Group} from '../models/Group';
import {Contact} from '../models/Contact';
import {Observable} from 'rxjs/Rx';

const returnUrl = 'contacts/list';

@Component({
    selector: "mn-contact-detail-item",
    templateUrl: '/partials/contact-detail.html',
    styles: [`
        [hidden] {
            display: none;
        }
        img.user-photo {
            width: 280px;
            height: 380px;
        }
    `]
})
export class ContactDetail implements OnInit {
    item: Contact
    active: boolean = false;
    groups: Array<Group>
    uploader: FileUploader
	constructor(
        private _contactService: ContactService, 
        private _groupService: GroupService,
        private _route: ActivatedRoute, 
        private _router: Router) {
        this.item = new Contact();
        this.groups = [];
	}
    ngOnInit() {
        
        this._route.params.subscribe((params: {id: string}) => {

            if (!this.uploader) {

                this.uploader = new FileUploader({
                    url: '/contacts/' + params.id + '/upload'
                })

                this.uploader.onCompleteItem = this.onAfterUpload.bind(this);
                this.uploader.onErrorItem = this.onUploadError.bind(this);
            }

            if (params.id) {
                this._contactService.getById(params.id).subscribe((item) => {
                    this.item = item;
                    this.active = true;
                });

                this._groupService.getAll().subscribe((items) => {
                    this.groups = items;
                })
            }
        })

    }
    onSubmit() {
        this._contactService.update(this.item).subscribe((resp) => {            
            this._router.navigate([returnUrl]);
        })
    }
    onCancel(event) {
        event.preventDefault();
        this._router.navigate([returnUrl]);
    }
    onUploadPhoto() {
        this.uploader.uploadAll();
    }
    onAfterUpload() {
        console.log("upload ok");
    }
    onUploadError(err) {
        console.log("error", err);   
    }
}