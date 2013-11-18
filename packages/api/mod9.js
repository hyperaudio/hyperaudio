var querystring = require('querystring');
var http = require('http');
var winston = require('winston');

require('winston-papertrail').Papertrail;

var logger = new winston.Logger({
    transports: [
        new winston.transports.Papertrail({
            host: 'logs.papertrailapp.com',
            port: 56679,
            logFormat: function(level, message) {
                return '<<<' + level + '>>> ' + message;
            }
        })
    ]
});

process.on('message', function(m) {
  
  console.log(m);
  // logger.info(m);
  
  var options = {
      host: 'mod9.184.73.157.200.xip.io',
      port: 80,
      path: '/mod9/align/v0.7?' + querystring.stringify({
        audio: m.audio,
        text: m.text,
        mode: 'stream',
        skip: 'True',
        prune: 0
      }),
      headers: {
       'Authorization': 'Basic ' + new Buffer('hyperaud.io' + ':' + 'hyperaud.io').toString('base64')
     }         
  };

  console.log(options);
  // logger.info(options);

  request = http.get(options, function(res){
      var result = [];
      var part = "";
      res.on('data', function(data) {
          console.log('DATA ' + data);
		  // logger.info(data);
  	      try{
  	        data = part + data;
          	result.push([process.hrtime(), JSON.parse(data)]);
          	process.send(result);
          	part = "";
  	      } catch (err) {
  	        console.log('err skipping');
			// logger.warn(err);
			// logger.warn('SKIP');
  	        part += data;
  	      }
      });
      res.on('end', function() {
          console.log('END');
          console.log(JSON.stringify(result));
		  // logger.info('END');
          process.send(result);
          process.disconnect();
      })
      res.on('error', function(e) {
          console.log("Got error: " + e.message);
          process.disconnect();
      });
  });

});
