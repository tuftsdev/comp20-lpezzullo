var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js
var app = express();
// See https://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

var heresWhatsUp = "empty";

app.get('/', function(request, response) {
  response.send("It's working!");
});

app.post('/whatup', function(request,response) {
	heresWhatsUp = request.body.message;
	response.send("thats cool");
});

app.post('/addpasta', function(request, response) {
	var noodle = request.body.noodle;
	var toInsert = {
		"noodle": noodle,
	};
	console.log("toInsert = " + toInsert.noodle);
	db.collection('pasta', function(error1, coll) {
		var id = coll.insert(toInsert, function(error2, saved) {
			if (error2) {
				response.send(500);
			}
			else {
				console.log("Jake, it's okay...");
				response.send(200);
			}
	    });
	});
});

app.get('/list', function(request, response) {
	response.set('Content-Type', 'text/html');
	var indexPage = '';
	db.collection('pasta', function(er, collection) {
		collection.find().toArray(function(err, cursor) {
			if (!err) {
				indexPage += "<!DOCTYPE HTML><html><head><title>the pasta list</title></head><body><h1>mamma mia. that's a spicy meatball</h1>";
				for (var count = 0; count < cursor.length; count++) {
					indexPage += "<p>there's pasta called " + cursor[count].noodle + "!</p>";
				}
				indexPage += "</body></html>"
				response.send(indexPage);
			} else {
				response.send('<!DOCTYPE HTML><html><head><title>the pasta list</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
			}
		});
	});
});

app.get('/whatup', function(request,response) {
	heresWhatsUp = "you called the get function!";
	response.set('Content-Type', 'text/html');
	var indexPage = "";
	indexPage += "<!DOCTYPE HTML><html><head><title>what up</title></head><body><h1>whats up friendo</h1><p>";
	indexPage += heresWhatsUp;
	indexPage += "</p></body></html>"
	response.send(indexPage);
});
	
	app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'));
});