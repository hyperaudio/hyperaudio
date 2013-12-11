var https = require('https');
var fs = require('fs');
var path = require('path');

module.exports = function() {
    function DownloadHandler() {
        this.type = 'emitkeys';
    }

	DownloadHandler.prototype.work = function(payload, callback) {
		console.log(payload);
	    // var request = https.get(m.url, function(response) {
// 	      	try{
// 	        	fs.mkdirSync(path.join(__dirname, 'media/' + m.owner + '/'));
// 			} catch (FIXME) {}
// 	      	
// 			var filePath = path.join(__dirname, 'media/' + m.owner + '/' + m.filename);
// 			var file = fs.createWriteStream(filePath);
// 	      
// 		  	response.pipe(file);
// 
// 	      	response.on("end", function() {
// 	        	// process.disconnect();
// 			});
//     	};
		callback('success');
	};

    var handler = new DownloadHandler();
    return handler;
};
