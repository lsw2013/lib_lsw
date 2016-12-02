// 2016年12月1日
// 循环任务

function Task() {
    this.interval = null;

    this.taskStatus = '';

    this.task1 = {
        name: 'task1',
        time: '3'
    }

    this.task2 = {
        name: 'task2',
        time: '2'
    }

    this.task3 = {
        name: 'task3',
        time: '5'
    }

    this.curTask = '';
    this.curTime = '';

    this.init();

}

Task.prototype.setTask = function (task) {
    this.curTask = task.name;
    this.curTime = task.time;
}


Task.prototype.init = function () {

    // this.SetTaskStatus('task1');
    this.setTask(this.task1);
    console.log('begin', this.curTask, this.curTime);
    if (!this.interval) {
        this.interval = setInterval(this.run, 1000, this);
    }
}

Task.prototype.run = function (self) {
    // console.log(self.curTask, ': left', self.curTime, 's.');
    if (self.curTask == 'task1') {
        self.runTask1();
    } else if (self.curTask == 'task2') {
        self.runTask2();
    } else if (self.curTask == 'task3') {
        self.runTask3();
    }
    // console.log(self.getTaskStatus());
}

Task.prototype.runTask1 = function () {
    this.curTime--;
    console.log(this.curTask, ': left', this.curTime, 's.');

    if (this.curTime <= 0) {
        this.setTask(this.task2);
    }
}

Task.prototype.runTask2 = function () {
    this.curTime--;
    console.log(this.curTask, ': left', this.curTime, 's.');
    if (this.curTime <= 0) {
        this.setTask(this.task3);
    }
}

Task.prototype.runTask3 = function () {
    this.curTime--;
    console.log(this.curTask, ': left', this.curTime, 's.');
    if (this.curTime <= 0) {
        this.setTask(this.task1);
    }
}


var t = new Task();






















