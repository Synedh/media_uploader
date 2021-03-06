var mv = require('mv');
var fs = require('fs');
var crypto = require('crypto');
var express = require('express');
var fileType = require('file-type');
var readChunk = require('read-chunk');
var formidable = require('formidable');

var router = express.Router();


/* POST file handling. */
router.post('/', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (Object.keys(files).length > 0 && files.filetoupload.name != '') {
            var imageType = fileType(readChunk.sync(files.filetoupload.path, 0, 4100));
            if (imageType && imageType['mime'].indexOf('image') >= 0) {
                var oldpath = files.filetoupload.path; 
                var date = new Date();
                var storage_path = '/' + new Date().toISOString().substr(0, 7);
                var newfilename = crypto.randomBytes(5).toString('hex') + '_' + files.filetoupload.name;
                var newpath = storage_folder + storage_path + '/' + newfilename;

                fs.access(storage_folder, function(err) {
                    if (err && err.code === 'ENOENT') {
                        fs.mkdir(storage_folder, function(err) { if (err) { throw err; } else { create_month_folder(); }});
                    } else {
                        create_month_folder();
                    }
                });

                function create_month_folder() {
                    fs.access(storage_folder + storage_path, function(err) {
                        if (err && err.code === 'ENOENT') {
                            fs.mkdir(storage_folder + storage_path, function(err) { if (err) { throw err; } else { mv_send(); }});
                        } else {
                            mv_send()
                        }
                    });
                }
                function mv_send() {
                    mv(oldpath, newpath, function (err) {
                        if (err) throw err;
                        res.send('http://' + req.headers.host + '/file_storage'  + storage_path + '/' + newfilename); // Send image url.
                        res.end();
                        console.log(newpath);
                    });
                }
            }
            else {
                res.status(415);
                res.send('This is not an image !')
                res.end();
            }
        }
    });
});

module.exports = router;
