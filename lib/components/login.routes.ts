// import {PLATFORM_DIRECTIVES} from "@angular/core";
// import { provideRouter, ROUTER_DIRECTIVES, RouterConfig }  from '@angular/router';

import SignInForm from './sign-in';
import SignUpForm from './sign-up';
import UnauthPage from './unauth';


export const LoginRoutes = [
	{path: '', redirectTo: '/login', pathMatch: 'full'},
	{path: 'login', redirectTo: '/auth/signin', pathMatch: 'full'},
	{path: 'auth/signin', component: SignInForm},
	{path: 'auth/signup', component: SignUpForm}
]

// export const ROUTER_PROVIDERS = [
// 	provideRouter(routes),
// 	{provide: PLATFORM_DIRECTIVES, useValue: ROUTER_DIRECTIVES, multi: true}
// ];