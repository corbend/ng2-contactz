import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Group} from '../models/Group';
import {GroupService} from '../services/GroupService';
const _ = require("lodash");

@Component({
    selector: "mn-group-list-item",
    templateUrl: '/partials/group-list-item.html',
    inputs: ['item', 'selected'],
    outputs: ['changedItem']
})
export class GroupListItem {
    item: Group;
    selected: boolean;
    changedItem: EventEmitter<any>;
    hovered: boolean = false;
    isEdit: boolean = false;
    editItem: Group;
	constructor(private _groupService: GroupService) {
        this.changedItem = new EventEmitter<any>();
	}
    acceptUpdate(updateModel: any) {

        this._groupService.update(updateModel).subscribe((res) => {
            if (res.success) {
                console.log("update success");
            }
        });
    }
    onHover() {
        this.hovered = true;
    }
    onUnhover() {
        this.hovered = false;
    }
    onEdit(event) {
        event.stopPropagation();
        this.isEdit = true;
        this.editItem = _.clone(this.item);
        this.changedItem.emit(this.editItem);
    }
    onEditDone(event) {
        event.stopPropagation();
        this.isEdit = false;
    }
    onRemove(event) {
        event.stopPropagation();
        this._groupService.delete(this.item).subscribe((res) => {
            if (res.success) {
                console.log("removed");
                this.changedItem.emit("removed");
            }
        })
    }
}