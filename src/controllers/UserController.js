import BaseController from './BaseController';
import * as jwt from 'jsonwebtoken';
import unless from 'express-unless';
import {UnauthorizedAccessError} from '../errors';
const _ = require('lodash');
const expressjwt = require('express-jwt');
import {handleFileUpload} from '../utils/upload';

const REDIS_ACTIVE_USER_COUNT = 'active_users_count';
const TOKEN_EXPIRATION = 60;
const TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;

class jwtUtils {
	constructor(client, config) {
		this.client = client;
		this.config = config;
	}
	fetch(headers) {
		if (headers && headers.authorization) {
	        var authorization = headers.authorization;
	        var part = authorization.split(' ');
	        if (part.length === 2) {
	            var token = part[1];
	            return part[1];
	        } else {
	            return null;
	        }
	    } else {
	        return null;
		}
	}
	expire(headers) {
		var token = this.fetch(headers);

	    log.debug("Expiring token: %s", token);

    	if (token !== null) {
        	this.client.expire(token, 0);
    	}

    	return token !== null;
    }
    verify(req, res, next) {
    	log.debug("Verifying token");
    	console.log("VERIFY")
	    var token = this.fetch(req.headers);

	    jwt.verify(token, this.config.get('secret'), (err, decode) => {

	        if (err) {
	            req.user = undefined;
	            return next(new UnauthorizedAccessError("invalid_token"));
	        }

	        this.retrieve(token, (err, data) => {

	            if (err) {
	                req.user = undefined;
	                return next(new UnauthorizedAccessError("invalid_token", data));
	            }

	            req.user = data;
	            res.json(req.user);
	        });

	    });
    }
    create(user, req, res, next) {
    	log.debug("Create token");

	    if (_.isEmpty(user)) {
	        return next(new Error('User data cannot be empty.'));
	    }

	    var data = {
	        _id: user._id,
	        username: user.username,
	        fullName: user.firstName + " " + user.lastName,
	        email: user.email,
	        token: jwt.sign({ _id: user._id }, this.config.get('secret'))
	    };

	    var decoded = jwt.decode(data.token);

	    data.token_exp = decoded.exp;
	    data.token_iat = decoded.iat;

	    log.debug("Token generated for user: %s, token: %s", data.username, data.token);

	    this.client.set(data.token, JSON.stringify(data), (err, reply) => {
	        if (err) {
	            return next(new Error(err));
	        }

	        if (reply) {
	            this.client.expire(data.token, TOKEN_EXPIRATION_SEC, (err, reply) => {
	                if (err) {
	                    return next(new Error("Can not set the expire value for the token key"));
	                }
	                if (reply) {
	                    req.user = data;
	                    next(); // we have succeeded
	                } else {
	                    return next(new Error('Expiration not set on redis'));
	                }
	            });
	        }
	        else {
	            return next(new Error('Token not set in redis'));
	        }
	    });

	    return data;
    }
    retrieve(id, done) {

	    log.debug("Calling retrieve for token: %s", id);

	    if (_.isNull(id)) {
	        return done(new Error("token_invalid"), {
	            "message": "Invalid token"
	        });
	    }

	    this.client.get(id, function (err, reply) {
	        if (err) {
	            return done(err, {
	                "message": err
	            });
	        }

	        if (_.isNull(reply)) {
	            return done(new Error("token_invalid"), {
	                "message": "Token doesn't exists, are you sure it hasn't expired or been revoked?"
	            });
	        } else {
	            var data = JSON.parse(reply);
	            log.debug("User data fetched from redis store for user: %s", data.username);

	            if (_.isEqual(data.token, id)) {
	                return done(null, data);
	            } else {
	                return done(new Error("token_doesnt_exist"), {
	                    "message": "Token doesn't exists, login into the system so it can generate new token."
	                });
	            }

	        }

	    });
    }
    middleware() {
    	let f = (req, res, next) => {

	        var token = this.fetch(req.headers);

	        this.retrieve(token, (err, data) => {

	            if (err) {
	                req.user = undefined;
	                return next(new UnauthorizedAccessError("invalid_token", data));
	            } else {
	                req.user = _.merge(req.user, data);
	                next();
	            }

	        });
	    }
	    
	    f.unless = unless;

        return f;
    }
}

module.exports.jwtUtils = jwtUtils;

