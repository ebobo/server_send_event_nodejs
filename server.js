/* Client Code 
let sse = new EventSource("http://localhost:8080/stream");
sse.onmessage = console.log
*/

// sse implementation server side
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tool = require('./eventTool');
const { performance } = require('perf_hooks');
//file-system
const fs = require('fs');
const path = require('path');

const app = express();
// for fixing"Access - Control- Allow - Origin" Cors issue
app.use(cors());

// ##############################
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// clients that connect to the sse server
let clients = [];
// unit id
let base_id = 0;
// events alarm and faults. caluculate the time
const startTime = performance.now();
let events = tool.generateEvents(2);
const endTime = performance.now();
console.log(
  `GenerateEvents took ${(endTime - startTime).toFixed(2)} milliseconds`
);
// console.log(events);

// read events from file
// fs.readFile('initEventsList.json', (err, data) => {
//   if (err) throw err;
//   events = JSON.parse(data);
// });

//port
const port = process.env.PORT || 5005;
// server name
const serverName = process.env.SERVER_NAME || 'SSE server 5005';

// home path
app.get('/', (req, res) => {
  var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  res.status(200).send(html);
});

// get eventspath
app.get('/events', (req, res) => res.send(events));

// home path
app.post('/event', (req, res) => {
  const uid = req.body.unitId;
  const system = req.body.system;
  const type = req.body.type;
  if (!uid || !system || !type) {
    return res.status(400).send(`Bad Request Body`);
  }

  const exist = events.find((eve) => eve.unitId === uid);
  if (exist) {
    exist.system = system;
    exist.type = type;
    res.send('updated');
  } else {
    events.push(req.body);
    res.send('added');
  }

  clients.forEach((client) =>
    client.response.write(`data: ${JSON.stringify(req.body)}\n\n`)
  );
});

// sse path
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache-Control', 'no-cache');

  base_id++;
  const clientId = base_id;

  const newClient = {
    id: clientId,
    response: res,
  };

  clients.push(newClient);
  console.log(`current connected clients ${clients.length}`);

  req.on('close', () => {
    console.log(`Client ${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });

  const data = `data: ${JSON.stringify(events)}\n\n`;

  res.write(data);

  // test function for send sse message
  // let i = 0;
  // function send(res) {
  //   res.write('data: ' + `hello from ${serverName} ---- [${i++}]\n\n`);

  //   setTimeout(() => send(res), 1000);
  // }
});

app.listen(port);

console.log(`Listening on ${port}`);
