import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import LoginModule from './login.module.ts';
import UnauthPage from './components/unauth';

require('./vendor/css/bootstrap.min.css');
require('./vendor/css/flat-ui.min.css');

platformBrowserDynamic().bootstrapModule(LoginModule);
// bootstrap(UnauthPage, [    
//     HTTP_PROVIDERS,
//     ROUTER_PROVIDERS,
//     disableDeprecatedForms(),
//   	provideForms(),
//   	provide(AuthHttp, {
//       	useFactory: (http) => {
//         	return new AuthHttp(new AuthConfig({
//         	  	tokenName: 'auth-token'
//         	}), http);
//       	},
//     	deps: [Http]
//     })
// ]).catch((error: Error) => console.error(error));
