//The maximum is exclusive and the minimum is inclusive
module.exports.generateEvents = (num) => {
  let events = [];
  const digit = 6;
  const System = 'AutroSafe';
  for (let i = 0; i < num; i++) {
    rem = i % 3;
    let Type = 'Alarm';
    if (rem === 1) {
      Type = 'Fault';
    } else if (rem === 2) {
      Type = 'Unknow';
    }
    const now = new Date();
    events.push({
      UnitId: pad(i + 1, digit),
      Type,
      System,
      Timestamp: now.toLocaleString(),
      acknowledge: false,
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
      UnitId: pad(Math.floor(Math.random() * 100000), 5),
      Type: type,
      System: system,
      Timestamp: now.toLocaleString(),
      Acknowledged: false,
    });
  }
  return events;
};

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = '0' + num;
  return 'U' + num;
}
