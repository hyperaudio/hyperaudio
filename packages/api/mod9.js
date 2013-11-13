var querystring = require('querystring');
var http = require('http');
// var clarinet = require("clarinet");
// var parser = clarinet.parser();

process.on('message', function(m) {
  
  console.log(m);
  
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

  request = http.get(options, function(res){
      var result = [];
      var part = "";
      res.on('data', function(data) {
          console.log('DATA ' + data)
  	      try{
  	        data = part + data;
          	result.push([process.hrtime(), JSON.parse(data)]);
          	process.send(result);
          	part = "";
  	      } catch (err) {
  	        console.log('err skipping');
  	        part += data;
  	      }
      });
      res.on('end', function() {
          console.log('END');
          console.log(JSON.stringify(result));
          process.send(result);
          process.disconnect();
      })
      res.on('error', function(e) {
          console.log("Got error: " + e.message);
          process.disconnect();
      });
  });

});
