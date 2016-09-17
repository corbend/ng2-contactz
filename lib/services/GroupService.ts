import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {AuthHttp} from '../components/auth/jwt';
import {Group} from '../models/Group';

interface GroupSearchParams {
	name: string
}

@Injectable()
export class GroupService {
	constructor(private _http: Http, private _authHttp: AuthHttp) {}
	getAll() {
		return this._authHttp.get('/groups').map(res => res.json())
	}
	create(group: Group) {
		let headers = new Headers(); headers.append('Content-Type', 'application/json');
		console.log("save new category", group);
		return this._authHttp.post('/groups/create', JSON.stringify(group), {headers})
			.map(res => res.json())
	}
	update(group: Group) {
		console.log("UPDATE", group);
		let headers = new Headers(); headers.append('Content-Type', 'application/json');		
		return this._authHttp.put('/groups/' + group._id, JSON.stringify(group), {headers})
			.map(res => res.json())
	}
	delete(group: Group) {
		return this._authHttp.delete('/groups/remove/' + group._id)
			.map(res => res.json())
	}
	search(value: string) {
		let search = new URLSearchParams();
		search.set('searchBy', 'name')		
		search.set('searchValue', value)
		search.set('searchType', 'ilike')	
		return this._authHttp.get('/groups', {search})
			.map(res => res.json())
	}
}