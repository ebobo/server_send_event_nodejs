/* Client Code 
let sse = new EventSource("http://localhost:8080/stream");
sse.onmessage = console.log
*/

// sse implementation server side
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
// for fixing"Access - Control- Allow - Origin" Cors issue
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// clients that connect to the sse server
let clients = [];
// unit id
let base_id = 0;
// events alarm and faults
let events = [
  {
    system: 'AutroSafe',
    type: 'Alarm',
    unitId: 'U001',
  },
  {
    system: 'AutroPrime',
    type: 'Fault',
    unitId: 'U002',
  },
  {
    system: 'AutroSafe',
    type: 'Alarm',
    unitId: 'U003',
  },
  {
    system: 'AutroSafe',
    type: 'Fault',
    unitId: 'U004',
  },
];
//port
const port = process.env.PORT || 5005;
// server name
const serverName = process.env.SERVER_NAME || 'server 5005';

// home path
app.get('/', (req, res) => res.send(`hello! ${serverName}`));

// home path
app.post('/event', (req, res) => {
  req.body;
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

  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
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
