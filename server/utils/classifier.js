const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1');
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2019-04-02',
    iam_apikey: 'ogFqAUiPbuGCZ8FmCyLSD0Bc4DTdUlbdrYRGFEgjmG9B',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api'
});

class Classifier {
    constructor() {
    }

    classify(data) {
        console.log("im here");
        console.log(data);
        let analyzeParams = {
            'text': data, // Changed this to just data because I'm no longer sending in JSON
            'features': {
                'categories': {
                    'limit': 1
                },
            },
        };

        return naturalLanguageUnderstanding.analyze(analyzeParams)
            .then(analysisResults => {
                //console.log(JSON.stringify(analysisResults, null, 2));
                console.log("Analyzed Results: " + analysisResults);
                return analysisResults;
            })
            .catch(err => {
                console.log('error:', err);
            });
    }
}

module.exports = Classifier;
