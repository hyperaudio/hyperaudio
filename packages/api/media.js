var https = require('https');
var fs = require('fs');
var path = require('path');

var passport = require('passport');


var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var MediaObject = require('./models/mediaObject');
var Transcript = require('./models/transcript');

var fivebeans = require('fivebeans');
var client = new fivebeans.client('127.0.0.1', 11300);
client.connect(function(err) {
  if (err) throw err;
});


//FIXME: duplicate
var dgram = require("dgram");
var udp = dgram.createSocket("udp4");

function cube(type, data) {
  var buffer = new Buffer(JSON.stringify({
    "type": type,
    "time": new Date().toISOString(),
    "data": data
  }));
  udp.send(buffer, 0, buffer.length, 1180, "127.0.0.1");
}

module.exports = function(app, nconf) {

  app.get('/v1/:user?/media', function(req, res) {
    cube("get_media_list", {
      user: req.params.user
    });

    if (req.params.user) {
      var query = {
        owner: req.params.user
      };
      return MediaObject.find(query, function(err, mediaObjects) {
        return res.send(mediaObjects);
      });
    }
    return MediaObject.find(function(err, mediaObjects) {
      return res.send(mediaObjects);
    });
  });

  app.get('/v1/:user?/media/:id', function(req, res) {
    cube("get_media", {
      user: req.params.user,
      id: req.params.id
    });

    return MediaObject.findById(req.params.id).populate('transcripts').exec(function(err, mediaObject) {
      if (!err) {
        return res.send(mediaObject);
      }

      res.status(404);
      res.send({
        error: 'Not found'
      });
      return;
    });
  });

  // FIXME OBSOLETE?
  // app.get('/v1/:user?/media/:id/transcripts', function(req, res) {
  //   return Transcript.find(function(err, transcripts) {
  //     var ret = [];
  //     
  //     for(var i = 0; i < transcripts.length; i++) {
  //       if (transcripts[i].media == req.params.id) {
  //         ret.push(transcripts[i]);
  //       }
  //     }
  //     return res.send(ret);
  //   });
  // });

  app.put('/v1/:user?/media/:id', function(req, res) {
    cube("put_media", {
      user: req.params.user,
      id: req.params.id
    });

    return MediaObject.findById(req.params.id, function(err, mediaObject) {

      mediaObject.label = req.body.label;
      mediaObject.desc = req.body.desc;
      mediaObject.type = req.body.type;
      // mediaObject.sort = req.body.sort;
      // mediaObject.owner = req.body.owner;
      mediaObject.meta = req.body.meta;
      mediaObject.source = req.body.source;
      // mediaObject.transcripts = req.body.transcripts;

      if (req.params.user) {
        mix.owner = req.params.user;
      } else {
        mix.owner = req.body.owner;
      }

      return mediaObject.save(function(err) {
        if (!err) {
          console.log("updated");
        }
        return res.send(mediaObject);
      });
    });
  });

  app.post('/v1/:user?/media', function(req, res) {
    var owner;

    if (req.params.user) {
      owner = req.params.user;
    } else {
      owner = req.body.owner;
    }

    cube("post_media", {
      user: owner //FIXME add media ID
    });

    var mediaObject;
    mediaObject = new MediaObject({
      label: req.body.label,
      desc: req.body.desc,
      type: req.body.type,
      // sort: req.body.sort,
      owner: owner,
      meta: req.body.meta,
      source: req.body.source //,
      // transcripts: req.body.transcripts
    });

    console.log(mediaObject);

    mediaObject.save(function(err) {
      if (!err) {
        console.log("created");
      }
    });

    // download and probe (probe is next in queue from download)
    client.use("download", function(err, tubename) {
      if (err) throw err;

      client.put(1, 0, 0, JSON.stringify(['download', {
        type: "media",
        payload: mediaObject
      }]), function(err, jobid) {
        if (err) throw err;
      });

    });


    return res.send(mediaObject);
  });

  app.delete('/v1/:user?/media/:id', function(req, res) {
    cube("delete_media", {
      user: req.params.user,
      id: req.params.id
    });

    return MediaObject.findById(req.params.id, function(err, mediaObject) {
      return mediaObject.remove(function(err) {
        if (!err) {
          console.log("removed");
          return res.send('')
        }
      });
    });
  });

};
