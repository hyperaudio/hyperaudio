var pm2 = require('pm2');

pm2.connect(function(err) {

  pm2.start('processes.json', {}, function(err, proc) {
    if (err) throw new Error('err');
  });
  
})
