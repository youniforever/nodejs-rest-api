#!/usr/bin/env node
'use strict';

/** Load Modules */
var express = require('express'); // express framework
var mysql = require('mysql'); // mysql client
var bodyParser = require('body-parser'); // parser
var index = require('./routes/index'); // extends the javascript file path
var bbs = require('./routes/api/bbs'); // extends the javascript file path

/** Packing the Response-JSON-Data */
global.jsonCapsule = function(result, data, error) {
    var ret = {};
    ret['result'] = result;
    ret['data'] = data;
    ret['error'] = error;
    
    return ret;
};

/** mysql connection pool */
global.dbpool = mysql.createPool({
    host: '182.162.146.110',
    port: 3306,
    user: 'drmz',
    password: 'eoflakswhr12!@',
    database: 'drmz_db',
    connectionLimit: 100
});

/** mysql connection poolCluster */
// TODO mysql clustering 구성
// article. https://github.com/felixge/node-mysql#poolcluster


/** Define all variables */
var app = express();
var __dirname = '.';
app.use(express.static(__dirname + '/publish'));
app.use(bodyParser.json('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.set('jsonCapsule', jsonCapsule);

// Setting Router
app.get('/', index.html);

app.put('/api/bbs', bbs.insert);
app.patch('/api/bbs', bbs.update);
app.delete('/api/bbs', bbs.delete);
app.get('/api/bbs', bbs.findAll);

// Binding Port
process.on('uncaughtException', function(err) {
    if(err.errno === 'EADDRINUSE') {
        console.log("Already in used Service-Port(" + app.get("port") + ")");
    }

    process.exit(1);
});
app.listen(app.get('port'), function() {
	console.log('Service is running...');
	console.log('port : ' + app.get('port'));
});
