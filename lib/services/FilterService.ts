import {Injectable} from "@angular/core";
import {Group} from '../models/Group';
import {Observable, Subject} from 'rxjs/Rx';

@Injectable()
export class FilterService {
	_selectedGroup: Group
	observerInfo: Subject<Object>
	constructor() {
		this._selectedGroup = new Group();
		this.observerInfo = new Subject();
	}
	set selectedGroup(value: any) {
		this._selectedGroup = value;
		this.observerInfo.next(['selectedGroup', this._selectedGroup]);
	}
	subscribe(key: string, callback) {
		this.observerInfo.subscribe((v) => {
			if (key == v[0]) {
				callback(v[1]);
			}
		});
	}
}