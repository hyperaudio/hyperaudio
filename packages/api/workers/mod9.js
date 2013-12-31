
var querystring = require('querystring');
var http = require('http');

var mongoose = require('mongoose');
var Transcript = require('../models/transcript');

mongoose.connect("mongodb://localhost/hyperaudio01"); //FIXME conf

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
          text: payload.content,
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
        var part = "";

        console.log('Request in progress...');

        res.on('data', function(data) {
          console.log('DATA ' + data);
          try {
            data = part + data;
            result.push([process.hrtime(), JSON.parse(data)]);
            // process.send(result);
            part = "";
          } catch (err) {
            console.log('err skipping');
            part += data;
          }
        });

        res.on('end', function() {
          console.log('END');
          // console.log(JSON.stringify(result));
          // process.send(result);
          // process.disconnect();
          /////
          Transcript.findById(payload._id).exec(function(err, transcript) {
            if (!err) {
              console.log('loaded transcript from db');

              transcript.type = "text";
              if (!transcript.meta) transcript.meta = {};
              transcript.meta.align = result;
              // transcript.content =

              transcript.save(function(err) {
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
