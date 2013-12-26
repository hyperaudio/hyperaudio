// var https = require('https');

var fs = require('fs');
var path = require('path');

var youtubedl = require('youtube-dl');

var mongoose = require('mongoose');
var Metadata = require('../models/metadata');

mongoose.connect("mongodb://localhost/hyperaudio01"); //FIXME conf

module.exports = function() {
  function DownloadHandler() {
    this.type = 'media';
  }

  DownloadHandler.prototype.work = function(payload, callback) {
    console.log(payload);
    console.log(path.join(__dirname, '../media/' + payload.media._id + '/'));

    if (payload.media.source.youtube) {
      var folder = path.join(__dirname, '../media/' + payload.media._id + '/');
      try{
        fs.mkdirSync(folder);
      } catch (ignored) {}

      var dl = youtubedl.download(payload.media.source.youtube.url,
        folder,
        ['--max-quality=18', '-o %(epoch)s-%(id)s.%(ext)s']);

      dl.on('download', function(data) {
        console.log('filename: ' + data.filename);
        console.log('size: ' + data.size);
      });

      dl.on('error', function(err) {
        // throw err;
        console.log(err);
        callback('bury');
      });

      dl.on('end', function(data) {
        console.log(data);

        Metadata.findById(payload.meta._id).exec(function(err, metadata) {
          if (!err) {
            metadata.download = data;
            metadata.save(function(err) {
              if (!err) {
                callback('success');
              } else {
                console.log(err);
                callback('bury');
              }
            });
          } else {
            console.log(err);
            callback('bury');
          }
        });

      });

    } else {
      callback('bury');
    }

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


  };

  var handler = new DownloadHandler();
  return handler;
};
