import {Injectable} from "@angular/core";
import {Http, Request, RequestMethod, Headers} from '@angular/http';
import {Router, ActivatedRoute} from '@angular/router';
import {User} from '../models/User';
import {Observable, Subject, BehaviorSubject} from 'rxjs/Rx';
import {AuthHttp} from '../components/auth/jwt';
import TokenStore from './TokenStore';

@Injectable()
export default class UserService {
	loggedUser: User
	infoObject: Object
	_loggedStatus: BehaviorSubject<User>
	observerInfo: Subject<Object>
	constructor(private _http: Http,
		private _router: Router,
		private _authHttp: AuthHttp,
		private _token: TokenStore) {
		this.observerInfo = new Subject();
		this._loggedStatus = new BehaviorSubject<User>(null);
		this.infoObject = {};
	}
	set(key: string, value: any) {
		this.infoObject[key] = value;
		this.observerInfo.next([key, this.infoObject]);		
	}
	get(key: string) {
		return this.infoObject[key];
	}
	check(key, cb) {
		this.observerInfo.subscribe((v) => {
			if (key == v[0]) {
				cb(v[1]);
			}
		});
	}
	isLoggedIn() {
        
        if (this.loggedUser) {
            this._loggedStatus.next(this.loggedUser)
        } else {
            this.getLogUser().subscribe((data) => {
                console.log("verified", data);
                this.loggedUser = data;
                this._loggedStatus.next(this.loggedUser)
            }, (error) => {
                console.log("AUTH ERROR", error);
                window.location.href = "/login"
            });
        }

        return this._loggedStatus
	}
	getCurUser() {
		return this.loggedUser;
	}
	getCurUserProfile() {
		return this._authHttp.get(`/users/profile/current`).map(res => res.json());
	}
	getLogUser() {
		let r = this._authHttp.get('/users/verify').map(res => res.json())
		r.subscribe(() => {}, resp => {
			console.log(resp);
		})
		return r;
	}
	logout() {
		return this._authHttp.post('/users/logout', '{}').subscribe(() => {
			this._token.clear();
			this.loggedUser = null;
			this._loggedStatus.next(null);
			window.location.href = "/login";
		});
	}
	findById(userId: string, callback) {
		this._http.get('/users/' + userId)
		.map(res => res.json())
		.subscribe(
			data => { console.log(data); callback(data) },
			err => console.error(err)
		)
	}
	find(params: {search: string, value: string}) {		

		return this._http.request(new Request({
			url: '/users',
			method: RequestMethod.Get,
			search: `searchBy=${params.search}&searchValue=${params.value}`
		}));
	}
	showProfile(userId: string) {
		this._router.navigate(['Profile', {userId: userId}]);
	}
	update(userId, data: User, callback) {
		//update profile
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this._authHttp.put(`/users/${userId}`, JSON.stringify(data), { headers })
		.map(res => res.json()).subscribe(
			data => { console.log(data); callback(data) },
			err => console.error(err)
		)
	}
	changePass(userId, password, callback) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this._authHttp.post(`/users/${userId}/change_password`,
			JSON.stringify(password), { headers })
			.map(res => res.json()).subscribe(
			data => { console.log(data); callback(data) },
			err => console.error(err)
		)
	}
	delete(currentUserId: string, callback) {
		//delete profile
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this._authHttp.delete(`/users/${currentUserId}`, { headers })
		.map(res => res.json()).subscribe(
			data => { console.log(data); callback(data) },
			err => console.error(err)
		)
	}
}
