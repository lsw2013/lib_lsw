var uidList = [{
	uid: 2
}, {
	uid: 3
}, {
	uid: 1
}, {
	uid: 4
}, {
	uid: 3
}, {
	uid: 2
}];

// 为了精简在用in查询数据库时候的数据数量
/**
 * 获取不重复某一属性值的对象数组
 * list = [{prop: 1}, {prop: 2}];
 */
function getNoRepeatObjList(list, prop) {
    var obj = {},
        len = list.length,
        val = '',
        reList = [],
        i = 0;

    for (; i < len; i++) {
        val = list[i][prop];
        if (!obj.hasOwnProperty(val)) {
            obj[val] = true;
            reList.push(list[i]);
        };
    };

    return reList;
};

/**
 * 2016年12月15日
 * 输入有重复元素的数组，返回去掉重复元素的数组
 * 检验用数组查询和用对象查询的速度
 */
function getNoRepeatList(arr) {
    var obj = {};
    var len = arr.length;
    var reList = [];
    var i = 0;
    for(; i < len; i++) {
        if(!obj.hasOwnProperty(arr[i])) {
            obj[arr[i]] = true;
            reList.push(arr[i]);
        }
    }
    return reList;
}

console.log(getNoRepetList(uidList, 'uid').join(','));
