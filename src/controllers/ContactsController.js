import BaseController from './BaseController';
import mongoose from 'mongoose';
import mv from 'mv';
import path from 'path';
import fs from 'fs';
import * as uuid from 'node-uuid';
import * as multiparty from 'multiparty';
import * as csv from 'csv';
import * as async from 'async';
import * as _ from 'lodash';

var StringDecoder = require('string_decoder').StringDecoder;

class ContactsController extends BaseController {
	constructor(...args) {
		super(...args);
	}
	registerEndPoints() {
		return [
			['post', 'parse', this.parseContacts.bind(this)],
			['post', 'import', this.importFile.bind(this)],
			['post', ':id/upload', this.uploadPhoto.bind(this)]
		]
	}
	beforeCreate(req, res, params) {
		params['group'] = mongoose.Types.ObjectId(params['group']);
		params['owner'] = req.user._id;
		return params;
	}
	beforeUpdate(req, res, params) {
		params['group'] = mongoose.Types.ObjectId(params['group']);
		params['owner'] = req.user._id;
		return params;
	}
	readFilter(req, res, search, initParams) {
		search.owner = req.user._id;
		console.log("GROUP FILTER", search, initParams);
		if (initParams.searchBy == "group" && !initParams.searchValue) {
			search['group'] = {$exists: false};
		}
		return search;
	}
	parseContacts(req, res, next) {

		var tmpPath = '/tmp';
		var rootPath = path.join(tmpPath, "contactz");

		if (!fs.existsSync(rootPath)) {
			console.log("ROOT PATH NOT EXIST -> CREATE");
			fs.mkdirSync(rootPath);
		}
		
		var form = new multiparty.Form();

		form.parse(req, (err, fields, files) => {
			if (!err) {
				files.file.forEach((file, index) => {
					var fileName = "file" + uuid.v4() + ".csv";
					var pathToFile = path.join(rootPath, fileName);
					var tempPath = file.path;

					mv(tempPath, pathToFile, (err) => {
				        if (err) {
				        	next(err);
				        } else {
				        	if (index == (files.file.length - 1)) {

				        		let onRow = (row, headers) => {
				        			res.send({success: true, fileName, fields: headers});
				        		}

				        		this._parseContacts(this.getImportFilePath(fileName), onRow, () => {}, null, {
				        			limit: 2
				        		})
				        		
				        	}
				        }
				    });
				})
			} else {
				next(err);
			}
		});
	}
	_parseContacts(filePath, onRow, onComplete, onError, config) {

		let csvData = [];
		let headers = [];
		let isHeader = false;
		let csvParser = csv.parse({delimeter: ','}, (err, data) => {

			if (config && config.limit) {
				data = data.slice(0, config.limit)
			}

			async.eachSeries(data, (row, callback) => {
				console.log("TEST ROW", row);
				if (!isHeader) {
					headers = row;
					isHeader = true;
					callback();
				} else {

					let cb = () => {
						csvData.push(row);
						callback();
					}

					onRow(row, headers, cb);					
				}
			});
		})

		fs.createReadStream(filePath).pipe(csvParser)
			.on('error', function(err) {
				if (onError) {
					onError(err);
				}
			})
			.on('end', function() {
				onComplete(csvData);			
			});
	}
	mapColumns(headers, row, type) {
		if (type == "Gmail") {
			let mappedName = {
				"fullName": "Name",
				"email": "E-mail 1 - Value",
				"phone": "Phone 1 - Value",
				"address": "Address 1 - Formatted"
			}
			let columns = {
				"fullName": _.findIndex(headers, x => x == mappedName["fullName"]),
				"email": _.findIndex(headers, x => x == mappedName["email"]),			
				"phone": _.findIndex(headers, x => x == mappedName["phone"]),
				"address": _.findIndex(headers, x => x == mappedName["address"])
			}
			return {
				"fullName": row[columns["fullName"]],
				"phone": row[columns["phone"]],
				"email": row[columns["email"]],
				"address": row[columns["address"]]
			}
		}
	}
	getImportFilePath(fileName) {
		let tmpPath = "/tmp";

		//TODO - take into config
		let rootPath = path.join(tmpPath, "contactz");
		return path.join(rootPath, fileName);

	}
	importFile(req, res, next) {

		let filename = req.body.filename;
		let providerType = req.body.provider;
		console.log("IMPORT", filename, providerType);
		
		let onProcessRow = (row, headers, callback) => {
			let rowData = this.mapColumns(headers, row, providerType);
			rowData['owner'] = req.user._id;
			this.model.create(rowData, (err, resp) => {	
				if (!err) {
					callback();
				}
			});
		}

		let onError = () => {
			return res.json({"success": false, "error": "import error"})
		}

		let onComplete = (parsedData) => {
			let model = mongoose.model('ImportData');
			let dataToSave = new model();
			dataToSave.data = parsedData;
			dataToSave.save((err, success) => {
				if (err) return res.json({"success": false});
				return res.json({"success": true});
			});	
		}

		this._parseContacts(this.getImportFilePath(filename), onProcessRow, onComplete);
	}
	uploadPhoto(req, res, next) {

		let contactId = req.params.id;
		let rootPath = this.config.get('userFilesDir');

		console.log("UPLOAD", contactId, rootPath);

		if (!fs.existsSync(rootPath)) {
			fs.mkdirSync(rootPath);
		}
		
		var form = new multiparty.Form();

		form.parse(req, (err, fields, files) => {
			if (!err) {
				files.file.forEach((file, index) => {
					console.log("FILE PATH", file)
					var fileName = "file" + uuid.v4() + path.extname(file.originalFilename);
					var pathToFile = path.join(rootPath, fileName);
					var tempPath = file.path;

					mv(tempPath, pathToFile, (err) => {
				        if (err) {
				        	console.log("ERROR", err);
				        	next(err);
				        } else {
				        	if (index == (files.file.length - 1)) {
				        		this.model.findByIdAndUpdate(contactId, {
				        			photoUrl: path.join("/images", fileName)
				        		}, (err) => {
				        			if (!err) {
				        				res.json({success: true});
				        			} else {
				        				next(err)
				        			}
				        		})
				        	}
				        }
				    });
				})
			} else {
				next(err);
			}
		});
	}
}


module.exports.ContactsController = ContactsController;