import {Component, Input, OnChanges} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {ContactService} from '../services/ContactService';
import TokenStore from '../services/TokenStore';

const importUrl = "/contacts/parse";

@Component({
    selector: "mn-import-csv",
    outputs: ['selectItem'],
    providers: [TokenStore],
    styles: [
        `    
            .fields-list {
                margin-top: 20px;
                position: relative;
                height: 340px;
                overflow-y: auto;
            }

            .fields-list input {
                float: left;
                margin: 10px 20px;
            }
        `
    ],
    templateUrl: '/partials/import-csv.html'
})
export class ImportCsv {
    form: any
    filenameToImport: string
    providers: Array<string>
    exportFields: Array<string>
    public uploader: FileUploader
    title: string = "Import From CSV"
	constructor(private _contactService: ContactService, private _token: TokenStore) {

        this.uploader = new FileUploader({
            url: importUrl, 
            removeAfterUpload: true,
            authToken: this._token.makeHeaders()[1]
        });

        this.form = {fields: {}};
        this.providers = [
            'Gmail'
        ]
	}
    preview() {
        this.uploader.onCompleteItem = this.onAfterPreview.bind(this);
        this.uploader.onErrorItem = this.onPreviewError.bind(this);
        this._contactService.parseFile(this.uploader);
    }
    importFile() {
        let importedFields = [];
        for (let k in this.form.fields) {
            if (this.form.fields[k]) {
                importedFields.push(k);
            }
        }
        console.log("imported fields", importedFields);
        this._contactService.importFile(this.filenameToImport, importedFields, this.form).subscribe(this.onAfterImport);
    }
    onAfterPreview(item, response, status) {
        console.log("upload ok", response);
        let resp = JSON.parse(response)
        this.filenameToImport = resp.fileName;
        this.exportFields = resp.fields;
        for (let k of this.exportFields) {
            this.form.fields[k] = true;
        }
        this.uploader.clearQueue();
    }
    onPreviewError(item, response, status) {

    }
    onAfterImport(resp) {
        console.log("upload ok");
        this.uploader.clearQueue();
    }
    onImportError(item, response, status) {
        console.log("import error");
    }

}