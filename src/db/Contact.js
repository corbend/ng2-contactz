import mongoose from 'mongoose';
	
const Schema = mongoose.Schema;

let schema = new Schema({
	fullName: String,
	phone: String,
	phones: Array,
	email: String,
	emails: Array,
	address: String,
	photoUrl: String,
	group: {type: Schema.ObjectId, ref: 'Group'},
	owner: {type: Schema.ObjectId, ref: 'User'}
})

const Contact = mongoose.model('Contact', schema);

export default Contact