var passport = require('passport');
var Transcript = require('./models/transcript');

module.exports = function (app, nconf) {

    app.get('/transcripts', function(req, res){
        return Transcript.find(function(err, transcripts) {
            return res.send(transcripts);
        });
    });

    app.get('/transcripts/:id', function(req, res){
        return Transcript.findById(req.params.id, function(err, transcript) {
            if (!err) {
                return res.send(transcript);
            }
        });
    });

   app.put('/transcripts/:id', function(req, res){
       return Transcript.findById(req.params.id, function(err, transcript) {
                    
           transcript.label =  req.body.label;
           transcript.desc = req.body.desc;
           transcript.type = req.body.type;
           transcript.sort = req.body.sort;
           transcript.owner = req.body.owner;
           transcript.meta = req.body.meta;
           
           return transcript.save(function(err) {
               if (!err) {
                   console.log("updated");
               }
               return res.send(transcript);
           });
       });
   });

    app.post('/transcripts', function(req, res){

        var transcript;
        transcript = new Transcript({
            label:  req.body.label,
            desc: req.body.desc,
            type: req.body.type,
            sort: req.body.sort,
            owner: req.body.owner,
            meta: req.body.meta
        });

        console.log(transcript);

        transcript.save(function(err) {
            if (!err) {
                return console.log("created");
            }
        });
        return res.send(transcript);
    });

   app.delete('/transcripts/:id', function(req, res){
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