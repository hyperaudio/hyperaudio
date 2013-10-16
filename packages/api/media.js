var passport = require('passport');
var MediaObject = require('./models/mediaObject');

module.exports = function (app, nconf) {

    app.get('/media', function(req, res){
        return MediaObject.find(function(err, mediaObjects) {
            return res.send(mediaObjects);
        });
    });

    app.get('/media/:id', function(req, res){
        return MediaObject.findById(req.params.id, function(err, mediaObject) {
            if (!err) {
                return res.send(mediaObject);
            }
        });
    });

   app.put('/media/:id', function(req, res){
       return MediaObject.findById(req.params.id, function(err, mediaObject) {
                    
           mediaObject.label =  req.body.label;
           mediaObject.desc = req.body.desc;
           mediaObject.type = req.body.type;
           mediaObject.sort = req.body.sort;
           mediaObject.owner = req.body.owner;
           mediaObject.meta = req.body.meta;
           
           return mediaObject.save(function(err) {
               if (!err) {
                   console.log("updated");
               }
               return res.send(mediaObject);
           });
       });
   });

    app.post('/media', function(req, res){

        var mediaObject;
        mediaObject = new MediaObject({
            label:  req.body.label,
            desc: req.body.desc,
            type: req.body.type,
            sort: req.body.sort,
            owner: req.body.owner,
            meta: req.body.meta
        });

        console.log(mediaObject);

        mediaObject.save(function(err) {
            if (!err) {
                return console.log("created");
            }
        });
        return res.send(mediaObject);
    });

   app.delete('/media/:id', function(req, res){
       return MediaObject.findById(req.params.id, function(err, mediaObject) {
           return mediaObject.remove(function(err) {
               if (!err) {
                   console.log("removed");
                   return res.send('')
               }
           });
       });
   });

};