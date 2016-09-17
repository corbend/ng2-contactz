import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

let Contact = new Schema({
	userId: {type: mongoose.Schema.ObjectId, ref: 'User'},
	firstName: String,
	lastName: String,
	email: String,
	joined: Date,
	status: String,
	invite: Boolean
})

let schema = new Schema({
	firstName: String,
	lastName: String,
	password: String,
	nickname: String,
	email: String,
	phone: String,
	status: String,
	organization: String,
	joined: Date,
	contacts: [Contact],
    avatarPicture: String
})

schema.pre('save', function(next) {

	if (!this.joined) this.joined = new Date();

	var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }

})

schema.methods.makePassword = function(password, cb) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return cb(err);
        }
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                return cb(err);
            }
            cb(null, hash);
        });
    });
}

schema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


const User = mongoose.model('User', schema);

export default User