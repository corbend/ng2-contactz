import {Component} from '@angular/core';
import {Router} from '@angular/router';
import UserService from '../services/UserService';

//import {Navbar} from './navbar';
// import UserService from '../services/UserService';
// import TokenStore from '../services/TokenStore';
// import AuthGuard from './auth/guard';
// let services = [UserService, TokenStore];

@Component({
    selector: "app",
    //directives: [Navbar],
    //providers: [...services],
    template: require('./index.html')
})
export class App {
    constructor(private _userService: UserService) { }
    onLogout() {
        this._userService.logout();
    }
}
