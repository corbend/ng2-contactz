
import fs from 'fs';
import url from 'url';
import path from 'path';
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import unless from 'express-unless';
import bodyParser from 'body-parser';
import nconf from 'nconf';
import {httpLogger, defaultLogger} from './logger';
import {initDb} from './db/init';
import {initCtrls} from './controllers';
import {jwtUtils} from './controllers/UserController';
import * as err from './errors';

const expressjwt = require('express-jwt');

mongoose.Promise = Promise;

let app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

nconf.defaults({
	PORT: 8001,
	DEFAULT_LOG_NAME: 'default.log'
})

nconf.argv().env().file({file: __dirname + '/config.json'});

global.log = defaultLogger(nconf);
const lodash = require('lodash');
lodash.merge(global, err.errors);
httpLogger(app, nconf);

app.use('/public', express.static(path.join(__dirname, "../www")));
app.use('/images', express.static(nconf.get('userFilesDir')));
app.use('/avatars', express.static(path.join(nconf.get('userFilesDir'), 'avatars')));
app.use('/partials', express.static(path.join(__dirname, "../lib/partials")));

initDb(nconf, (err, initObject) => {

	console.log("SECRET", nconf.get('secret'));
	var jwtCheck = expressjwt({
    	secret: nconf.get('secret')
	});

	jwtCheck.unless = unless;

	let auth = new jwtUtils(initObject.redis.client, nconf);
	initObject.auth = auth;
	let unrestrictedUrls = ['/', '/?userId=', '/login', '/users/login', '/users/register'];

	let checkUnrestriced = (req) => {
		var ext = url.parse(req.originalUrl).pathname;
		console.log("CHECK URL", ext, url.parse(req.originalUrl), lodash);
		return unrestrictedUrls.indexOf(ext) != -1;
	}

	app.use(jwtCheck.unless(checkUnrestriced));
	app.use(auth.middleware().unless(checkUnrestriced));

	let server = http.createServer(app);

	let router = new express.Router();

	router.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, "../www/index.html"));
	});

	router.get('/login',  (req, res, next) => {
		res.sendFile(path.join(__dirname, "../www/index-login.html"));
	});

	app.use('/', router);

	initCtrls(app, nconf, initObject);

	app.use((req, res, next) => {
		res.status(404);
		return res.send("Page not found");
	});

	app.use((err, req, res, next) => {

		let status = 500;
		if (err) {
			let msg = "unexpected error";
			log.error("unexpected error", err);
			switch (err.name) {
				case "UnauthorizedError", "UnauthorizedAccessError":
					status = 400;
					msg = err.code;
					break;
				default:
					status = 500;
					msg = err.message;
            }

			res.status(status).send(msg);
		}
	})

	let PORT = nconf.get('PORT');

	server.listen(PORT, () => {
		log.info("server listen to port", PORT);
	})
});
