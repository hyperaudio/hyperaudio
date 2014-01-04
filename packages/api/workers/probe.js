var sync = require('synchronize');

var fs = require('fs');
var path = require('path');

var probe = require('node-ffprobe');
var ffmpeg = require('fluent-ffmpeg');

var uuid = require("node-uuid");
var urlSafeBase64 = require('urlsafe-base64');

var mongoose = require('mongoose');
var Metadata = require('../models/metadata');
var Transcript = require('../models/transcript');

var mime = require('mime');
var mmm = require('mmmagic');
var Magic = mmm.Magic;
var magic = new Magic(mmm.MAGIC_MIME_TYPE);

var container = {probe: probe};
sync(magic, 'detectFile');
sync(container, 'probe');

mongoose.connect("mongodb://localhost/hyperaudio01"); //FIXME conf

/////
function getM4A(probeData) {

  var results = [];

  for (var i in probeData) {
    var files = probeData[i].files;
    var info = probeData[i].info;

    for (var j in files) {
      var file = files[j].file;
      var ext = file.split('.').pop();
      var type = files[j].type;
      var meta = files[j].meta;

      //m4a
      if (meta && ext == 'm4a') {
        results.push(files[j]);
      }

    }
  }

  return results;
}


function getVideo(probeData) {

  var results = [];

  for (var i in probeData) {
    var files = probeData[i].files;
    var info = probeData[i].info;

    for (var j in files) {
      var file = files[j].file;
      var ext = file.split('.').pop();
      var type = files[j].type;
      var meta = files[j].meta;

      //video, FIXME assuming only one stream
      if (meta && meta.streams[0].codec_type == "video") {
        results.push(files[j]);
      }
    }
  }

  return results;
}


function getAudio(probeData) {

  var results = [];

  for (var i in probeData) {
    var files = probeData[i].files;
    var info = probeData[i].info;

    for (var j in files) {
      var file = files[j].file;
      var ext = file.split('.').pop();
      var type = files[j].type;
      var meta = files[j].meta;

      //video, FIXME assuming only one stream
      if (meta && meta.streams[0].codec_type == "audio") {
        results.push(files[j]);
      }
    }
  }

  return results;
}
/////

module.exports = function() {
  function ProbeHandler() {
    this.type = 'media';
  }

  ProbeHandler.prototype.work = function(payload, callback) {
    console.log(path.join(__dirname, '../media/' + payload.media._id + '/'));

    if (payload.meta.download) {
      var folder = path.join(__dirname, '../media/' + payload.media._id + '/');

      sync.fiber(function(){

      //TODO sync this and put into the file list
      var screenshot = function(folder, file) {
        try {
          var proc = new ffmpeg({
            source: folder + file
          }).withSize('150x100').takeScreenshots({
            count: 2,
            timemarks: ['50%', '75%'],
            filename: '%b_screenshot_%w_%i'
          }, folder, function(err, filenames) {
            console.log(filenames);
          });
        } catch (ignored) {}
      }

		  var files = fs.readdirSync(folder);
		  console.log(files);
		  var map = {};

		  var fileMetadata = function (file) {
		    var fmeta = {};
		    fmeta.type = magic.detectFile(folder + file);
		    var ext = mime.extension(fmeta.type);

		    if (file.indexOf('unknown_video') > 0) {
		      fs.renameSync(path.join(folder, file), path.join(folder, file.replace('unknown_video', ext)));
		    }


		    fmeta.file = file;
		    if (fmeta.type.indexOf('audio') == 0 || fmeta.type.indexOf('video') == 0 || fmeta.type.indexOf('application/octet-stream') == 0) {
		      try {
		        var fp = container.probe(folder + file);
		        fmeta.meta = fp;
            screenshot(folder, file);
		      } catch (ignored) {}
		    }
		    return fmeta;
		  };

		  for (f in files) {
		    var file = files[f];
		    if (file.indexOf('00') != 0) continue;

		    var key = file.split('.')[0];

		    if (!map[key]){
		      map[key] = {
		        files: []
		      };
		    }

		    if (file.indexOf('info.json') > 0) {
		      map[key]['info'] = require(folder + file);
		    } else {
		      map[key]['files'].push(fileMetadata(file));
		    }
		  }

		  // transcript
      try{
        if (map['00001'].info.subtitles.en) {
          var transcript = new Transcript({
            _id: urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0)),
            label: 'Subtitles for ' + payload.label,
            desc: '',
            type: 'srt',
            owner: payload.owner,
            meta: {},
            content: map['00001'].info.subtitles.en,
            media: payload._id
          });


          transcript.save(function(err) {
            if (!err) {
              console.log("created");
            }
          });
      } catch (ignored) {}

      // metadata
		  Metadata.findById(payload.meta._id).exec(function(err, metadata) {
          if (!err) {

            metadata.probe = map;
            metadata.video = getVideo(map);
            metadata.audio = getAudio(map);
            metadata.m4a = getM4A(map);

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

		// callback('success');

      // probe(folder + payload.meta.download.filename, function(err, data) {
      // 	console.log(data);
      //   Metadata.findById(payload.meta._id).exec(function(err, metadata) {
      //     if (!err) {
      //       metadata.probe = data;
      //       metadata.save(function(err) {
      //         if (!err) {
      //           callback('success');
      //         } else {
      //           console.log(err);
      //           callback('bury');
      //         }
      //       });
      //     } else {
      //       console.log(err);
      //       callback('bury');
      //     }
      //   });
      // });

    } else {
      callback('bury');
    }

  };

  var handler = new ProbeHandler();
  return handler;
};
