import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
// import {CommonModule} from '@angular/common';
// import {FormsModule} from '@angular/forms';
import {App} from './components/app.component.ts';
import ContactsModule from './components/contacts.module';
// import {provide} from '@angular/core';
import { HttpModule, JsonpModule, Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import {AppRoutes} from './components/routes';
// import {HTTP_PROVIDERS, Http} from '@angular/http';

// import {ROUTER_PROVIDERS} from './components/routes';
// import {App} from './components/index';
import {provideAuthM} from './components/auth/jwt';//'angular2-jwt';
import AuthGuard from './components/auth/guard';
import {Logger, ConsoleLogService} from './services/LogService';
import {UserResolver} from './components/profile-form';
import {Navbar} from './components/navbar';
import {UserArea} from './components/user-area';


@NgModule({
	imports: [
		BrowserModule,
		ContactsModule,
		HttpModule,
		JsonpModule,
		RouterModule.forRoot(AppRoutes)
	],
  	declarations: [ Navbar, App ],
  	bootstrap:    [ App ],
  	providers: [
  		AuthGuard,
  		UserResolver,
  		{
			provide: Logger,
    		useClass: ConsoleLogService
 		},
 		provideAuthM()
  	]
})
export default class AppModule {}