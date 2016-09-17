import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: "mn-bootstrap-nav",      
    // directives: [...ROUTER_DIRECTIVES],
    templateUrl: '/partials/bootstrap-nav.html',
    inputs: ['routes', 'navs']
})
export default class BootstrapNav {
	routes: Object
	navs: Array<Object>
    constructor(private _router: Router) {  
        this.navs = []
        this.routes = {}
    }
    getLink(name) {
    	if (this.routes) {
    		return this.routes[name];
    	}
    	return '';
    }
}