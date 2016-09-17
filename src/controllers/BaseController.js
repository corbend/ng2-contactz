import mongoose from 'mongoose';
import express from 'express';
import lodash from 'lodash';
import jwt from 'express-jwt';

let errHandling = (err, next) => {
	log.debug("error occured", err);
	next(err);
}

let jwtCheck = null;


class BaseController {
	constructor(modelName, rootUrl, config) {
		this.model = mongoose.model(modelName);
		this.rootUrl = rootUrl;
		this.config = config;

		if (this.config.get('secureType') == "jwt" && !jwtCheck) {
			console.log("SECRET", config.get('secret'), config);
			jwtCheck = jwt({
				secret: config.get('secret')
			})	
		}

		if (!rootUrl) {
			throw new Error("rootUrl is required parameter");
		}

	}
	registerEndPoints() {
		return [];
	}	
	registerPrimaryRoutes() {
		return [];
	}
	bind(app, options) {

		let router = express.Router();

		for (let [httpMethod, endPointName, method, middleware] of this.registerPrimaryRoutes()) {
			if (!middleware) {
				router.route("/" + endPointName)[httpMethod](method);
			} else {
				console.log("with middleware", middleware);
				router.route("/" + endPointName)[httpMethod](middleware, method);
			}
		}

		if (this.config && this.config.get('secureType') == "jwt") {
			router.use(this.rootUrl, jwtCheck);
		}

		if (!options || options.crud !== false || options.create) {
			log.info(this.rootUrl, '-> POST', typeof(this.create));
			router.post('/create', this.create.bind(this));
		}

		if (!options || options.crud !== false || options.update) {
			log.info(this.rootUrl, '-> PATCH');
			router.put('/:id', this.update.bind(this));
			router.patch('/:id', this.update.bind(this));
		}

		if (!options || options.crud !== false || options.read) {
			router.get('/', this.read.bind(this));
			router.get('/:id', this.readOne.bind(this));
		}

		if (!options || options.crud !== false || options.delete) {
			router.delete('/remove/:id', this.delete.bind(this));
		}

		let endpoints = this.registerEndPoints();

		for (let [httpMethod, endPointName, method, middleware] of endpoints) {
			console.log("add route", httpMethod, endPointName, method)
			if (!middleware) {
				router.route("/" + endPointName)[httpMethod](method);
			} else {
				console.log("with middleware", middleware);
				router.route("/" + endPointName)[httpMethod](middleware, method);
			}
		}

		log.info("bind controller", this.rootUrl)
		app.use(this.rootUrl, router);
	}
	readAll(params, callback, next) {
		console.log(this.rootUrl, "read --->", params);

		this.model.find(params || {}).exec()
			.then((rows) => callback(null, rows))
			.catch(err => errHandling(err, next))
	}
	getById(params, callback, next) {
		this.model.findOne(params).exec()
			.then((row) => {callback(null, row);})
			.catch(err => errHandling(err, next))
	}
	read(req, res, next) {

		let findParams = lodash.clone(req.query);
		let search = {};
		let fields = [];

		console.log("FIND PARAMS", findParams);

		if (findParams.searchBy && findParams.searchValue) {
			fields = [{
				type: findParams.searchType,
				field: findParams.searchBy,
				value: findParams.searchValue
			}];
		} else {
			let searchKeys = [];
			for (let f of lodash.keys(findParams)) {
				console.log("ADD FILTER", f);
				let [searchFlag, searchType, searchField] = f.split(":");
				if (searchFlag == "search") {
					fields.push({
						type: searchType,
						field: searchField,
						value: findParams[f]
					})
					searchKeys.push(f);
				}
			}

			for (let k of searchKeys) {
				delete findParams[k];
			}
		}

		console.log("FIELDS TO SEARCH", fields);

		if (fields.length > 0) {
			search['$and'] = [];
		}

		let filters = [];
		fields.forEach((f) => {
			let expression = {};
			if (f.type == "ilike") {				
				expression["$or"] = [
					{[f.field]: new RegExp(`.*${f.value}.*`)},
					{[f.field]: new RegExp(`.*${f.value}`)},
					{[f.field]: new RegExp(`${f.value}.*`)}
				];
			} else {
				expression[f.field] = f.value;
			}

			filters.push(lodash.clone(expression));
		})

		if (fields.length > 0) {
			search['$and'] = [...filters];
		} else {
			search = filters[0];
		}

		if (!search) {
			search = {};
		}

		if (this.readFilter) {
			this.readFilter(req, res, search, lodash.clone(findParams));
		}

		log.info("SEARCH", search);
		console.log("SEARCH LOG", search);

		this.readAll(search, (err, rows) => {
			res.json(rows);
		});
	}
	readOne(req, res, next) {
		this.model.findById(req.params.id).exec()
			.then((row) => {res.send(row);})
			.catch(err => errHandling(err, next))
	}
	beforeCreate(req, res, params) {
		return params;
	}
	create(req, res, next) {
		let formParams = req.body;
		formParams = this.beforeCreate(req, res, formParams);
		this.model.create(formParams || {})
			.then(rows => {log.info("created", rows); res.json({success: true});})
			.catch(err => {log.info("err", err); errHandling(err, next); })
	}
	beforeUpdate(req, res, params) {
		return params;
	}
	update(req, res, next) {
		let id = req.params.id;
		let formParams = req.body;
		formParams = this.beforeUpdate(req, res, formParams);
		log.info("update contacts", id, formParams);
		this.model.findByIdAndUpdate(id, formParams || {}, {safe: true, upsert: true})
			.then(data => {log.info("updated"); res.json({success: true});})
			.catch(err => next(err))
	}
	updateOne(req, res, next, formParams, callback) {
		let id = req.params.id;
		this.model.findByIdAndUpdate(id, formParams || {}, {safe: true, upsert: true})
			.then(data => {
				log.info("updated"); 
				if (callback) {
					callback(null, data);
				} else {
					res.send({success: true});
				}
			})
			.catch(err => next(err))
	}
	delete(req, res, next) {
		let id = req.params.id;
		console.log("delete", id);
		if (id) {
			this.model.findByIdAndRemove(id).exec()
			.then(anc => res.send({success: true}))
			.catch(err => errHandling(err, next))
		} else {
			res.send({success: false, error: 'id not provided'})
		}
	}
}

export default BaseController;