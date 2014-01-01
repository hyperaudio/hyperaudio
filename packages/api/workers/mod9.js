
var querystring = require('querystring');
var http = require('http');

var mongoose = require('mongoose');
var Transcript = require('../models/transcript');

mongoose.connect("mongodb://localhost/hyperaudio01"); //FIXME conf

var io = require('socket.io-client');
var socket = io.connect('http://api.hyperaud.io');

module.exports = function() {
  function ProbeHandler() {
    this.type = 'transcript';
  }

  ProbeHandler.prototype.work = function(payload, callback) {
    console.log(payload);

    if (payload.type == "text") {

      ///////
      var options = {
        host: 'mod9.184.73.157.200.xip.io',
        port: 80,
        path: '/mod9/align/v0.7?' + querystring.stringify({
          audio: 'http://media.hyperaud.io/9-NlmilgRxapOVXcKvkzww/00002.m4a',//meta.audio,
          text: 'http://api.hyperaud.io/v1/transcripts/' + payload._id + '/text',
          mode: 'stream',
          skip: 'True',
          prune: 0
        }),
        headers: {
          'Authorization': 'Basic ' + new Buffer('hyperaud.io' + ':' + 'hyperaud.io').toString('base64')
        }
      };


      request = http.get(options, function(res) {
        var result = [];
        var part = null;

        console.log('Request in progress...');

        res.on('data', function(data) {
          console.log('DATA ' + data);
          if (part) part += data;
          try {
            // data = part + data;
            result.push([process.hrtime(), JSON.parse(data)]);
            socket.emit(['mod9', {
              user: payload.owner,
              transcript: payload._id,
              align: JSON.parse(data)
            }]);
            // part = "";
          } catch (err) {
            console.log('err skipping');
            part = data;
          }
        });

        res.on('end', function() {
          console.log('END');
          console.log(result);
          console.log('JOBID? ' + result[0][1].jobid);
          // result.push([process.hrtime(), JSON.parse(part)]);
          // console.log(JSON.stringify(result));
          // process.send(result);
          // process.disconnect();
          /////
          var options2 = {
            host: 'mod9.184.73.157.200.xip.io',
            port: 80,
            path: '/mod9/align/v0.7?' + querystring.stringify({
              jobid: result[0][1].jobid,
              mode: 'poll'
            }),
            headers: {
              'Authorization': 'Basic ' + new Buffer('hyperaud.io' + ':' + 'hyperaud.io').toString('base64')
            }
          };

          console.log(options2);

          request2 = http.get(options2, function(res2) {

            var result2 = "";

            res2.on('data', function(data2) {
              console.log('DATAX ' + data2);
              result2 += data2;
            });

            res2.on('end', function(){
              Transcript.findById(payload._id).exec(function(err, transcript) {
                if (!err) {
                  console.log('loaded transcript from db');
                  console.log(transcript);

                  transcript.type = "text";
                  if (!transcript.meta) {
                    transcript.meta = {};
                  }
                  transcript.meta.align = JSON.parse(result2);
                  // transcript.content =

                  transcript.save(function(err) {
                    console.log('SAVING? ' + err);
                    console.log(transcript);

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

          });
          /////
        })
        res.on('error', function(e) {
          console.log("Got error: " + e.message);
          // process.disconnect();
          callback('bury');
        });
      });

      ///////

    } else {
      console.log('NOT TEXT');
      callback('bury');
    }

  };

  var handler = new ProbeHandler();
  return handler;
};

/////////////////

// process.on('message', function(m) {

//   console.log(m);
//   // logger.info(m);

//   var options = {
//     host: 'mod9.184.73.157.200.xip.io',
//     port: 80,
//     path: '/mod9/align/v0.7?' + querystring.stringify({
//       audio: m.audio,
//       text: m.text,
//       mode: 'stream',
//       skip: 'True',
//       prune: 0
//     }),
//     headers: {
//       'Authorization': 'Basic ' + new Buffer('hyperaud.io' + ':' + 'hyperaud.io').toString('base64')
//     }
//   };

//   console.log(options);

//   request = http.get(options, function(res) {
//     var result = [];
//     var part = "";
//     res.on('data', function(data) {
//       console.log('DATA ' + data);
//       try {
//         data = part + data;
//         result.push([process.hrtime(), JSON.parse(data)]);
//         process.send(result);
//         part = "";
//       } catch (err) {
//         console.log('err skipping');
//         part += data;
//       }
//     });
//     res.on('end', function() {
//       console.log('END');
//       console.log(JSON.stringify(result));
//       // process.send(result);
//       // process.disconnect();
//     })
//     res.on('error', function(e) {
//       console.log("Got error: " + e.message);
//       // process.disconnect();
//     });
//   });

// });
