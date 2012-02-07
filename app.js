#!/usr/bin/env node
var request = require('request')
  , config = require('./config.js')
  , express = require('express')
  , path = require('path')
  , hogan = require('hogan.js')
  , adapter = require('./hogan-express.js')

var url = "http://blog.readability.com/2011/02/step-up-be-heard-readability-ideas/";

var app = express.createServer();

app.set('view engine','hogan.js');
app.register('hogan.js',adapter.init(hogan));

app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, "static")));


app.get('/', function (req, res) {
  res.render('index');
})

app.post('/article', function (req, res) {
  var url = req.body.url;
  request.get({
    uri: "http://www.readability.com/api/content/v1/parser?token=" + config.apiToken + "&url=" + url,
    form: true
  }, function (err, resp, body) {
    var response = JSON.parse(body);
    res.contentType('json');
    res.send(response);
  });
})

module.exports = app;
