var passport = require('passport');
var MediaObject = require('./models/mediaObject');
var Transcript = require('./models/transcript');
var fs = require('fs');
var path = require('path');
var url = require('url');

module.exports = function(app, nconf) {

  app.get('/:user?/transcripts', function(req, res) {
    if (req.params.user) {
      var query = {
        owner: req.params.user
      };
      return Transcript.find(query, function(err, transcripts) {
        return res.send(transcripts);
      });
    }
    return Transcript.find(function(err, transcripts) {
      return res.send(transcripts);
    });
  });

  app.get('/:user?/transcripts/:id', function(req, res) {
    return Transcript.findById(req.params.id).populate('media').exec(
    /*return Transcript.findById(req.params.id,*/ function(err, transcript) {
      if (!err) {
        return res.send(transcript);
      }
      
      res.status(404);
      res.send({ error: 'Not found' });
      return;
    });
  });

  app.get('/:user?/transcripts/:id/text', function(req, res) {
    return Transcript.findById(req.params.id).populate('media').exec(
    /*return Transcript.findById(req.params.id,*/ function(err, transcript) {
      if (!err) {
		res.header("Content-Type", "text/plain");
		return res.send(transcript.content);
      }
      
      res.status(404);
      res.send({ error: 'Not found' });
      return;
    });
  });
  
  app.get('/:user?/transcripts/:id/html', function(req, res) {
    return Transcript.findById(req.params.id).populate('media').exec(
    /*return Transcript.findById(req.params.id,*/ function(err, transcript) {
      if (!err) {
		res.header("Content-Type", "text/html");
		return res.send(transcript.content);
      }
      
      res.status(404);
      res.send({ error: 'Not found' });
      return;
    });
  });
  
  app.put('/:user?/transcripts/:id', function(req, res) {
    return Transcript.findById(req.params.id, function(err, transcript) {

      transcript.label = req.body.label;
      transcript.desc = req.body.desc;
      transcript.type = req.body.type;
      // transcript.sort = req.body.sort;
      // transcript.owner = req.body.owner;
      transcript.meta = req.body.meta;
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
  

  // FIXME better location? think web-calculus, also allow setting text now?
  // pass media url
  // app.post('/:user?/transcripts/:id/align', function(req, res) {
  //   return Transcript.findById(req.params.id).populate('media').exec(function(err, transcript) {
  //     
  //     if (transcript.type == 'text' && transcript.media) {
  //       console.log('forking ' + __dirname + '/mod9.js')
  //       var p = cp.fork(__dirname + '/mod9.js');
  //       p.send({
  //         audio: 'http://data.hyperaud.io/' + transcript.owner + '/' + transcript.media.meta.filename,
  //         // text: 'http://data.hyperaud.io/' + transcript.owner + '/' + transcript.meta.filename
  //         text: 'http://data.hyperaud.io/' + transcript.owner + '/transcripts/' + req.params.id + '/text'
  //       });		
  // 		
  //       p.on('message', function(m) {
  // 		  // console.log("RECV? ");
  // 		  // console.log(m);
  // 		  // console.log("RECV! ");
  //         var query = {
  //           _id: req.params.id
  //         };
  // 		  
  // 		  if (m[m.length - 1][1].alignment) {
  // 			  var hypertranscript = "<article><header></header><section><header></header><p>";
  // 			  
  // 			  var al = m[m.length - 1][1].alignment;
  // 			  
  // 			  for (var i = 0; i < al.length; i++) {
  // 			  	hypertranscript += "<a data-m='"+(al[i][1]*1000)+"'>"+al[i][0]+" </a>";
  // 			  }
  // 
  // 			  
  // 			  hypertranscript += "</p><footer></footer></section></footer></footer></article>";
  // 			  
  // 
  // 	          Transcript.findOneAndUpdate(query, {
  // 	            alignments: m,
  // 				type: "html",
  // 				content: hypertranscript,
  // 				meta: {
  // 					filename: req.params.id + '.html'
  // 				}
  // 	          }, function(err, tr) {
  // 	            console.log(err, tr);
  // 				
  // 	          try {
  // 	            var filePath = path.join(__dirname, 'media/' + tr.owner + '/' + tr.meta.filename);
  // 	            fs.writeFileSync(filePath, tr.content);
  // 	          } catch (ignored) {}
  // 			  
  // 	          });		  	
  // 		  } else {
  // 	          Transcript.findOneAndUpdate(query, {
  // 	            alignments: m //using this for now even for updates, client must poll GET this transcript
  // 	          }, function(err, tr) {
  // 	            console.log(err, tr);
  // 	          });
  // 		  }
  // 		  
  //       });
  //     }
  //     
  //     return res.send(transcript);
  //   });
  // });
  
  app.post('/:user?/transcripts', function(req, res) {

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
	    
    transcript = new Transcript({
      label: req.body.label,
      desc: req.body.desc,
      type: req.body.type,
      // sort: req.body.sort,
      owner: req.body.owner,
      meta: req.body.meta,
      content: content,
      media: req.body.media
    });

    // download if needed

    console.log(transcript);

    transcript.save(function(err) {
      if (!err) {
        return console.log("created");
		
		// fix media
		MediaObject.findById(req.body.media).exec(function(err, mediaObject) {
	      if (!err) {
			  for (var i = 0; i < mediaObject.transcripts.length; i++) {
				  if (mediaObject.transcripts[i] == transcript._id) {
					  return
				  }
			  }
			  
			  mediaObject.transcripts.push(transcript._id);
			  mediaObject.save(function(err) {});
	      }      
		});
		// fix media
      }
    });
    return res.send(transcript);
  });

  app.delete('/:user?/transcripts/:id', function(req, res) {
    return Transcript.findById(req.params.id, function(err, transcript) {
      return transcript.remove(function(err) {
        if (!err) {
          console.log("removed");
          return res.send('')
        }
      });
    });
  });

};
