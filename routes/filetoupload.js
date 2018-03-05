var express = require('express');
var formidable = require('formidable');
var mv = require('mv');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (Object.keys(files).length > 0 && files.filetoupload.name != '') {
            var oldpath = files.filetoupload.path; 
            var newpath = __dirname + '/' + files.filetoupload.name;
            console.log(files);
            mv(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
            });
        }
        else {
            res.write('No file to upload');
            res.end();
        }
    });
});

module.exports = router;
