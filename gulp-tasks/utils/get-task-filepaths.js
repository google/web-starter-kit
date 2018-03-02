const path = require('path');
const fs = require('fs');

module.exports = function() {
  const tasksDirectory = path.join(__dirname, '..');
  const taskFileNames = fs.readdirSync(tasksDirectory);
  const fullPaths = [];
  for (const taskFileName of taskFileNames) {
    if (path.extname(taskFileName) !== '.js') {
      // If the file doesn't end in .js, then it is unlikely it's a gulp task
      // so skip over it.
      continue;
    }

    fullPaths.push(path.join(tasksDirectory, taskFileName));
  }
  return fullPaths;
};
