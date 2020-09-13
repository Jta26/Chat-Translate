// const request = require('request');
// const uuidv4 = require('uuid/v4');
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function translate() {
  const input_text = document.getElementById("text").value;
  const input_lang = document.getElementById("lang").value;
  const endpoint = 'https://api.cognitive.microsofttranslator.com/';
  const subscriptionKey = 'df895905582a481d9ef7fdc941e97337';
  // let endpoint = document.getElementById("endpoint").value;
  // let subscriptionKey = document.getElementById("cred").value;
  
  let contentBody = [
    {"text": input_text}
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
  fetch('https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=ja,es,de', options)
  .then(function(res) {
     console.log(JSON.stringify(res)); 
  })
  .catch(function(err) {
    console.log(err);       
  })
}

document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  translate();
})
