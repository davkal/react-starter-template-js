var express = require('express');
var path = require('path');
var app = express();

if ("production" === process.env.NODE_ENV) {
  var port = process.env.PORT || 3000;

  app.use(express.static(__dirname));

  app.listen(port, function() {
    console.log('listening on port', port);
  });
} else {
  console.error('not intended for dev use');
  exit 1;
}