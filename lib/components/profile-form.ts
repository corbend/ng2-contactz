import {Component, Input, Output, OnInit, OnChanges, HostBinding, Injectable, EventEmitter, Directive, ElementRef, AfterViewInit, AfterViewChecked} from '@angular/core';
import {NgForm} from '@angular/forms';
import {CanActivate, Resolve, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Logger} from '../services/LogService';
import UserService from '../services/UserService';
import {AuthHttp} from './auth/jwt';
import {User} from '../models/User';
import {Observable} from 'rxjs/Rx';
import {FileUploader} from 'ng2-file-upload';

import * as cropperjs from 'cropperjs';
const lodash = require('lodash');

@Injectable()
export class UserResolver implements Resolve<User> {
	constructor(private _userService: UserService) {

	}
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
		return this._userService.getCurUserProfile();
	}
}

@Component({
	templateUrl: '/partials/user-profile.html',
	selector: 'user-profile',
	providers: [UserResolver],
	styles: [
		`
			img {
				max-width: 100%;
			}

			.preview-container {
				width: 100px;
				height: 100px;
				overflow: hidden;
			}
			
			img.cropper-wizard {
				width: 100%;
			}

			.image-transition-icon {
				text-align: center;
				vertical-align: middle;
			}
		`
	]
})
export class UserProfile {
	user: User;
	newPassword: {new: string, old: string};
	deletedProfile: {name: string};
	encodedAvatar: string;
	previewAvatar: string;
	previewUrl: string;
	croppedPreviewAvatar: string;
	uploader: FileUploader;
	constructor(
		private _jwt: AuthHttp,
		private _log: Logger,
		private _userService: UserService, 
		private route: ActivatedRoute) { 

		this.user = new User();
		this.user = this.route.snapshot.data.user;

		this.uploader = new FileUploader({
			url: '/users/' + this.user._id + '/avatar'
		});

		this.newPassword = { new: '', old: '' };
		this.deletedProfile = { name: '' };
	}
	cropApply(blob) {
		// var fileReader = new FileReader();
		// let $cmp = $('cropper-wizard');

		// fileReader.onload = (event) => {
		// 	let srcData = event.target.result; // <--- data: base64
		// 	console.log("read blob url", srcData);
		// 	this.updatePicture(srcData);
		// }
		// fileReader.readAsDataURL(new Blob([this.previewUrl]));
		this.updatePicture(blob);
	}
	changeProfile(user: User, form: NgForm) {

		let profile = form.value;
		let userData = new User();
		for (let ctName in form.controls) {
			if (form.controls[ctName].dirty) {
				userData[ctName] = profile[ctName];
			}
		}

		this._userService.update(this.user._id, userData, () => {
			this._log.info("data changed");
		});
	}
	changePassword(password: {new: string, old: string}) {	
		if (password.new && password.old) {	
			this._userService.changePass(this.user._id, password, () => {
				this._log.info("password changed");
			});
		}
	}
	deleteProfile(user) {
		if (this.deletedProfile.name == user.firstName) {
			this._userService.delete(user._id, () => {
				this._log.info("deleted profile");
			});
		}
	}
	onEncode(base64Image: string) {
		this.previewAvatar = base64Image;
	}
	onPreviewUrlChange(url: string) {
		this.previewUrl = url;
	}
	setPreviewAvatar() {
		this.croppedPreviewAvatar = this.previewAvatar;
    }
    updatePicture(imageSrc: any) {
    	this._jwt.getAuthHeader().subscribe((header) => {
    		var fd = new FormData();
			fd.append('fname', this.user._id + ".png");
			fd.append('data', imageSrc);
			$.ajax(`/users/${this.user._id}/avatar`, {
			    method: "POST",
			    data: fd,
			    processData: false,
			    contentType: false,
			    headers: lodash.extend({}, header),
			    success: function () {
			      console.log('Upload success');
			    },
			    error: function () {
			      console.log('Upload error');
			    }
			});

    	})		
    }
}