import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import TokenStore from '../services/TokenStore';
import UserService from '../services/UserService';

@Component({
	selector: 'app',
	templateUrl: '/partials/welcome.html',
	providers: [TokenStore, UserService]
})
export default class LoginPage {
	sign: string
	mode: string = "signin"
	routeTitle: string
	constructor(
		private _token: TokenStore,
		private _userService: UserService,
		private _router: Router
	) {
		this._userService.getLogUser().subscribe((userInfo) => {
			window.location.href = "/?userId=" + userInfo._id;
		}, (err) => {
			this._router.navigate(["/auth/signin"]);
		})
	}
}
