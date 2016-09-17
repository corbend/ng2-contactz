import mongoose from 'mongoose';
	
const Schema = mongoose.Schema;

let schema = new Schema({
	user: {type: Schema.ObjectId, ref: 'User'},
	data: Object,
	provider: String
})

const ImportData = mongoose.model('ImportData', schema);

export default ImportData