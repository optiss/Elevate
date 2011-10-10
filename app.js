// process.env.NODE_ENV = 'test';

var express = require('express'),
	mongoose = require('mongoose'),
	stylus = require('stylus'),
	app = module.exports = express.createServer(),
	Page = require('./models').Page;

// Configuration
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(stylus.middleware({
		src: __dirname + '/views', // .styl files are located in `views/stylesheets`
		dest: __dirname + '/public', // .styl resources are compiled `/stylesheets/*.css`
		compile: function(str, path) { // optional, but recommended
			return stylus(str).set('filename', path).set('warn', true).set('compress', true);
		}
	}));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
	db = mongoose.connect('mongodb://localhost/elevate-dev');
	console.log('using development database');
});

app.configure('test', function() {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	db = mongoose.connect('mongodb://localhost/elevate-test');
	console.log('using test database');
});

app.configure('production', function(){
	app.use(express.errorHandler()); 
	db = mongoose.connect('mongodb://localhost/elevate');
	console.log('using production database');
});

// Routes

// Base
app.get('/', function(req, res) {
	res.render('index.jade', {
      locals: { one: 'two' }
    });
});

// List pages
app.get('/pages', function(req, res) {
	
	Page.find(function(err, doc) {
		res.send(doc);
	});	
});

// Save a page
app.post('/pages', function(req, res) {
	var page = new Page(req.body);
	page.save(function() {
		res.send(page);
	});
});

// Delete a page
app.del('/pages/:id', function(req, res) {
	Page.findById(req.params.id, function(err, doc) {
		doc.remove(function() {
			res.send(doc);
		});
	});		
});

// Edit
app.get('/pages/:id/edit', function(req, res) {
  Page.findById(req.params.id, function(err, doc) {
    res.render('pages/edit.jade', {
      locals: { p: doc }
    });
  });
});

// Update
app.put('/pages', function(req, res) {
	Page.findById(req.body.page.id, function(err, doc) {
		doc.title = req.body.page.title;
		doc.save(function() {
			res.redirect('/pages');
		});
	});
});

// Blank (testing)
app.get('/blank', function(req, res) {
	res.send('Blank');
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

























