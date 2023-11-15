/* Client Code 
let sse = new EventSource("http://localhost:8080/stream");
sse.onmessage = console.log
*/

// sse implementation server side
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tool = require('./messageTool');
const objectTool = require('./objectTool');
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
// const startTime = performance.now();
let events = tool.generateAlarmFaultMessages(3);
// const endTime = performance.now();
// console.log(
//   `GenerateEvents took ${(endTime - startTime).toFixed(2)} milliseconds`
// );
// console.log(events);

// object list
const objects = objectTool.generateObjectMessage(100);

// timer
let eventTimer = null;

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

// get all events
app.get('/events', (req, res) => res.send(events));

// get number of events
app.get('/events/length', (req, res) => {
  res.send({
    total: events.length,
    alarm: events.filter((e) => e.meta.type === 'alarm').length,
    fault: events.filter((e) => e.meta.type === 'fault').length,
    unknow: events.filter((e) => e.meta.type === 'unknow').length,
  });
});

app.delete('/events', (req, res) => {
  const length = events.length;
  events = [];

  clients.forEach((client) => {
    client.response.write('event: clear\n');
    client.response.write(`data: all\n\n`);
  });
  res.send(`all ${length} events deleted`);
});

// add events
app.post('/events', (req, res) => {
  const type = req.body.type;
  const system = req.body.system;
  const size = req.body.size;

  if (!size || !type || !system) {
    return res.status(400).send(`Bad Request Body`);
  }

  generatedEvents = tool.generateMessagesByType(size, type);
  events = events.concat(generatedEvents);

  clients.forEach((client) => {
    generatedEvents.forEach((event) => {
      client.response.write('event: frakon\n');
      client.response.write(`data: ${JSON.stringify(event)}\n\n`);
    });
  });

  res.send({
    type: events.filter((e) => e.meta.type === type).length,
    total: events.length,
  });
});

//add event continuously
app.post('/events/sim', (req, res) => {
  const interval = req.body.interval; //ms
  const stop = req.body.stop;

  if (stop && eventTimer) {
    clearInterval(eventTimer);
    eventTimer = null;
  } else {
    if (!interval) {
      return res.status(400).send(`Bad Request Body`);
    }

    if (!eventTimer) {
      eventTimer = setInterval(() => {
        const generatedEvent = tool.generateAlarmFaultMessages(1)[0];
        events.push(generatedEvent);
        console.log(events.length);
        clients.forEach((client) => {
          client.response.write('event: frakon\n');
          client.response.write(`data: ${JSON.stringify(generatedEvent)}\n\n`);
        });
      }, interval);
    }
  }
  res.send({
    stop,
    interval,
  });
});

// post event
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

  clients.forEach((client) => {
    client.response.write('event: frakon\n');
    client.response.write(`data: ${JSON.stringify(req.body)}\n\n`);
  });
});

//acknowledge event
app.put('/event/:id/:ack', (req, res) => {
  const uid = req.params.id;
  const ack = req.params.ack;

  if (!uid || !ack) {
    return res.status(400).send(`Bad Request Body`);
  }
  const eve = events.find((e) => e.unitId === uid);
  if (eve) {
    eve.acknowledge = ack === 'true';
    res.send(eve);
  } else {
    res.send(`can't find ${uid}`);
  }
});

//acknowledge all events
app.put('/events/ack/:ack', (req, res) => {
  const ack = req.params.ack;
  events.forEach((e) => (e.acknowledge = ack === 'true'));
  res.send(
    `all events been ${ack === 'true' ? 'acknowledge' : 'unacknowladged'}`
  );
});

//get clients info
app.get('/clients', (req, res) => {
  if (clients.length > 0) {
    list = clients.map((c) => ({ id: c.id, ip: c.ip.replace('http://', '') }));
    res.send(list);
  } else {
    res.send('no clients connected');
  }
});

//get object lise
app.get('/object/list', (req, res) => res.send(objects));

// sse path
app.get('/sse/feed', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache-Control', 'no-cache');

  base_id++;
  const clientId = base_id;

  // get clinet ip
  // console.log(req.headers.origin);
  const newClient = {
    id: clientId,
    ip: req.headers.origin,
    response: res,
  };

  clients.push(newClient);
  // console.log(`current connected clients ： ${clients.length}`);

  req.on('close', () => {
    console.log(`Client ${req.headers.origin} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });

  const title = 'event: frakon\n';
  events.forEach((event) => {
    res.write(title);
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  // test function for send sse message
  // let i = 0;
  // function send(res) {
  //   res.write('data: ' + `hello from ${serverName} ---- [${i++}]\n\n`);

  //   setTimeout(() => send(res), 1000);
  // }
});

app.listen(port);

console.log(`Listening on ${port}`);
