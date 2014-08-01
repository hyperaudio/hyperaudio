var fs = require('fs');
var youtubedl = require('youtube-dl');
var path = require('path');
var http = require('http');

var passport = require('passport');
var mongoose = require('mongoose');

var uuid = require("node-uuid");
var urlSafeBase64 = require('urlsafe-base64');

var MediaObject = require('./models/mediaObject');
var Transcript = require('./models/transcript');
var Metadata = require('./models/metadata');


// FIXME: rename to ensureUsername
function ensureOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    var owner = (req.params.user)?req.params.user:req.body.owner;
    if (req.user.username != owner) {
      res.status(403);
      res.send({
        error: 'Forbidden'
      });
      return;
    }
    return next();
  } else {
    res.status(401);
    res.send({
      error: 'Unauthorized'
    });
    return;
  }
}

module.exports = function(app, nconf) {

  app.get('/v1/:user?/media', function(req, res) {
    if (req.params.user) {
      var query = {
        owner: req.params.user
      };
      if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

      return MediaObject.find(query, function(err, mediaObjects) {
        return res.send(mediaObjects);
      });
    }

    var query = {};
    if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

    return MediaObject.find(query, function(err, mediaObjects) {
      return res.send(mediaObjects);
    });
  });

  app.get('/v1/:user?/media/tags', function(req, res) {

    if (req.params.user) {
      var query = {
        owner: req.params.user
      };
      if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

      return MediaObject.distinct('tags', query, function(err, results) {
        return res.send(results);
      });
    }

    var query = {};
    if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

    MediaObject.distinct('tags', query, function(err, results) {
      return res.send(results);
    });
  });

  app.get('/v1/:user?/media/channels', function(req, res) {

    if (req.params.user) {
      var query = {
        owner: req.params.user
      };

      if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

      return MediaObject.distinct('channel', query, function(err, results) {
        return res.send(results);
      });
    }

    var query = {};
    if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

    MediaObject.distinct('channel', query, function(err, results) {
      return res.send(results);
    });
  });

  //todo better version of this
  var noNull = function (list) {
    var _list = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i] != null) _list.push(list[i]);
    }
    return _list;
  }

  // TODO ignore transcriptless channels
  app.get('/v1/:user?/transcripts/channels', function(req, res) {
    if (req.params.user) {
      var query = {
        owner: req.params.user
      };
      if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);


      return MediaObject.distinct('channel', query, function(err, results) {
        results.sort();
        return res.send(noNull(results));
      });
    }

    var query = {};
    if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

    MediaObject.distinct('channel', query, function(err, results) {
      results.sort();
      return res.send(noNull(results));
    });
  });

  app.get('/v1/:user?/media/tags/notag', function(req, res) {

    if (req.params.user) {
      var query = {
        owner: req.params.user,
        $or: [{tags: []}, {tags: { $exists: false }}]
      };

      if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

      return MediaObject.find(query, function(err, mediaObjects) {
        return res.send(mediaObjects);
      });
    }
    var query = {
      $or: [{tags: []}, {tags: { $exists: false }}]
    };

    if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

    return MediaObject.find(query,function(err, mediaObjects) {
      return res.send(mediaObjects);
    });
  });

  app.get('/v1/:user?/media/channels/nochannel', function(req, res) {

    if (req.params.user) {
      var query = {
        owner: req.params.user,
        $or: [{channel: null}, {channel: { $exists: false }}]
      };

      if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

      return MediaObject.find(query, function(err, mediaObjects) {
        return res.send(mediaObjects);
      });
    }
    var query = {
      $or: [{channel: null}, {channel: { $exists: false }}]
    };

    if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

    return MediaObject.find(query,function(err, mediaObjects) {
      return res.send(mediaObjects);
    });
  });

  app.get('/v1/:user?/media/tags/:tag', function(req, res) {

    if (req.params.user) {
      var query = {
        owner: req.params.user,
        tags: { $in: [req.params.tag] }
      };

      if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

      return MediaObject.find(query, function(err, mediaObjects) {
        return res.send(mediaObjects);
      });
    }
    var query = {
      tags: { $in: [req.params.tag] }
    };

    if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

    return MediaObject.find(query,function(err, mediaObjects) {
      return res.send(mediaObjects);
    });
  });

  app.get('/v1/:user?/media/channels/:channel', function(req, res) {

    if (req.params.user) {
      var query = {
        owner: req.params.user,
        channel: req.params.channel
      };

      if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

      return MediaObject.find(query, function(err, mediaObjects) {
        return res.send(mediaObjects);
      });
    }
    var query = {
      channel: req.params.channel
    };

    if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

    return MediaObject.find(query,function(err, mediaObjects) {
      return res.send(mediaObjects);
    });
  });


  var transcriptsOf = function (mediaObjects, transcripts, res, user, type) {
    if (mediaObjects.length == 0) {
      // transcripts.sort();
      return res.send(transcripts);
    }

    var mediaObject = mediaObjects.pop();
    //return Transcript.find(query).select('-meta -content').exec(function(err, transcripts) {
        // return res.send(transcripts);
      // });
    var query = {
      media: mediaObject
    };

    if (user) query.owner = user;

    if (type) query.type = type;

    Transcript.find(query)
    .select('-meta -content')
    .exec(function(err, _transcripts) {
       return transcriptsOf(mediaObjects, transcripts.concat(_transcripts), res, user, type);
       // return transcripts.concat(JSON.parse(JSON.stringify(_transcripts)));
       // return _transcripts;
    });
  };

  app.get('/v1/:user?/transcripts/channels/nochannel', function(req, res) {

      var query = {
        $or: [{channel: null}, {channel: { $exists: false }}]
      };

      if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

      MediaObject.find(query, function(err, mediaObjects) {
        var _mediaObjects = [];
        for (var i = 0; i < mediaObjects.length; i++) {
          _mediaObjects.push(mediaObjects[i]._id);
        }
        return transcriptsOf(_mediaObjects, [], res, req.params.user, req.query.type);
      });
  });

  app.get('/v1/:user?/transcripts/channels/:channel', function(req, res) {

      var query = {
        channel: req.params.channel
      };

      if (req.headers.host.indexOf('api') > 0) query.namespace = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

      MediaObject.find(query, function(err, mediaObjects) {
        var _mediaObjects = [];
        for (var i = 0; i < mediaObjects.length; i++) {
          _mediaObjects.push(mediaObjects[i]._id);
        }
        return transcriptsOf(_mediaObjects, [], res, req.params.user, req.query.type);
      });
  });


  app.get('/v1/:user?/media/:id', function(req, res) {


    return MediaObject.findById(req.params.id).exec(function(err, mediaObject) {
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

  app.get('/v1/:user?/media/:id/transcripts', function(req, res) {


    // return MediaObject.findById(req.params.id).populate('transcripts').exec(function(err, mediaObject) {
    //   if (!err) {
    //     return res.send(mediaObject);
    //   }

    //   res.status(404);
    //   res.send({
    //     error: 'Not found'
    //   });
    //   return;
    // });

    var query = {
      media: req.params.id
    };

    return Transcript.find(query, function(err, transcripts) {
       return res.send(transcripts);
    });

  });


  app.get('/v1/:user?/media/:id/meta/:meta', function(req, res) {

    return MediaObject.findById(req.params.id).populate('meta', req.params.meta).exec(function(err, mediaObject) {
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

  app.put('/v1/:user?/media/:id', ensureOwnership, function(req, res) {
    var owner = (req.params.user)?req.params.user:req.body.owner;

    return MediaObject.findById(req.params.id, function(err, mediaObject) {

      if (mediaObject.owner != req.user.username) {
        res.status(403);
        res.send({
          error: 'Forbidden'
        });
        return;
      }

      var label = req.body.label;
      if (!label || label == "") {
        label = "Empty label";
      }

      var ns = null;
      if (req.headers.host.indexOf('api') > 0) ns = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

      mediaObject.label = label;
      mediaObject.desc = req.body.desc;
      mediaObject.type = req.body.type;
      mediaObject.owner = owner;
      mediaObject.namespace = ns;
      mediaObject.source = req.body.source;
      mediaObject.tags = req.body.tags;
      mediaObject.channel = req.body.channel;

      return mediaObject.save(function(err) {
        if (!err) {
          return res.send(mediaObject);
        }

        res.status(500);
        return res.send({
          error: err
        });
      });
    });
  });

  app.post('/v1/:user?/media', ensureOwnership, function(req, res) {
    var owner = (req.params.user)?req.params.user:req.body.owner;

    var metaId = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));
    req.body.meta['_id'] = metaId;
    console.log(req.body.meta);
    var metadata = new Metadata(req.body.meta);

    var label = req.body.label;
    if (!label || label == "") {
      label = "Empty label";
    }

    var ns = null;
    if (req.headers.host.indexOf('api') > 0) ns = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);

    var mediaObject;
    mediaObject = new MediaObject({
      _id: urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0)),
      label: label,
      desc: req.body.desc,
      type: req.body.type,
      owner: owner,
      namespace: ns,
      meta: metaId,
      source: req.body.source,
      tags: req.body.tags,
      channel: req.body.channel
    });

    metadata.save(function(err) {
      if (err) {
        res.status(500);
        return res.send({
          error: err
        });
      }
    });

    mediaObject.save(function(err) {
      if (err) {
        res.status(500);
        return res.send({
          error: err
        });
      }
    });

    // download and probe (probe is next in queue from download)
    // client.use("download", function(err, tubename) {
    //   if (err) throw err;

    //   client.put(1, 0, 0, JSON.stringify(['download', {
    //     type: "media",
    //     payload: {
    //       media: mediaObject,
    //       meta: metadata
    //     }
    //   }]), function(err, jobid) {
    //     if (err) throw err;
    //   });

    // });


    return res.send(mediaObject);
  });

  app.delete('/v1/:user?/media/:id', function(req, res) {
    var owner = (req.params.user)?req.params.user:req.body.owner;

    return MediaObject.findById(req.params.id, function(err, mediaObject) {
      return mediaObject.remove(function(err) {
        if (mediaObject.owner != req.user.username) {
          res.status(403);
          res.send({
            error: 'Forbidden'
          });
          return;
        }
        if (!err) {
          console.log("removed");
          return res.send('')
        }
        res.status(500);
        return res.send({
          error: err
        });
      });
    });
  });

  app.get('/v1/about', function(req, res) {
    var url = req.query.url;
    var request = http.get("http://www.google.com/images/srpr/logo4w.png", function (response) {
        console.log("Response headers:", response.headers);
        var data = '';

        response.destroy();
        res.send(response.headers);

        response.on("data", function (chunk) {
            console.log("received data chunk: ", chunk);
            data += chunk;
        });

        response.on('end', function() {
          console.log("data: ", chunk);
          // res.send(data);
        });
    });
  });

};
