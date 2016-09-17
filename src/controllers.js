import BaseController from './controllers/BaseController';

import {GroupController} from './controllers/GroupController';
import {ContactsController} from './controllers/ContactsController';
import {UserController} from './controllers/UserController';


function initCtrls(app, config, initObject) {
	(new GroupController('Group', '/groups', config, initObject)).bind(app);
	(new ContactsController('Contact', '/contacts', config, initObject)).bind(app);
	(new UserController('User', '/users', config, initObject)).bind(app);
}

module.exports.initCtrls = initCtrls;