const { response } = require("express");
const fetch = require("node-fetch");

// Language List: https://docs.microsoft.com/en-us/azure/cognitive-services/translator/language-support
const langList = ['en','ja','es','de','ar'];

const translateAll = (lang, text) => {
    let to = langList.filter(function(value, index, arr){return value!=lang;});
    return translateText(lang, to, text);
}

// found this somewhere... common code
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

const translateText = (from, to, text) => {
    // const endpoint = 'https://api.cognitive.microsofttranslator.com/';
    const subscriptionKey = process.env.TRANSLATION_KEY;
    // let endpoint = document.getElementById("endpoint").value;
    // let subscriptionKey = document.getElementById("cred").value;

    let contentBody = [
        {"text": text}
    ]

    let options = {
        method: 'POST',
        // qs: {
        //   'api-version': '3.0',
        //   'to': [input_lang]//['de', 'it']
        // },
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Ocp-Apim-Subscription-Region': 'eastus',
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4()
        },
        body: JSON.stringify(contentBody)
    };

    let endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to='
    //'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=ja,es,de'
    for (let lang of to) {
        if (endpoint[endpoint.length-1]=='='){
            endpoint += lang;
        }
        else {
            endpoint += ',' + lang;
        }
    }

    return fetch(endpoint, options)
    .then(function(res) {
        return res.json()
    }).then(function(data) {
        return data[0].translations;
    })
    .catch(function(err) {
        console.log(err);       
    })
}

// Test case
// translateAll('en', 'Hello World!').then(function (data) {
//  console.log(data);
// });
module.exports = {
    translateAll
}