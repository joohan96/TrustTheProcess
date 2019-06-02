// %20 = ' '
// %24 = '$'

class jsonHandler {
    constructor(input) {
        this.inputJsonData = input;
    }
    getTransactions() {
        var jsonData = this.inputJsonData.formImage.Pages
        
        var ret = [];
        // ws = [];
        var ys = [];
        var xs = [];
        for (var key in jsonData) {
            // Every index contains the data of each page
            var pageTexts = jsonData[key].Texts;
            //console.log(JSON.stringify(pageTexts));
            for (var index in pageTexts) {
                // w is a unique value in expenses list for each values <10, <100, <1000...etc
                // str.split(search).join(replacement) to get filter "%20" signs
                var wVal = pageTexts[index].w;
                var xVal = pageTexts[index].x;
                var yVal = pageTexts[index].y;
                var textVal = this.removeSigns(pageTexts[index].R[0].T);

                // var key = yVal;

                var entry = {};
                entry['w'] = wVal;
                entry[index] = textVal;
                entry['x'] = xVal;
                entry['y'] = yVal;

                // ws.push(wVal);
                var index = ys.indexOf(yVal);
                var index2 = xs.indexOf(xVal);
                if (index > -1 && index2 > -1) {
                    ret[index].push(textVal);
                }
                else {
                    ys.push(yVal);
                    xs.push(xVal);
                    ret.push([textVal]);
                }
            }
            //console.log(ret);
        }
        //var top = getTop(ws, 5);
        //console.log(top);
        //console.log(JSON.stringify(ret));
        return ret;
    }

    // removes all special signs 
    removeSigns(json) {
        var ret = json.split("%20").join(" ");
        var ret = ret.split("%24").join("$");
        var ret = ret.split("%2C").join(",");
        var ret = ret.split("%26").join("&");
        return ret;
    }

    //     // returns top 'x' occurences
    //     function getTop(jsonArray, x) {
    //         //return top 3 most occurring 
    //         var wMap = {};
    //         var result = {};
    //         if (jsonArray == null) return null;
    //         jsonArray.forEach(function (v) {
    //             if (!wMap[v]) { // Initial object property creation.
    //                 wMap[v] = 1; // Create an array for that property.
    //             } else { // Same occurrences found.
    //                 wMap[v] = (wMap[v] + 1); // Fill the array.
    //             }
    //         });
    //         // sort
    //         var sortable = [];
    //         for (var w in wMap) {
    //             sortable.push([w, wMap[w]]);
    //         }
    //         sortable.sort(function (a, b) {
    //             return a[1] - b[1];
    //         });

    //         // return top 5 
    //         for (var i = 1; i < x + 1; i++) {
    //             result[i] = sortable[sortable.length - i];
    //         }
    //         return result;
    //     }
}

module.exports = jsonHandler;