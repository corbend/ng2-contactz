import {Component} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';
import 'rxjs/Rx';

interface RegisterInfo {
	firstName: string
	lastName: string
	fullName: string
	email: string
	phone: string
	organization: string
	login: string
	password: string
	confirm: string
}

@Component({
	selector: `mn-signup`,
	templateUrl: '/partials/register.html'
})
export default class SignUpForm {
	registerInfo: RegisterInfo
	constructor(private http: Http, private _router: Router) {
		this.registerInfo = {
			firstName: '',
			lastName: '',
			fullName: '',
			email: '',
			phone: '',
			organization: '',
			login: '',
			password: '',
			confirm: ''
		}
	}
	onSubmit() {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this.http.post('/users/register', JSON.stringify(this.registerInfo), {
			headers: headers
		})
		.map(res => res.json()).subscribe(
			data => {
				console.log("success", data);
				this._router.navigate(['auth/signin']);
			},
			err => console.error(err)
		)
	}
}