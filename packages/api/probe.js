var https = require('https');
var fs = require('fs');
var path = require('path');
var probe = require('node-ffprobe');
var ffmpeg = require('fluent-ffmpeg');

process.on('message', function(m) {
  console.log('PROBE: ', m);
  
  console.log("downloading " + m.url);
  var request = https.get(m.url, function(response) { 
    var filePath = path.join(__dirname, 'media/' + response.headers['x-file-name']);
    
    var file = fs.createWriteStream(filePath);
    response.pipe(file);
    
    response.on("end", function() {
      
      //ffprobe
      probe(filePath, function(err, probeData) {
          console.log(probeData);
          process.send(probeData);
          
          //screenshot
          try{
          var proc = new ffmpeg({ source: filePath })
            .withSize('150x100')
            .takeScreenshots({
                count: 2,
                timemarks: [ '50%', '75%' ],
                filename: '%b_screenshot_%w_%i'
              }, 
              path.join(__dirname, 'media/'), 
              function(err, filenames) {
                console.log(filenames);
                console.log('screenshots were saved');
                
                process.disconnect();
              }); 
          } catch (err) {
            console.log(err);
            process.disconnect();
          }         
      });
    });
    
  });
  
});

