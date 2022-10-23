var randomSentence = require('random-sentence');

module.exports.generateObjectMessage = (num) => {
  let messages = [];

  for (let i = 0; i < num; i++) {
    const rem = Math.floor(Math.random() * 5);
    let type = 'PNT';
    if (rem === 1) {
      type = 'DZ';
    } else if (rem === 2) {
      type = 'MCP';
    } else if (rem === 3) {
      type = 'AZ';
    } else if (rem === 4) {
      type = 'FAD';
    }

    // module
    const name = randomSentence({ words: 1 });
    // tag
    const tag = makeID(5);

    // message object
    const message = {
      tag,
      name,
      type,
    };

    messages.push(message);
  }
  return messages;
};

const makeID = (length) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
