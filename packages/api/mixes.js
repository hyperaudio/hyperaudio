var passport = require('passport');
var Mix = require('./models/mix');
var fs = require('fs');
var path = require('path');
var cp = require('child_process');


module.exports = function(app, nconf) {

  app.get('/:user?/mixes', function(req, res) {
    if (req.params.user) {
      var query = {
        owner: req.params.user
      };
      return Mix.find(query, function(err, mixes) {
        return res.send(mixes);
      });
    }
    return Mix.find(function(err, mixes) {
      return res.send(mixes);
    });
  });

  app.get('/:user?/mixes/:id', function(req, res) {
    return Mix.findById(req.params.id, function(err, mix) {
      if (!err) {
        try {
          var filePath = path.join(__dirname, 'media/' + mix.owner + '/' + mix.meta.filename);
          mix.content = fs.readFileSync(filePath);
        } catch (ignored) {}
        return res.send(mix);
      }
    });
  });

  // TODO: restrict to same user only
  app.put('/:user?/mixes/:id', function(req, res) {
    return Mix.findById(req.params.id, function(err, mix) {

      mix.label = req.body.label;
      mix.desc = req.body.desc;
      mix.type = req.body.type;
      mix.sort = req.body.sort;

      if (req.params.user) {
        mix.owner = req.params.user;
      } else {
        mix.owner = req.body.owner;
      }

      mix.meta = req.body.meta;

      if (req.body.content) {
        mix.content = req.body.content;
        try {
          var filePath = path.join(__dirname, 'media/' + mix.owner + '/' + mix.meta.filename);
          fs.writeFileSync(filePath, req.body.content);
        } catch (ignored) {}
      }

      return mix.save(function(err) {
        if (!err) {
          console.log("updated");
        }
        return res.send(mix);
      });
    });
  });

  app.post('/:user?/mixes', function(req, res) {

    var mix;
    var owner;
    var content = null;

    if (req.params.user) {
      owner = req.params.user;
    } else {
      owner = req.body.owner;
    }


    if (req.body.content) {
      content = req.body.content;
      try {
        var filePath = path.join(__dirname, 'media/' + req.body.owner + '/' + req.body.meta.filename);
        fs.writeFileSync(filePath, req.body.content);
      } catch (ignored) {}
    }

    mix = new Mix({
      label: req.body.label,
      desc: req.body.desc,
      type: req.body.type,
      sort: req.body.sort,
      owner: owner,
      meta: req.body.meta,
      content: content
    });
    
    // download if needed
    if (mix.meta.filename && mix.meta.key) {
      var p = cp.fork(__dirname + '/fileDownload.js');
      p.send({
        filename: mix.meta.filename, 
        url: mix.meta.url,
        owner: mix.owner
      });
    }

    console.log(mix);

    mix.save(function(err) {
      if (!err) {
        return console.log("created");
      }
    });
    return res.send(mix);
  });

  // ID is unique, ignore user
  // TODO: restrict to same user only
  app.delete('/:user?/mixes/:id', function(req, res) {
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
