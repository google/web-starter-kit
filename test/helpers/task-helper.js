const fs = require('fs');
const path = require('path');

module.exports = {
  getTasks: () => {
    const tasksDirectory = path.join(__dirname, '..', '..', 'src', 'wsk-tasks');
    const tasksToTest = [];
    const taskFilenames = fs.readdirSync(tasksDirectory);

    taskFilenames.map(taskFilename => {
      if (taskFilename === 'task-helper.js') {
        return;
      }
      
      tasksToTest.push({
        taskName: taskFilename,
        taskPath: path.join(tasksDirectory, taskFilename)
      });
    });

    return tasksToTest;
  }
};
