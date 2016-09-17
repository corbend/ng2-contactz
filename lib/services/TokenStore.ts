import {Injectable} from '@angular/core';
import {tokenNotExpired} from '../components/auth/jwt';

const TOKEN_KEY = "auth-token";
const HEADER_NAME = "Authorization";
const HEADER_PREFIX = "Bearer ";

@Injectable()
class TokenStore {
	store: any
	constructor() {
		this.store = window.localStorage
	}
	set(token: string) {
		this.store.setItem(TOKEN_KEY, token);
	}
	get() {
		return this.store.getItem(TOKEN_KEY);
	}
	clear() {
		this.store.removeItem(TOKEN_KEY);
	}
	makeHeaders() {
		return [HEADER_NAME, HEADER_PREFIX + this.get()];
	}
	isExpired() {
		return !tokenNotExpired(TOKEN_KEY)
	}
}

export default TokenStore