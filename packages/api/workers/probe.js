// var https = require('https');

var fs = require('fs');
var path = require('path');

var probe = require('node-ffprobe');

var mongoose = require('mongoose');
var Metadata = require('../models/metadata');

mongoose.connect("mongodb://localhost/hyperaudio01"); //FIXME conf

module.exports = function() {
  function ProbeHandler() {
    this.type = 'media';
  }

  ProbeHandler.prototype.work = function(payload, callback) {
    // console.log(path.join(__dirname, '../media/' + payload.media._id + '/'));

    if (payload.meta.download) {
      var folder = path.join(__dirname, '../media/' + payload.media._id + '/');


      probe(folder + payload.meta.download.filename, function(err, data) {
      	console.log(data);
        Metadata.findById(payload.meta._id).exec(function(err, metadata) {
          if (!err) {
            metadata.probe = data;
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

  };

  var handler = new ProbeHandler();
  return handler;
};
