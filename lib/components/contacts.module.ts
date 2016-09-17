import {NgModule} from '@angular/core';
import UserService from '../services/UserService';
import TokenStore from '../services/TokenStore';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload';
import {HighlightDirective} from './core/highlight';
import {SearchField} from './core/search-field';
import {GroupListItem} from './group-list-item';
import {EncodedImage} from './core/encoded-image';
import {CroppedImage} from './core/cropped-image';

import {UserArea} from './user-area';
import BootstrapNav from './bootstrap-nav';
import {ContactCreateForm} from './contact-create-form';
import {ContactList} from './contact-list';
import {ContactListItem} from './contact-list-item';
import {ContactDetail} from './contact-detail';
import {ImportCsv} from './import-csv';
import {GroupList} from './group-list';
import ContactFilter from './contact-filter';
import {UserProfile} from './profile-form';

@NgModule({
	imports: [ CommonModule, FormsModule, RouterModule ],
  	declarations: [
  		BootstrapNav, UserArea,
  		HighlightDirective, SearchField,
  		EncodedImage, CroppedImage, ...FILE_UPLOAD_DIRECTIVES,
  		GroupList, GroupListItem,
  		ContactCreateForm, ContactList, ContactListItem, ContactDetail, ContactFilter,
  		ImportCsv, UserProfile
  	],
	providers: [UserService, TokenStore]
})
export default class ContactsModule{}