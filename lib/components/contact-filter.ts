import {Component, Input, Output, EventEmitter} from '@angular/core';
const _ = require('lodash');

interface Filter {
	position: number;
	field: string;
	value: string;
	isNew: boolean;
}

@Component({
	selector: 'mn-contact-filter',
	templateUrl: '/partials/contact-filter.html'
})
export default class ContactFilter {
	@Input() fields: Array<string>;
	@Output() onFilter: EventEmitter<Array<Filter>>;
	filters: Array<Filter>;
	types: Array<string>;
	isFiltered: boolean;
	constructor() {
		this.filters = [];
		this.onFilter = new EventEmitter<Array<Filter>>();

		this.types = [
			'ilike',		
			'like',
			'exact',
			'in'
		]
	}
	applyFilters() {
		if (!this.isFiltered) {
			this.onFilter.emit(this.filters);
			this.isFiltered = true;
		} else {
			this.onFilter.emit([]);
			this.isFiltered = false;
		}
	}
	createFilter() {
		let filter = {field: '', position: 0, value: '', isNew: true};
		this.filters.unshift(filter);
	}
	addFilter(item: Filter) {
		delete item.isNew;
		item.position = this.filters.length;
	}
	clearFilters() {
		this.filters = [];
		this.onFilter.emit(this.filters);
		this.isFiltered = false;
	}
	removeFilter(item: Filter) {
		_.remove(this.filters, item);
		if (this.isFiltered) {
			this.applyFilters();
		}
	}
}