import {Injectable} from "@angular/core";
import {CanActivate} from "@angular/router";
import {tokenNotExpired} from "./jwt";

@Injectable()
export default class AuthGuard implements CanActivate {

	canActivate() {
		return tokenNotExpired('auth-token');
	}
}
