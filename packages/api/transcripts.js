var passport = require('passport');
var MediaObject = require('./models/mediaObject');
var Transcript = require('./models/transcript');
var fs = require('fs');
var path = require('path');
var url = require('url');
var youtubedl = require('youtube-dl');

var uuid = require("node-uuid");
var urlSafeBase64 = require('urlsafe-base64');

var querystring = require('querystring');
var http = require('http');


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

module.exports = function(app, nconf, io) {

  app.get('/v1/:user?/transcripts', function(req, res) {

    if (req.params.user) {
      var query = {
        owner: req.params.user
      };

      if (req.query.type) {
        query.type = req.query.type;
      }

      return Transcript.find(query).select('-meta -content').exec(function(err, transcripts) {
        return res.send(transcripts);
      });
    }

    var query = {};

    if (req.query.type) {
      query.type = req.query.type;
    }

    return Transcript.find(query).select('-meta -content').exec(function(err, transcripts) {
      return res.send(transcripts);
    });
  });

  app.get('/v1/:user?/transcripts/:id', function(req, res) {

    return Transcript.findById(req.params.id).populate('media').exec(

      function(err, transcript) {
        if (!err) {
          return res.send(transcript);
        }

        res.status(404);
        res.send({
          error: 'Not found'
        });
        return;
      });
  });

  app.get('/v1/:user?/transcripts/:id/poll', function(req, res) {

    return Transcript.findById(req.params.id).populate('media').exec(

      function(err, transcript) {
        if (!err) {

          var jobid = null;

          if (transcript.type == 'html') {
            return res.send(transcript);
          } else if (transcript.meta && transcript.meta.status && transcript.meta.status.alignment) {
            return res.send(transcript);
          } else if (transcript.meta && transcript.meta.mod9 && transcript.meta.mod9.jobid) {
            jobid = transcript.meta.mod9.jobid;
          } else {
            return res.send(transcript);
          }

          ////
          var options = {
            host: 'mod9.54.197.237.1.xip.io',
            port: 80,
            path: '/mod9/align/v0.8?' + querystring.stringify({
              jobid: jobid,
              mode: 'poll'
            }),
            headers: {
              'Authorization': 'Basic ' + new Buffer('hyperaudio' + ':' + 'hyperaudio').toString('base64')
            }
          };

          console.log(options);

          request = http.get(options, function(response) {

            var result = '';

            response.on('data', function(data) {
              console.log('DATAX ' + data);
              result += data;
            });

            response.on('end', function() {
              transcript.type = "text";
              if (!transcript.meta) transcript.meta = {};

              // transcript.meta.align = JSON.parse(result);
              transcript.meta.status = JSON.parse(result);
              transcript.status = '';

              if (transcript.meta.status.status) transcript.status = transcript.meta.status.status;
              // if (io && io.sockets) io.sockets.emit(transcript._id, transcript.status);

              if (transcript.meta.status.alignment) {
                var hypertranscript = "<article><header></header><section><header></header><p>";
                var al = transcript.meta.status.alignment;
                for (var i = 0; i < al.length; i++) {
                   hypertranscript += "<a data-m='"+(al[i][1]*1000)+"'>"+al[i][0]+" </a>";
                }
                hypertranscript += "</p><footer></footer></section></footer></footer></article>";

                transcript.content = hypertranscript;
                transcript.type = 'html';

                transcript.meta.status.alignment = true;
              }

              transcript.save(function(err) {
                // console.log('SAVING? ' + err);
                // console.log(transcript);
                if (!err) {
                  return res.send(transcript);
                } else {
                  console.log(err);
                  res.status(500);
                  return res.send({
                    error: err
                  });
                }
              });

            });

          });//req2
          ////
        } else {
          res.status(404);
          res.send({
            error: err,
          });
          return;
        }
      });
  });


  app.get('/v1/:user?/transcripts/:id/text', function(req, res) {

    //return Transcript.findById(req.params.id).exec(
    return Transcript.findById(req.params.id).populate('media').exec(
      /*return Transcript.findById(req.params.id,*/

      function(err, transcript) {
        if (!err) {
          res.header("Content-Type", "text/plain");
          return res.send(transcript.content);
        }

        res.status(404);
        res.send({
          error: 'Not found'
        });
        return;
      });
  });

  app.get('/v1/:user?/transcripts/:id/html', function(req, res) {

    return Transcript.findById(req.params.id).exec(
      /*return Transcript.findById(req.params.id,*/

      function(err, transcript) {
        if (!err) {
          res.header("Content-Type", "text/html");
          return res.send(transcript.content);
        }

        res.status(404);
        res.send({
          error: 'Not found'
        });
        return;
      });
  });

  app.put('/v1/:user?/transcripts/:id', ensureOwnership, function(req, res) {

    return Transcript.findById(req.params.id, function(err, transcript) {

      transcript.label = req.body.label;
      transcript.desc = req.body.desc;
      transcript.type = req.body.type;
      transcript.meta = req.body.meta;
      if (!transcript.meta) transcript.meta = {status:null};
      transcript.media = req.body.media;

      if (req.params.media && req.params.media._id) {
        transcript.media = req.params.media._id;
      } else {
        transcript.media = req.body.media;
      }

      if (req.params.user) {
        transcript.owner = req.params.user;
      } else {
        transcript.owner = req.body.owner;
      }

      if (req.body.content) {
        transcript.content = req.body.content;
      }

      return transcript.save(function(err) {
        if (!err) {
          console.log("updated");
        }
        return res.send(transcript);
      });
    });
  });


  var getMediaUrl = function (mediaObject, callback) {
    if (mediaObject.source.mp4) {
      callback(mediaObject.source.mp4.url);
    } else {
      //assume yt
      var video = youtubedl.getInfo(mediaObject.source.youtube.url, [], function(err, info) {
        if (err) throw err;

        console.log('id:', info.id);
        console.log('title:', info.title);
        console.log('url:', info.url);
        console.log('thumbnail:', info.thumbnail);
        console.log('description:', info.description);
        console.log('filename:', info.filename);
        console.log('itag:', info.itag);
        console.log('resolution:', info.resolution);

        callback(info.url);
      });
    }
  }

  app.get('/v1/:user?/transcripts/:id/video', function(req, res) {
    return Transcript.findById(req.params.id).populate('media').exec(function(err, transcript) {
      getMediaUrl(transcript.media, function(url) {
        if (url) return res.redirect(url);
        return res.send(404);
      });
    });
  });

  // FIXME better location? think web-calculus, also allow setting text now?
  // pass media url
  app.post('/v1/:user?/transcripts/:id/align', function(req, res) {

    return Transcript.findById(req.params.id).populate('media').exec(function(err, transcript) {

      getMediaUrl(transcript.media, function(url) {
        if (transcript.type == 'text' && transcript.media && url) {

          if (!transcript.meta) transcript.meta = {status: null, state: 0};

          var lang = 'en';
          if (transcript.meta && transcript.meta.lang) lang = transcript.meta.lang;
          if (req.body.lang) lang = req.body.lang;

          //use redirect url
          url = 'http://api.hyperaud.io/v1/transcripts/' + transcript._id + '/video';

          var options = {
            host: 'mod9.54.197.237.1.xip.io',
            port: 80,
            path: '/mod9/align/v0.8?' + querystring.stringify({
              audio: 'http://hyperaudio.net/test/AC.mp3',//url,
              lang: lang,
              text: 'http://api.hyperaud.io/v1/transcripts/' + transcript._id + '/text',
              mode: 'submit',
              skip: 'True',
              prune: 0
            }),
            headers: {
              'Authorization': 'Basic ' + new Buffer('hyperaudio' + ':' + 'hyperaudio').toString('base64')
            }
          };

	       console.log(options);

          request = http.get(options, function(response) {
            var result = [];
            var part = null;

            console.log('Request in progress...');

            response.on('data', function(data) {
              console.log('DATA ' + data);
              if (part) part += data;
              try {
                // data = part + data;
                result.push([process.hrtime(), JSON.parse(data)]);
                // socket.emit('mod9', {
                //   user: payload.owner,
                //   transcript: payload._id,
                //   align: JSON.parse(data)
                // });
                // part = "";
                transcript.status = JSON.parse(data).status;
                transcript.meta.status = JSON.parse(data);

                transcript.meta.state = 1;

                transcript.meta.mod9 = JSON.parse(data);
                transcript.meta.mod9.input = options;
              // transcript.save(function(){
                // return res.send(transcript);
              // });
              // if (io && io.sockets) io.sockets.emit(transcript._id, transcript.status);

              } catch (err) {
                console.log('err skipping');
                part = data;
              }
            });

            response.on('end', function() {
              console.log('END');
              console.log(result);
              console.log('JOBID? ' + result[0][1].jobid);

              // transcript.status = JSON.parse(data).status;
              // transcript.meta.status = JSON.parse(data);
              transcript.meta.state = 2;
              if (!transcript.meta.mod9) transcript.meta.mod9 = {};
              transcript.meta.mod9.jobid = result[0][1].jobid;

              transcript.save(function(err, _transcript){
                console.log(err);
                return res.send(_transcript);
              });

              /////
            });//req.end

            response.on('error', function(e) {
              console.log("Got error: " + e.message);
            });
          });

        } else {// if text & media
          // return res.send({error: 'not text, or no media, or no url'});
          return res.send(transcript);
        }
      });//getMediaUrl

      //return res.send(transcript);
    });
  });

  app.post('/v1/:user?/transcripts', ensureOwnership, function(req, res) {

    var transcript;
    var owner;
    var content = null;

    if (req.params.user) {
      owner = req.params.user;
    } else {
      owner = req.body.owner;
    }


    if (req.body.content) {
      content = req.body.content;
    }

    var meta = req.body.meta;
    if (!meta) meta = {status:null};
    transcript = new Transcript({
      _id: urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0)),
      label: req.body.label,
      desc: req.body.desc,
      type: req.body.type,
      // sort: req.body.sort,
      owner: req.body.owner,
      meta: meta,
      content: content,
      media: req.body.media
    });


    transcript.save(function(err) {
      if (!err) {
        console.log("created");

        // fix media
        // console.log("looking for media " + req.body.media);
        // MediaObject.findById(req.body.media).exec(function(err, mediaObject) {
        //   console.log(err);
        //   console.log(mediaObject);
        //   if (!err) {
        //     for (var i = 0; i < mediaObject.transcripts.length; i++) {
        //       if (mediaObject.transcripts[i] == transcript._id) {
        //         return
        //       }
        //     }

        //     mediaObject.transcripts.push(transcript._id);
        //     mediaObject.save(function(err) {
        //       console.log(err);
        //     });

        //     console.log(mediaObject);
        //   }
        // });
        // fix media
      }
    });
    return res.send(transcript);
  });

  app.delete('/v1/:user?/transcripts/:id', function(req, res) {

    return Transcript.findById(req.params.id, function(err, transcript) {
      return transcript.remove(function(err) {
        if (transcript.owner != req.user.username) {
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
      });
    });
  });

};