class UserCtrl extends BaseController {
	constructor(...args) {
		super(...args);
		this.redisClient = args[3].redis.client;
		this.authUtils = args[3].auth;
	}
	generateEmailLink() {

	}
	generatePassword() {

	}
	login(req, res, next) {
		if (this.redisClient) {
			this.redisClient.get(REDIS_ACTIVE_USER_COUNT, (err, cnt) => {
				let cmds = [
					['set', 'active_user_' + req.user.id, '', this.redisClient.print],
					['incr', REDIS_ACTIVE_USER_COUNT]
				]

				if (typeof cnt == "undefined" || cnt === null) {
					cmds.unshift(['set', REDIS_ACTIVE_USER_COUNT, 0, this.redisClient.print]);
				}

				this.redisClient.multi(cmds).exec((err) => {
					this.redisClient.get('active_users_count', (err, cnt) => {							
						if (!err) {
							res.json({success: true, user: req.user});
						} else {
							log.error(err.errors);
							next(new Error('login error'));
						}
					});						
				});
			});
		}
	}
	logout(req, res, next) {

		log.debug("LOGOUT");
		let userId = req.body.userId;
		log.info('logout', userId);

		let cmds = [
			['del', 'active_user_' + userId, this.redisClient.print],
			['decr', REDIS_ACTIVE_USER_COUNT]
		]

		this.redisClient.multi(cmds).exec((err) => {
			if (err) {
				log.error(err.errors);
				res.send({success: false, error: 'logout error'});
			}
		});

		if (this.authUtils.expire(req.headers)) {
            delete req.user;
            return res.status(200).json({
                "message": "User has been successfully logged out"
            });
			// res.redirect('/login');
        } else {
            return next(new Error("401"));
        }
	}
	register(req, res, next) {

		let info = req.body;
		console.log("register user", info, req.params);
		let needParams = ['firstName', 'lastName', 'phone', 'email', 'organization', 'login', 'password'];
		this.model.findOne({phone: info.phone, email: info.email}, (err, user) => {

			if (err) return next(err);

			if (user) {
				console.log("already registered", info);
				return next(new Error('User already exist'));
			} else {
				let params = needParams.map(x => info[x]).filter(x => x)
				console.log("create new user", info, params);
				if (params.length == needParams.length) {
					this.create(req, res, () => {   					
						res.redirect('/login');
					});
				} else {
					return next(new Error('Not all required parameters provided'));
				}
			}
		})
	}
	unregister(req, res, next) {
		let userId = req.query.userId;
		this.delete(userId, (err) => {
			if (!err) res.json({success: true});
		})
	}
	changePassword(req, res, next) {
		
		if (req.user) {
			this.getById({_id: req.user._id}, (err, user) => {
				console.log("change password", user)
				if (!err) {
					user.comparePassword(req.body.old, (err, resp) => {
						if (err) {
							res.send({
								success: false,
								error: 'Please provide correct old password to make changes'
							})
						} else {
							user.makePassword(req.body.new, (err, newPassword) => {
								if (!err) {
									console.log("change success")
									this.updateOne(req, res, next, {password: newPassword});	
								} else {
									next(err);
								}
							});
							
						}
					})
				} else {
					next(err);
				}
			}, next);
		} else {
			return next(new Error("no userId provided"));
		}
	}
	verify(req, res, next) {
		return this.authUtils.verify(req, res, next);
	}
	getProfile(req, res, next) {
		if (req.user) {
			this.getById({_id: req.user._id}, (err, user) => {
				if (!err) res.send(_.omit(user, 'password'))
				else next(err);
			})
		} else {
			next(new Error("not authorized"))
		}
	}
	authenticate (req, res, next) {

	    log.debug("Processing authenticate middleware");

	    var login = req.body.login,
	        password = req.body.password;

	    if (_.isEmpty(login) || _.isEmpty(password)) {
	        return next(new Error('Invalid username or password'));
	    }

	    process.nextTick(() => {

	        this.model.findOne({
	            email: login
	        }, (err, user) => {

	        	console.log("CHECK USER", user);
	            if (err || !user) {
	                return next(new Error('Invalid username or password'));
	            }

	            user.comparePassword(password, (err, isMatch) => {
	                if (isMatch && !err) {
	                    log.debug("User authenticated, generating token");
	                    this.authUtils.create(user, req, res, next);
	                } else {
	                    return next(new Error('Invalid username or password'));
	                }
	            });
	        });

	    });

	}
	uploadAvatar(req, res, next) {
		let userId = req.params.id;
		let rootPath = this.config.get('userFilesDir') + "/avatars";
		handleFileUpload(this.model, userId, req, res, next, 'avatarPicture', rootPath, userId + ".png", '/public/images/avatars');
	}
	registerPrimaryRoutes() {
		return [
			['get', 'verify', this.verify.bind(this)],
			['get', 'profile/current', this.getProfile.bind(this)],
			['post', 'logout', this.logout.bind(this)],			
		]
	}
	registerEndPoints() {
		return [
			['post', 'login', this.login.bind(this), this.authenticate.bind(this)],
			['post', 'register', this.register.bind(this)],
			['post', 'unregister', this.unregister.bind(this)],
			['post', ':id/change_password', this.changePassword.bind(this)],
			['post', ':id/avatar', this.uploadAvatar.bind(this)]
		]
	}
}

module.exports.UserController = UserCtrl;