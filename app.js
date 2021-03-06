#!/usr/bin/env node
var request = require('request')
  , config = require('./config.js')
  , express = require('express')
  , path = require('path')
  , hogan = require('hogan.js')
  , adapter = require('./hogan-express.js')

var app = express.createServer();

app.set('view engine','hogan.js');
app.register('hogan.js',adapter.init(hogan));

app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, "static")));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/article', function (req, res) {
  var url = req.query.url
    , raw = !!req.query.raw;
  request.get({
    uri: "http://www.readability.com/api/content/v1/parser?token=" + config.apiToken + "&url=" + url,
    form: true
  }, function (err, resp, body) {
    var response = JSON.parse(body),
        html = response.content;
    
    console.log(html);
    if (raw) return res.send(html);
        else return res.send(html.replace(/<.*?>/g, ''));
  });
});

module.exports = app;
