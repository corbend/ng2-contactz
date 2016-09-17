import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
	templateUrl: '/partials/navbar.html',
	selector: 'tk-navbar',
	outputs: ['logoutSignal']
})
export class Navbar {
	logoutSignal: EventEmitter<boolean>
	constructor() {
		this.logoutSignal = new EventEmitter<boolean>();
	}
	sendLogout() {
		this.logoutSignal.emit(true);
	}
}