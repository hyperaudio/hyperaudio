var passport = require('passport');
var Mix = require('./models/mix');
var fs = require('fs');
var path = require('path');

//FIXME: duplicate
var dgram = require("dgram");
var udp = dgram.createSocket("udp4");

function cube(type, data) {
  var buffer = new Buffer(JSON.stringify({
    "type": type,
    "time": new Date().toISOString(),
    "data": data
  }));
  udp.send(buffer, 0, buffer.length, 1180, "127.0.0.1");
}

module.exports = function(app, nconf) {

  app.get('/:user?/mixes', function(req, res) {
    cube("get_mixes", {
      user: req.params.user
    });
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
    cube("get_mix", {
      user: req.params.user,
      id: req.params.id
    });
    return Mix.findById(req.params.id, function(err, mix) {
      if (!err) {
        return res.send(mix);
      }

      res.status(404);
      res.send({
        error: 'Not found'
      });
      return;
    });
  });

  // TODO: restrict to same user only
  app.put('/:user?/mixes/:id', function(req, res) {
    cube("put_mix", {
      user: req.params.user,
      id: req.params.id
    });
    return Mix.findById(req.params.id, function(err, mix) {

      mix.label = req.body.label;
      mix.desc = req.body.desc;
      mix.type = req.body.type;
      // mix.sort = req.body.sort;

      if (req.params.user) {
        mix.owner = req.params.user;
      } else {
        mix.owner = req.body.owner;
      }

      mix.meta = req.body.meta;

      if (req.body.content) {
        mix.content = req.body.content;
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
    cube("post_mix", {
      user: req.params.user //ID?
    });

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
    }

    mix = new Mix({
      label: req.body.label,
      desc: req.body.desc,
      type: req.body.type,
      // sort: req.body.sort,
      owner: owner,
      meta: req.body.meta,
      content: content
    });

    // download if needed

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
    cube("delete_mix", {
      user: req.params.user,
      id: req.params.id
    });
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
