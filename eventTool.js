//The maximum is exclusive and the minimum is inclusive
module.exports.generateEvents = (num) => {
  let events = [];
  const digit = 6;
  const system = 'Autrosafe';
  for (let i = 0; i < num; i++) {
    rem = i % 3;
    let type = 'Alarm';
    if (rem === 1) {
      type = 'Fault';
    } else if (rem === 2) {
      type = 'Unknow';
    }
    events.push({ unitId: pad(i + 1, digit), type, system });
  }
  return events;
};

//The maximum is exclusive and the minimum is inclusive
module.exports.generateEventsByType = (num, type) => {
  let events = [];
  const system = 'Autrosafe';
  for (let i = 0; i < num; i++) {
    events.push({
      unitId: pad(Math.floor(Math.random() * 100000), 6),
      type,
      system,
    });
  }
  return events;
};

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = '0' + num;
  return num;
}
