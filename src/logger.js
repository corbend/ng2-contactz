import fs from 'fs';
import morgan from 'morgan';
import winston from 'winston';
import FileStreamRotator from 'file-stream-rotator';

let logging = (app, config) => {

	let logDirectory = __dirname + (config.get('http_log_dir') || '/../log');

	// ensure log directory exists
	fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

	let accessLogStream = FileStreamRotator.getStream({
	  date_format: 'YYYYMMDD',
	  filename: logDirectory + '/access-%DATE%.log',
	  frequency: 'daily',
	  verbose: false
	});

	app.use(morgan('dev', {stream: accessLogStream}));
}

let log = (config) => {
	return new (winston.Logger)({
    	transports: [
      		new (winston.transports.Console)(),
    	  	new (winston.transports.File)({ filename: config.get('DEFAULT_LOG_NAME') })
 	   	]		
	});
}

module.exports.httpLogger = logging;
module.exports.defaultLogger = log;