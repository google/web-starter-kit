const glob = require('glob');

module.exports = function(...args) {
  return new Promise((resolve, reject) => {
    glob(...args, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(files);
    });
  });
};
