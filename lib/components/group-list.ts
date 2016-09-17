import {Component, Input, EventEmitter, OnInit, OnChanges, SimpleChange} from '@angular/core';
import {Group} from '../models/Group';
import {GroupService} from '../services/GroupService';
import {FilterService} from '../services/FilterService';


@Component({
    selector: "mn-group-list",
    outputs: ['selectItem'],
    providers: [GroupService],
    templateUrl: '/partials/group-list.html',
    styles: [
        `
            .edit-form {
                margin-bottom: 20px;
            }
        `
    ]
})
export class GroupList implements OnInit {
	items: Array<Group>;
    selectedItem: Group;
    selectItem: EventEmitter<Group>;
    newGroup: Group;
    editGroup: Group;
    createShow: boolean = false;
    editShow: boolean = false;
	constructor(private _groupService: GroupService, private _filterService: FilterService) {
		this.items = [];
        this.selectItem = new EventEmitter<Group>();
        this.newGroup = new Group();
        this.editGroup = new Group();
	}
    additionalOptions() {
        let ungroupOption = new Group();
        ungroupOption._id = '';
        ungroupOption.name = 'Ungrouped';
        return ungroupOption;
    }
    refreshData() {
        this._groupService.getAll().subscribe((items) => {
            this.items = [...items, this.additionalOptions()];
        })
    }
    search(value: string) {
        this._groupService.search(value).subscribe((items) => {
            this.items = [...items, this.additionalOptions()];
        })
    }
    onCreateShow() {
        this.createShow = true;
        this.editShow = false;
    }
    onCancelSave(event) {
        event.preventDefault();
        this.createShow = false;
    }
    onCancelUpdate(event) {
        event.preventDefault();
        this.editShow = false;
    }
    resetCreate() {
        this.newGroup = new Group();
    }
    create(group: Group) {
        this._groupService.create(group).subscribe((resp) => {
            this.refreshData();
            this.resetCreate();
            this.createShow = false;
        });
    }
    update(group: Group) {
        this._groupService.update(group).subscribe((resp) => {
            this.refreshData();
            this.editShow = false;
        });
    }
    onSelect(event, item: Group) {
        
        if (this.selectedItem != item) {
            this._filterService.selectedGroup = item;
            this.selectItem.emit(item);
            this.selectedItem = item;
        } else {
            this.selectedItem = null;
            this.selectItem.emit(null);
            this._filterService.selectedGroup = null;
        }
    }
    onChangeItem(item: Group) {
        this.editGroup = item;
        this.editShow = true;
        this.createShow = false;
    }
    ngOnInit() {
        this.refreshData();
    }
}