import {Component, Input, Output, OnInit, OnChanges, HostBinding, Injectable, EventEmitter, Directive, ElementRef, AfterViewInit, AfterViewChecked} from '@angular/core';
import * as cropperjs from 'cropperjs';
declare var $:JQueryStatic;

@Directive({
	selector: 'img[cropped]',
	outputs: ['cropApply'],
})
export class CroppedImage {
	_element: ElementRef;
	cropper: cropperjs.Cropper;
	$previewContainer: any;
	$previewImage: any;
	$applyButton: any;
	src: string;
	url: string;
	active: boolean = false;
	cropApply: EventEmitter<Blob>;
	constructor(private _ref: ElementRef) {
		this._element = _ref;
		this.cropper = null;		
		this.src = '';
		this.cropApply = new EventEmitter<Blob>();
		setTimeout(() => {
			this.$previewContainer = $('.preview-container');
			this.$applyButton = $('.crop-apply-btn');

			this.$applyButton.click(() => {
				debugger;
				this.onCropApply();
			})
		})	
	}
	onCrop(e) {
		var data = e.detail;
	}
	imageToBlob(type="image/png", quality=1): Blob {
		let canvas = this.cropper.getCroppedCanvas();
		var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]),
        len = binStr.length,
        arr = new Uint8Array(len);

	    for (var i=0; i<len; i++ ) {
	    	arr[i] = binStr.charCodeAt(i);
	    }

	    return new Blob([arr], {type: type || 'image/png'});
	}
	onCropApply() {
		this.cropApply.emit(this.imageToBlob());
	}
	@Input('srcUrl') set imageUrl(url: string) {
		if (!this.active && this.$previewContainer) {
			this.active = true;
			let $container = $(".cropper-container");
			$container.children().remove();
			let $wizard = $("<img class='cropper-wizard'>");
			this.$previewImage = this.$previewContainer;
			$wizard.attr('src', url);
			let $$wizardEl = $wizard.eq(0)[0];
			$container.append($wizard);
			setTimeout(() => {
				this.cropper = new cropperjs($$wizardEl, {
					aspectRatio: 3/4,
					preview: '.preview-container',
					crop: this.onCrop
				});
			})
		} else if (url && this.active) {
			this.cropper.replace(url);	
		}
	}
}