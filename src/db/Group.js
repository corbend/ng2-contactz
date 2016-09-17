import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let schema = new Schema({
	name: String,
	owner: {type: Schema.ObjectId, ref: 'User'}
});

const Group = mongoose.model('Group', schema);

export default Group