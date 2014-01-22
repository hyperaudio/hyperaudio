var fs = require('fs');

var passport = require('passport');
var mongoose = require('mongoose');

var uuid = require("node-uuid");
var urlSafeBase64 = require('urlsafe-base64');

var MediaObject = require('./models/mediaObject');
var Transcript = require('./models/transcript');
var Metadata = require('./models/metadata');

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

  app.get('/v1/:user?/media/tags/notag', function(req, res) {
    cube("get_media_by_tag", {
      user: req.params.user
    });
    if (req.params.user) {
      var query = {
        owner: req.params.user,
        $or: [{tags: []}, { '$exists': false }]
      };
      return MediaObject.find(query, function(err, mediaObjects) {
        return res.send(mediaObjects);
      });
    }
    var query = {
      $or: [{tags: []}, { '$exists': false }]
    };
    return MediaObject.find(query,function(err, mediaObjects) {
      return res.send(mediaObjects);
    });
  });

  app.get('/v1/:user?/media/tags/:tag', function(req, res) {
    cube("get_media_by_tag", {
      user: req.params.user
    });
    if (req.params.user) {
      var query = {
        owner: req.params.user,
        tags: { $in: [req.params.tag] }
      };
      return MediaObject.find(query, function(err, mediaObjects) {
        return res.send(mediaObjects);
      });
    }
    var query = {
      tags: { $in: [req.params.tag] }
    };
    return MediaObject.find(query,function(err, mediaObjects) {
      return res.send(mediaObjects);
    });
  });

  app.get('/v1/:user?/media/:id', function(req, res) {
    cube("get_media", {
      user: req.params.user,
      id: req.params.id
    });

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
    cube("get_media", {
      user: req.params.user,
      id: req.params.id
    });

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
    cube("get_meta", {
      user: req.params.user,
      id: req.params.id
    });

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

    cube("put_media", {
      user: owner,
      id: req.params.id
    });

    return MediaObject.findById(req.params.id, function(err, mediaObject) {

      if (mediaObject.owner != req.user.username) {
        res.status(403);
        res.send({
          error: 'Forbidden'
        });
        return;
      }

      mediaObject.label = req.body.label;
      mediaObject.desc = req.body.desc;
      mediaObject.type = req.body.type;
      mediaObject.owner = owner;
      mediaObject.source = req.body.source;
      mediaObject.tags = req.body.tags;

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

    cube("post_media", {
      user: owner //FIXME add media ID
    });

    var metaId = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));
    req.body.meta['_id'] = metaId;
    console.log(req.body.meta);
    var metadata = new Metadata(req.body.meta);

    var mediaObject;
    mediaObject = new MediaObject({
      _id: urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0)),
      label: req.body.label,
      desc: req.body.desc,
      type: req.body.type,
      owner: owner,
      meta: metaId,
      source: req.body.source,
      tags: req.body.tags
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
    client.use("download", function(err, tubename) {
      if (err) throw err;

      client.put(1, 0, 0, JSON.stringify(['download', {
        type: "media",
        payload: {
          media: mediaObject,
          meta: metadata
        }
      }]), function(err, jobid) {
        if (err) throw err;
      });

    });


    return res.send(mediaObject);
  });

  app.delete('/v1/:user?/media/:id', function(req, res) {
    var owner = (req.params.user)?req.params.user:req.body.owner;
    cube("delete_media", {
      user: owner,
      id: req.params.id
    });

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

};
