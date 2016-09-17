import {Component} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';
import UserService from '../services/UserService';
import TokenStore from '../services/TokenStore';

interface LoginInfo {
	login: string
	password: string
}

@Component({
	selector: `mn-signin`,
	templateUrl: '/partials/login.html'
})
export default class SignInForm {
	loginInfo: LoginInfo
	constructor(private _http: Http, private _token: TokenStore, private _router: Router) {
		this.loginInfo = {
			login: '',
			password: ''
		}
	}
	onSubmit() {
		console.log("login");
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this._http.post('/users/login', JSON.stringify(this.loginInfo), {headers})
		.map(res => res.json())
		.subscribe(
			data => {
				this._token.set(data.user.token);
				window.location.href = "/?userId=" + data.user._id;
			},
			err => console.error(err)
		)
	}
}