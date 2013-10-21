var https = require('https');
var fs = require('fs');
var path = require('path');

process.on('message', function(m) {
  console.log('DL: ', m);

  console.log("downloading " + m.url);
  var request = https.get(m.url, function(response) {
    try{
      fs.mkdirSync(path.join(__dirname, 'media/' + m.owner + '/'));
    } catch (FIXME) {}
    var filePath = path.join(__dirname, 'media/' + m.owner + '/' + m.filename);

    var file = fs.createWriteStream(filePath);
    response.pipe(file);

    response.on("end", function() {
      process.disconnect();
    });

  });

});
