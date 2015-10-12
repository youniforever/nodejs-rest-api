/** Defualt Page */
exports.html = function(req, res){
    var util = require('util');
    var data = {};
    data = util._extend(data, {title: 'HTTP SERVER'});
    res.render('index', data);
};
