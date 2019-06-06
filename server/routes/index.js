var express = require('express');
var router = express.Router();
var { generateToken, sendToken } = require('../utils/token.utils');
var passport = require('passport');
var PDFParser = require("pdf2json");
var jsonHandler = require('../utils/json.handler');
var Classifier = require('../utils/classifier');
var multer = require('multer')
require('../passport')();

// File upload storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
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
    // Saves file into storage
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        try {
            parser.on("pdfParser_dataError", errData => console.error(errData.parserError));
            parser.on("pdfParser_dataReady", pdfData => {
                var jsonhandler = new jsonHandler();
                var classifier = new Classifier();

                var transactions = jsonhandler.getTransactions(pdfData);
                //console.log(JSON.stringify(transactions));

                let fakedata = ['zara clothing store'];
                classifier.classify(fakedata).then((data) => {
                    console.log(data.categories[0].label);
                });

                //* TODO: Loop through transactions to classify 
                // for (var key in transactions) {
                //     classifier.classify(transactions[key]).then((data) => {
                //         console.log(data);
                //     });
                // }
            })

            parser.loadPDF("./uploads/" + req.file.filename);

            return res.status(200).send(req.file)
        } catch (e) {
            console.error(e);
            res.status(500).json(err)
        }
    })
})

module.exports = router;