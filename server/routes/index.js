var express = require('express');
var router = express.Router();
var { generateToken, sendToken } = require('../utils/token.utils');
var passport = require('passport');
var pdfreader = require("pdfreader");
var fs = require("fs");
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
var upload = multer({ storage: storage });


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
router.post('/parsepdf', upload.single('file'), function (req, res, err) {
    const file = req.file;
    if (!file) {
        return res.status(400).json(new Error("Please upload a file! " + err));
    }
    console.log(file);
    try {
        var PdfReader = new pdfreader.PdfReader();
        var rows = {}; // indexed by y-position
        var rowsOfTexts = [];
        var transactions = [];
        var transactionNames = [];
        var validTransactionMonths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        //Reading from a buffer in memory rather than from a file referenced by path
        fs.readFile(file.path, (err, pdfBuffer) => {
            if (err) {
                return res.status(400).json(new Error("Problem creating a file buffer: " + err));
            }
            PdfReader.parseBuffer(pdfBuffer, function (
                err,
                item
            ) {
                if (!item || item.page) {
                    // end of file, or page
                    cacheRowsOfTexts();
                    cacheTransactionNames();
                    rows = {}; // clear rows for next page
                    if (item.page == 4) { // TODO: need to change this to a promise! shouldn't be a static if statement
                        console.log(transactions);
                        console.log(transactionNames);
                        classifyTransactionNames();
                    }
                } else if (item.text) {
                    // accumulate text items into rows object, per line
                    // TODO: item.text does not keep the spaces within the transaction title
                    (rows[item.y] = rows[item.y] || []).push(item.text);
                }
            });
        });
    } catch (e) {
        console.error(e);
        res.status(500).json(err)
    }

    function cacheRowsOfTexts() {
        Object.keys(rows) // => array of y-positions (type: float)
            .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
            .forEach(y => rowsOfTexts.push("" + (rows[y] || []).join(" ")));
    }

    function cacheTransactionNames() {
        for (i in rowsOfTexts) {
            if (validTransactionMonths.includes(rowsOfTexts[i].substring(0, 3))) {
                transactions.push(rowsOfTexts[i]);
                const dollarSignIndex = rowsOfTexts[i].indexOf("$");
                transactionNames.push(rowsOfTexts[i].substring(12, dollarSignIndex - 1));
            }
        }
    }

    function classifyTransactionNames() {
        var classifier = new Classifier();
        for (i in transactionNames) {
            classifier.classify(transactionNames[i]).then((data) => {
                console.log(data);
            }).catch(function (err) {
                console.log(err);
            })
        }
    }
})

module.exports = router;