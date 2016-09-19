import {Component} from '@angular/core';
import {Router} from '@angular/router';
import UserService from '../services/UserService';


@Component({
    selector: "app",
    template: require('./index.html')
})
export class App {
    constructor(private _userService: UserService) { }
    onLogout() {
        this._userService.logout();
    }
}
