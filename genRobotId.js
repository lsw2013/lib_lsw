function genRobotId (type, num) {
    console.log('开始生成机器人ID ..............');
    console.log(type, num);

    var idList = [];

    if(!num) {
    	num = type;
    	type = 'add';
    }  // 默认是添加机器人

    var idNum = consts.ROBOT.ID_NUM || 1000;  // 默认循环1000个ID

    var len = this.robotList.length;  // 当前机器人队列的长度

    var BEGIN_ID = consts.ROBOT.BEGIN_ID;  // 配置的机器人开始ID
    var END_ID = consts.ROBOT.END_ID;  // 配置的机器人结束ID

    // 当this.robotList = [] 的时候，不用默认值的话此两项为undefined
    var beginId = this.robotList[0] || BEGIN_ID;  // 机器人队列的第一个机器人
    var endId = this.robotList[len-1] || BEGIN_ID;  // 最后一个机器人


    if((len + num) >= (END_ID - BEGIN_ID + 1)) {
        return idList;  // 如果ID数量已经满了，就直接返回
    }

    var i = 0,  // 循环用
        leftNum = 0,  // 从开头算的ID数量 // 队列左边的
        rightNum = 0;  // 从结尾算的ID数量  // 右边的

    if(type === 'add') {  // 添加机器人
        if((endId + num) <= END_ID) {
            rightNum = num;
        }
        else {
            rightNum = END_ID - endId;
            leftNum = num - rightNum;
        }
        for(; i++ < rightNum; ) {
            idList.push(endId + i);  // 从队列的结尾加1，累加
        }
        for(i = 0; i < leftNum; i++) {
            idList.push(BEGIN_ID + i);  // 从ID池的开头
        }
    }
    else if(type === 'del') {  // 删除机器人
        if(len <= num) {  // 如果总数量还没有删除数量多，返回全部ID
            return this.robotList;
        }
        else {
            // 总数量超过了要删除的数量，一定能够获取到足够多的ID
            if(this.robotList.indexOf(END_ID) > -1) {
                // 如果已经用到了或者超过了最后一个ID
                if((END_ID - beginId) > num) {
                    rightNum = num;  // 右边的就已经够用
                }
                else {
                    // 右边全删，左边删剩下的
                    rightNum = END_ID - beginId;
                    leftNum = num - rightNum;
                }
            }
            else {
                // 没有用到最后一个ID
                rightNum = num;  // 右边的够用。其实是中间的右边的
            }
            for(i = 0; i < rightNum; i++) {
                idList.push(beginId + i);  // 从队列的开头
            }
            for(i = 0; i < leftNum; i++) {
                idList.push(BEGIN_ID + i);  // 从ID池的开头
            }
        }
    }

    return idList;
};
