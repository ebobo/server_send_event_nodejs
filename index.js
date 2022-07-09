/* Client Code 
let sse = new EventSource("http://localhost:8080/stream");
sse.onmessage = console.log
*/

const express = require('express');
const app = express();
const cors = require('cors');

// for fixing"Access - Control- Allow - Origin" Cors issue
app.use(cors());

app.get('/', (req, res) => res.send('hello!'));

app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  send(res);
});
const port = process.env.PORT || 5005;
const serverName = process.env.SERVER_NAME || 'sample';

// test function for send sse message
let i = 0;
function send(res) {
  res.write('data: ' + `hello from ${serverName} ---- [${i++}]\n\n`);

  setTimeout(() => send(res), 1000);
}

app.listen(port);

console.log(`Listening on ${port}`);
