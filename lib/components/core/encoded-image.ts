import {Component, Input, Output, OnInit, OnChanges, HostBinding, Injectable, EventEmitter, Directive, ElementRef, AfterViewInit, AfterViewChecked} from '@angular/core';

@Directive({
	selector: 'input[type=file][ngModel][encoded]',
	host: {
        '(change)' : 'onInputChange($event)'
    },
    outputs: ['onEncode', 'onUrlChange']
})
export class EncodedImage {
	modelValue: any;
	onEncode: EventEmitter<string>;
	onUrlChange: EventEmitter<string>;
	url: string;
	constructor(
		//public model: NgModel,
		private _element: ElementRef) {
		this.onEncode = new EventEmitter<string>();
		this.onUrlChange = new EventEmitter<string>();
	}
    isImageFile(file) {
      if (file.type) {
        return /^image\/\w+$/.test(file.type);
      } else {
        return /\.(jpg|jpeg|png|gif)$/.test(file);
      }
    }
	onInputChange($event) {
		let files = $event.currentTarget.files;
        if (files.length > 0 && this.isImageFile(files[0])) {
        	this.createUrl(files[0]);
        } else {
        	console.log("not an image file");
        }
    }
    createUrl(file: File) {
    	if (this.url) {
            URL.revokeObjectURL(this.url); // Revoke the old one
        }
        this.url = URL.createObjectURL(file);
        this.onUrlChange.emit(this.url);
    }
}