var fs = require("fs");
var express = require("express");
var https = require('https');
var http = require('http');

/////////////////////////////////////////////

var HTTP_PORT = 3102;
var HTTPS_PORT = 3101;

/////////////////////////////////////////////

var app = express();

// Route all Traffic to Secure Server
// Order is important (this should be the first route)
app.all('*', function(req, res, next){
  if (req.secure) {
    return next();
  };
  res.redirect('https://localhost:'+HTTPS_PORT+req.url);
  // res.redirect('https://'+req.hostname+':'+HTTPS_PORT+req.url);
});

// Hello World
app.get('/', function (req, res) {
  res.send('Hello World!');
});

/////////////////////////////////////////////
// Setup Servers

// HTTPS
var secureServer = https.createServer({
    key: fs.readFileSync('keys/private.key'),
    cert: fs.readFileSync('keys/certificate.pem')
  }, app)
  .listen(HTTPS_PORT, function () {
    console.log('Secure Server listening on port ' + HTTPS_PORT);
});

var insecureServer = http.createServer(app).listen(HTTP_PORT, function() {
  console.log('Insecure Server listening on port ' + HTTP_PORT);
})
