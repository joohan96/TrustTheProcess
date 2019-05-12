var express = require('express');
var router = express.Router();
var { generateToken, sendToken } = require('../utils/token.utils');
var passport = require('passport');
var PDFParser = require("pdf2json");
var multer = require('multer')
require('../passport')();

// JSON version of PDF upload
var jsonData; 

// File upload storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("dst here")
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
var upload = multer({ storage: storage }).single('file')

// Facebook Authentication endpoint
router.route('/auth/facebook')
    .post(passport.authenticate('facebook-token', { session: false }), function (req, res, next) {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }
        req.auth = {
            id: req.user.id
        };

        next();
    }, generateToken, sendToken);

// File Upload and PDF Parsing endpoint
router.post('/parsepdf', function (req, res) {
    var parser = new PDFParser();

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        
        parser.on("pdfParser_dataError", errData => console.error(errData.parserError));
        parser.on("pdfParser_dataReady", pdfData => {
            jsonData = pdfData.formImage.Pages;
            //console.log(jsonData);
            res.send(jsonData);
        });
        parser.loadPDF("./uploads/" + req.file.filename);

        return res.status(200).send(req.file)
    })
})

module.exports = router;