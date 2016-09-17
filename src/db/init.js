import async from 'async';
import mongoose from 'mongoose';
import {EventEmitter} from 'events';
import {Redis} from './redis';
import {Group, Contact, ImportData, User} from './models';

const mongoUsername = '';
const mongoPassword = '';
const mongoHost = 'localhost';
const mongoPort = '';
const superAdminName = 'admin';


function checkAdminExist(cb) {
	let model = mongoose.model('User');

	model.find({username: superAdminName}).exec()
	.then(users => {
		log.info("admin is ok", users[0]);
		cb(null, users);
	})
	.catch(err => {log.error(err); cb(err);});
}

function getConnectionConfig(config) {

	let defCredentials = mongoUsername && (mongoUsername + ":" + mongoPassword);

	return config.get('db') || {
		connectionString: [
			'mongodb://', defCredentials || '',
			mongoHost, (mongoPort ? ":" + mongoPort: ''), "/", config.get('dbName')
		].join("")
	}
}

module.exports.initDb = (config, callback) => {
	//init models

	async.waterfall([ 
		(cb) => {
			//коннектимся к базе			
			let conStr = getConnectionConfig(config).connectionString;

			mongoose.connect(conStr);

			let cn = mongoose.connection;

			cn.on('open', function() {
				log.info("DB - ok");
				cb(null, cn);
			});

			cn.on('error', function(err) {
				log.error("DB - error");
				cb(err);
			})
		},
		(connection, cb) => {checkAdminExist(cb);},
		(_, cb) => {let r = Redis(config);	cb(null, {redis: r, mongo: _});},
		(o, cb) => {let b = new EventEmitter(); o.eventBus = b; cb(null, o);},
		(_, cb) => {
			//stub for populating db
			cb(null, _);
		}
	],	(err, result) => {

		if (err) {
			//critical error
			log.error(err);
			process.exit(1);
		}
		callback(null, result);
	})
}