//The maximum is exclusive and the minimum is inclusive
module.exports.generateEvents = (num) => {
  let events = [];
  const digit = 6;
  const system = 'AutroSafe';
  for (let i = 0; i < num; i++) {
    rem = i % 3;
    let type = 'Alarm';
    if (rem === 1) {
      type = 'Fault';
    } else if (rem === 2) {
      type = 'Unknow';
    }
    const now = new Date();
    events.push({
      unitId: pad(i + 1, digit),
      type,
      system,
      time: now.toLocaleString(),
    });
  }
  return events;
};

//The maximum is exclusive and the minimum is inclusive
module.exports.generateEventsByType = (num, type, system) => {
  let events = [];
  for (let i = 0; i < num; i++) {
    const now = new Date();
    events.push({
      unitId: pad(Math.floor(Math.random() * 100000), 5),
      type,
      system,
      time: now.toLocaleString(),
    });
  }
  return events;
};

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = '0' + num;
  return 'U' + num;
}
