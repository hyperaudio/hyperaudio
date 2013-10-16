var passport = require('passport');
var Mix = require('./models/mix');

module.exports = function (app, nconf) {

    app.get('/mixes', function(req, res){
        return Mix.find(function(err, mixes) {
            return res.send(mixes);
        });
    });

    app.get('/mixes/:id', function(req, res){
        return Mix.findById(req.params.id, function(err, mix) {
            if (!err) {
                return res.send(mix);
            }
        });
    });

   app.put('/mixes/:id', function(req, res){
       return Mix.findById(req.params.id, function(err, mix) {
                    
           mix.label =  req.body.label;
           mix.desc = req.body.desc;
           mix.type = req.body.type;
           mix.sort = req.body.sort;
           mix.owner = req.body.owner;
           mix.meta = req.body.meta;
           
           return mix.save(function(err) {
               if (!err) {
                   console.log("updated");
               }
               return res.send(mix);
           });
       });
   });

    app.post('/mixes', function(req, res){

        var mix;
        mix = new Mix({
            label:  req.body.label,
            desc: req.body.desc,
            type: req.body.type,
            sort: req.body.sort,
            owner: req.body.owner,
            meta: req.body.meta
        });

        console.log(mix);

        mix.save(function(err) {
            if (!err) {
                return console.log("created");
            }
        });
        return res.send(mix);
    });

   app.delete('/mixes/:id', function(req, res){
       return Mix.findById(req.params.id, function(err, mix) {
           return mix.remove(function(err) {
               if (!err) {
                   console.log("removed");
                   return res.send('')
               }
           });
       });
   });

};