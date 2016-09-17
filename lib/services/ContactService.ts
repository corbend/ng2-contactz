import {Injectable} from "@angular/core";
import {Http, Request, RequestMethod, Headers, URLSearchParams} from '@angular/http';
import {Contact} from '../models/Contact';
import {Observable, Subject} from 'rxjs/Rx';
import {AuthHttp} from '../components/auth/jwt';

@Injectable()
export class ContactService {
	constructor(private _http: Http, private _authHttp: AuthHttp) {

	}
	searchByName(name: string) {
		let search = new URLSearchParams();
		search.set('searchBy', 'fullName');
		search.set('searchValue', name);		
		return this._authHttp.get('/contacts', {search}).map(res => res.json());
	}
	searchBy(filter: any) {
		let search = new URLSearchParams();
		for (let f of filter) {
			search.set("search:" + f.type + ":" + f.field, f.value);
		}
		return this._authHttp.get('/contacts', {search}).map(res => res.json());
	}
	getAll() {
		return this._authHttp.get('/contacts').map(r => r.json());
	}
	getById(contactId: string) {
		return this._authHttp.get('/contacts/' + contactId).map(r => r.json());
	}
	getByCategory(groupId: string, userId: string="guest") {
		let search = new URLSearchParams();
		search.set('searchBy', 'group');
		search.set('searchValue', groupId);
		return this._authHttp.get('/contacts', {search}).map(res => res.json());
	}
	create(newFeed: Contact) {
		let headers = new Headers(); headers.append('Content-Type', 'application/json');
		console.log("save new feed", newFeed);
		return this._authHttp.post('/contacts/create', JSON.stringify(newFeed), {headers})
			.map(res => res.json())
	}
	delete(itemId: string) {
		console.log("removing")
		return this._authHttp.delete('/contacts/remove/' + itemId)
			.map(res => res.json())
	}
	update(feed: Contact) {
		let headers = new Headers(); headers.append('Content-Type', 'application/json');
		return this._authHttp.put('/contacts/' + feed._id, JSON.stringify(feed), {headers})
			.map(res => res.json())
	}
	parseFile(uploader: any) {
		uploader.uploadAll()
	}
	importFile(filename: string, fields: Array<string>, form: any) {
		let headers = new Headers(); headers.append('Content-Type', 'application/json');
		console.log("import", filename, form);
		let options = {filename, provider: form.provider, fields};
		return this._authHttp.post('/contacts/import', JSON.stringify(options), {headers})
			.map(res => res.json())
	}
}