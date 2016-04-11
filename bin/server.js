/*****************************************************************************/
/* Require modules for the server
/*****************************************************************************/
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var root = path.resolve('.');

/*****************************************************************************/
/* Logging middleware */
/*****************************************************************************/
app.use(function(req, res, next) {
  console.log(req.method + ': ' + req.url);
  next();
});

/*****************************************************************************/
/* Serve any files in the app directory directly with app.html as the default
/* page
/*****************************************************************************/
app.use('/', express.static(path.join(root, 'app'), {index: 'app.html'}));

/*****************************************************************************/
/* Make sure json and form posts are parsed properly
/*****************************************************************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*****************************************************************************/
/* Send comments as json by sending an HTTP GET request to /comments.json
/*****************************************************************************/
app.get('/comments.json', function(req, res) {
  fs.readFile(path.join(root, 'data', 'comments.json'), function(err, data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

/*****************************************************************************/
/* Create a new comment by sending an HTTP POST request to /comments.json
/*****************************************************************************/
app.post('/comments.json', function(req, res) {
  fs.readFile('data/comments.json', function(err, data) {
    var comments = JSON.parse(data);
    comments.push(req.body);
    fs.writeFile(path.join(root, 'data', 'comments.json'), JSON.stringify(comments, null, 2), function(err) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      res.send(JSON.stringify(comments));
    });
  });
});

/*****************************************************************************/
/* Ok let's start the server! */
/*****************************************************************************/
app.listen(3333);
console.log('Server listening on http://localhost:3333');
