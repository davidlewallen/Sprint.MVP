var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var db = require('./db')

var app = express();
module.exports = app;

app.use( bodyParser.json() );


var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './github-fetcher.sqlite3'
  }
});

app.post('/repos/import', function (req, res) {
  console.log("made it")

  var body = '';
  req.on('data', function(data) {
    body += data;
  }).on('end', function() {
    body = JSON.parse(body)
    
    var numRepoImport = body.length;

      db('repos').count('*')
      .then(function(bCount) {
        body.forEach(function(repo) {
          db.raw("INSERT OR REPLACE INTO repos (repo_id, repo_name, username, stargazers) VALUES (?, ?, ?, ?)", [
            repo.id,
            repo.name,
            repo.owner.login,
            repo.stargazers_count
            ]).then()
          })

        db.raw("SELECT COUNT(*) FROM repos")
        .then(function(aCount) {
          var afterCount = aCount[0]['COUNT(*)']
          var beforeCount = bCount[0]['count(*)']

          var importRes = {
            newRepo: (afterCount - beforeCount),
            updatedRepo: numRepoImport - (afterCount - beforeCount)
          }
          res.send(importRes)
        })
      })
    })
})


app.get('/repos', function (req, res) {
  console.log("d")
  db.raw("SELECT * FROM repos ORDER BY stargazers DESC LIMIT 25")
    .then(function(data) {
      console.log("e")
      res.send(data)
    })
});

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'))
});

var port = process.env.PORT || 4040;
app.listen(port);
console.log("Listening on port " + port);
