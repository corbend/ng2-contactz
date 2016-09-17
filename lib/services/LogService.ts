import {Injectable} from '@angular/core';

interface ILogger {
	debug(...args: any[]): void
	warn(...args: any[]): void
	error(...args: any[]): void
	info(...args: any[]): void
}

export class Logger implements ILogger {
	debug(...args: any[]) {}
	warn(...args: any[]) {}
	error(...args: any[]) {}
	info(...args: any[]) {}
}

@Injectable() 
export class ConsoleLogService implements ILogger {
	logger: any
	constructor() {
		this.logger = console;
	}
	info(...args: any[]) {
		this.logger.log(...args);
	}
	error(...args: any[]) {
		this.logger.error(...args)
	}
	warn(...args: any[]) {
		this.logger.warn(...args)
	}
	debug(...args: any[]) {
		this.logger.debug(...args);
	}
}