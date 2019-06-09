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
        let analyzeParams = {
            'text': data,
            'features': {
                'categories': {
                    'limit': 1
                },
            },
        };

        return naturalLanguageUnderstanding.analyze(analyzeParams)
            .then(analysisResults => {

                return analysisResults;
            })
            .catch(err => {
                console.log('error:', err);
            });
    }
}

module.exports = Classifier;
