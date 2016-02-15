const fs = require('fs');
const path = require('path');

module.exports = {
  getTasks: () => {
    const tasksDirectory = path.join(__dirname, '..', '..', 'src', 'wsk-tasks');
    const tasksToTest = [];
    const taskFilenames = fs.readdirSync(tasksDirectory);

    taskFilenames.map(taskFilename => {
      tasksToTest.push({
        taskName: taskFilename,
        task: require(path.join(tasksDirectory, taskFilename))
      });
    });

    return tasksToTest;
  }
};
