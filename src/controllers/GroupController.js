import BaseController from './BaseController';
import mongoose from 'mongoose';
import mv from 'mv';
import path from 'path';
import fs from 'fs';
import * as uuid from 'node-uuid';
import * as _ from 'lodash';

class GroupController extends BaseController {
	constructor(...args) {
		super(...args);
	}
	beforeCreate(req, res, params) {
		params['owner'] = req.user._id;
		return params;
	}
	beforeUpdate(req, res, params) {
		params['owner'] = req.user._id;
		return params;
	}
	readFilter(req, res, params) {
		params.owner = req.user._id;
		return params; 
	}
}


module.exports.GroupController = GroupController;