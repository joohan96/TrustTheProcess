var express = require('express');
var router = express.Router();
var { generateToken, sendToken } = require('../utils/token.utils');
var passport = require('passport');
var pdfreader = require("pdfreader");
var fs = require("fs");
var Classifier = require('../utils/classifier');
var multer = require('multer')
var PdfReader = new pdfreader.PdfReader();
var rows = {}; // indexed by y-position
var rowsOfTexts = [];
var transactions = [];
var transactionNames = [];
var validTransactionMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

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
    fs.readFile(file.path, (err, pdfBuffer) => {
        if (err) {
            return res.status(400).json(new Error("Problem creating a file buffer: " + err));
        }
        parsePDF(pdfBuffer).then(function() {
            console.log(transactions);
            console.log(transactionNames);
            classifyTransactionNames();
          }).catch(function(err) {
            // Instead, this happens:
            console.log("It failed!", err);
          })
    })
})

function parsePDF(pdfBuffer) {
    return new Promise(function (resolve, reject) {
        //Reading from a buffer in memory rather than from a file referenced by path
        PdfReader.parseBuffer(pdfBuffer, function (
            err,
            item
        ) {
            if (!item) { // end of file, or page
                resolve();
            } else if (item.page) {  
                console.log(item);
                cacheRowsOfTexts();
                cacheTransactionNames();
                rows = {}; // clear rows for next page   
            } else if (item.text) { // accumulate text items into rows object, per line
                // TODO: item.text does not keep the spaces within the transaction title
                console.log(item.text);
                (rows[item.y] = rows[item.y] || []).push(item.text);
            }
        });
    });
}

function cacheRowsOfTexts() {
    Object.keys(rows) // => array of y-positions (type: float)
        .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
        .forEach(y => rowsOfTexts.push("" + (rows[y] || []).join(" ")));
}

function cacheTransactionNames() {
    for (i in rowsOfTexts) {
        if (validTransactionMonths.includes(rowsOfTexts[i].substring(0, 3).toLowerCase())) {
            transactions.push(rowsOfTexts[i]);
            const dollarSignIndex = rowsOfTexts[i].indexOf("$");
            // TODO: need to find out a way to substring DYNAMICALLY 
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

module.exports = router;