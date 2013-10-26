var https = require('https');
var fs = require('fs');
var path = require('path');
// var probe = require('node-ffprobe');
var cp = require('child_process');

var passport = require('passport');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var MediaObject = require('./models/mediaObject');
var Transcript = require('./models/transcript');


module.exports = function(app, nconf) {

  app.get('/:user?/media', function(req, res) {
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

  app.get('/:user?/media/:id', function(req, res) {
    return MediaObject.findById(req.params.id, function(err, mediaObject) {
      if (!err) {
        return res.send(mediaObject);
      }
      
      res.status(404);
      res.send({ error: 'Not found' });
      return;
    });
  });
  
  app.get('/:user?/media/:id/transcripts', function(req, res) {
    // var query = {
    //   // media: ObjectId.fromString(req.params.id)
    //   'Media._id': req.params.id
    // };
    // return Transcript.find(query, function(err, transcripts) {
    //   return res.send(transcripts);
    // });
    return Transcript.find(function(err, transcripts) {
      var ret = [];
      
      for(var i = 0; i < transcripts.length; i++) {
        if (transcripts[i].media == req.params.id) {
          ret.push(transcripts[i]);
        }
      }
      return res.send(ret);
    });
  });

  app.put('/:user?/media/:id', function(req, res) {
    return MediaObject.findById(req.params.id, function(err, mediaObject) {

      mediaObject.label = req.body.label;
      mediaObject.desc = req.body.desc;
      mediaObject.type = req.body.type;
      mediaObject.sort = req.body.sort;
      // mediaObject.owner = req.body.owner;
      mediaObject.meta = req.body.meta;
      
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

  app.post('/:user?/media', function(req, res) {
    var owner;
    
    if (req.params.user) {
      owner = req.params.user;
    } else {
      owner = req.body.owner;
    }
    
    var mediaObject;
    mediaObject = new MediaObject({
      label: req.body.label,
      desc: req.body.desc,
      type: req.body.type,
      sort: req.body.sort,
      owner: owner,
      meta: req.body.meta
    });

    console.log(mediaObject);

    mediaObject.save(function(err) {
      if (!err) {
        console.log("created");
      }
    });

    // download and probe
    console.log('forking ' + __dirname + '/probe.js')
    var p = cp.fork(__dirname + '/probe.js');
    p.send({
      // id: mediaObject._id,
      url: mediaObject.meta.url,
      owner: owner
    });
    p.on('message', function(m) {
      var query = {
        _id: mediaObject._id
      };
      MediaObject.findOneAndUpdate(query, {
        probe: m
      }, function(err, model) {
        console.log(err, model);
      });
    });

    return res.send(mediaObject);
  });

  app.delete('/:user?/media/:id', function(req, res) {
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
