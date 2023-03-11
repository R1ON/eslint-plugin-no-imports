const meta = require('./src/meta');
const outsideSpecialFolder = require('./src/rule-outside-spicial-folder');

module.exports = {
  meta,
  rules: {
    'outside-special-folder': outsideSpecialFolder,
  }
};