const lambdaFunction = require('./index.js'); // Asume que tu función Lambda está en index.js
const event = {
    body: JSON.stringify({ nombre: 'José', email: 'josdaperales@gmail.com' })
};

lambdaFunction.handler(event).then(response => {
    console.log(response);
}).catch(error => {
    console.error(error);
});