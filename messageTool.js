var randomSentence = require('random-sentence');

//The maximum is exclusive and the minimum is inclusive
module.exports.generateAlarmFaultMessages = (num) => {
  let messages = [];

  for (let i = 0; i < num; i++) {
    const rem = Math.floor(Math.random() * 3);
    let type = 'alarm';
    if (rem === 1) {
      type = 'fault';
    } else if (rem === 2) {
      type = 'unknow';
    }
    const now = new Date();

    // module
    const mod = randomSentence({ words: 1 });
    // tag
    const tag = randomSentence({ words: 1 });

    // message object
    const message = {
      description: makeDescription(5),
      key: makeKey(type, mod, tag),
      module: mod,
      name: randomSentence({ words: 2 }),
      tag: tag,
      time: now.valueOf(),
      value: makeValue(),
    };

    const meta = {
      codec: 'alarmMsg',
      deleted: false,
      quality: 'normal',
      type,
    };

    messages.push({ message, meta });
  }
  return messages;
};

var randomSentence = require('random-sentence');

//The maximum is exclusive and the minimum is inclusive
module.exports.generateMessagesByType = (num, type) => {
  let messages = [];

  for (let i = 0; i < num; i++) {
    const now = new Date();

    // module
    const mod = randomSentence({ words: 1 });
    // tag
    const tag = randomSentence({ words: 1 });

    // message object
    const message = {
      description: makeDescription(5),
      key: makeKey(type, mod, tag),
      module: mod,
      name: randomSentence({ words: 2 }),
      tag: tag,
      time: now.valueOf(),
      value: makeValue(),
    };

    const meta = {
      codec: 'alarmMsg',
      deleted: false,
      quality: 'normal',
      type,
    };

    messages.push({ message, meta });
  }
  return messages;
};

const makeDescription = (length) => {
  const obj = { text: randomSentence({ words: length }) };
  return [obj];
};

const makeKey = (type, mod, tag) => {
  return [type, mod, tag, Math.floor(Math.random() * 99)];
};

const makeID = (length) => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const makeValue = () => {
  const obj = { ack: { state: false, option: 'individual' } };
  return [obj];
};
