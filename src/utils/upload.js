
const fs = require('fs');
const mv = require('mv');
const path = require('path');
const multiparty = require('multiparty');


module.exports = {
	handleFileUpload: (model, modelId, req, res, next, imageFieldName, savePath, fileName, fileUrl) => {

		if (!fs.existsSync(savePath)) {
			fs.mkdirSync(savePath);
		}
		
		var form = new multiparty.Form();

		form.parse(req, (err, fields, files) => {
			if (!err) {
				console.log("UPLOADED", files);
				files.data.forEach((file, index) => {

					var pathToFile = path.join(savePath, fileName);
					var tempPath = file.path;

					console.log("FILE PATH", fileName, fileUrl, savePath);
					mv(tempPath, pathToFile, (err) => {
				        if (err) {
				        	console.log("ERROR", err);
				        	next(err);
				        } else {
				        	if (index == (files.data.length - 1)) {
				        		let updateInfo = {}
				        		updateInfo[imageFieldName] = fileUrl + "/" + fileName
				        		model.findByIdAndUpdate(modelId, updateInfo, (err, result) => {
				        			if (!err) {
				        				console.log("SAVE OK", result);
				        				res.json({success: true});
				        			} else {
				        				console.log("ERROR SAVE")
				        				next(err)
				        			}
				        		})
				        	}
				        }
				    });
				})
			} else {
				next(err);
			}
		});
	}
}