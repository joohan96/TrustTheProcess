const express = require('express');

module.exports = function(app){
    var fs = require('fs');
    var PDFParser = require("pdf2json");
    var pdfParser = new PDFParser();
    var jsonData;

    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
        jsonData = pdfData;
    });

    app.get('/parsepdf', function(req, res){
        pdfParser.loadPDF("./routes/sample.pdf");
        res.send(jsonData);
    });
};