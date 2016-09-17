
export class UnauthorizedError extends Error {
	constructor(code, error) {
		super();
		this.name = "UnauthorizedError";
		this.code = code;
		this.status = 401;
	}	
}
export class UnauthorizedAccessError extends Error {
	constructor(code, error) {
		super();
		this.name = "UnauthorizedAccessError";
		this.code = code;
		this.status = 403;
	}	
}

module.exports = {
	"UnauthorizedError": UnauthorizedError,
	"UnauthorizedAccessError": UnauthorizedAccessError
}

