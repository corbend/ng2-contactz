// import {provide} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
// import {disableDeprecatedForms, provideForms } from '@angular/forms';
// import {HTTP_PROVIDERS, Http} from '@angular/http';
// import {ROUTER_PROVIDERS} from './components/routes';
// import {App} from './components/index';
// import {AuthConfig, AuthHttp} from 'angular2-jwt';
// import AuthGuard from './components/auth/guard';
// import {Logger, ConsoleLogService} from './services/LogService';
import AppModule from './app.module';

require('./vendor/css/bootstrap.min.css');
require('./vendor/css/flat-ui.min.css');
require('./vendor/css/cropper.min.css');

platformBrowserDynamic().bootstrapModule(AppModule);
// bootstrap(App, [    
//     HTTP_PROVIDERS,
//     {  
//       provide: Logger,
//       useClass: ConsoleLogService
//     },
//     AuthGuard,
//     disableDeprecatedForms(),
//   	provideForms(),
//   	provide(AuthHttp, {
//       	useFactory: (http) => {
//         	return new AuthHttp(new AuthConfig({
//         	  	tokenName: 'auth-token'
//         	}), http);
//       	},
//     	deps: [Http]
//     }),
//     ROUTER_PROVIDERS
// ]).catch((error: Error) => console.error(error));
