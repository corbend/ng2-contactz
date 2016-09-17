import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
// import {provide} from '@angular/core';
import { HttpModule, JsonpModule, Http } from '@angular/http';
import {RouterModule } from '@angular/router';
import {LoginRoutes} from './components/login.routes';
// import {HTTP_PROVIDERS, Http} from '@angular/http';

// import {ROUTER_PROVIDERS} from './components/routes';
// import {App} from './components/index';
import {provideAuthM} from './components/auth/jwt';//angular2-jwt';
import {Logger, ConsoleLogService} from './services/LogService';

import {Navbar} from './components/navbar';
import LoginPage from './components/unauth';
import SignInForm from './components/sign-in';
import SignUpForm from './components/sign-up';


@NgModule({
    imports: [ 
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        RouterModule.forRoot(LoginRoutes)
    ],
    declarations: [ Navbar, LoginPage, SignInForm, SignUpForm],
    bootstrap:    [ LoginPage ],
    providers: [
        provideAuthM()
    ]
})
export default class LoginModule {}