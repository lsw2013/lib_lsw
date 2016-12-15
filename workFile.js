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

console.log(getNoRepetList(uidList, 'uid').join(','));

/**
 * 2016年12月15日
 * 输入有重复元素的数组，返回去掉重复元素的数组
 * 检验用数组查询和用对象查询的速度
 */
function getNoRepeatList1(arr) {
    var obj = {};
    var len = arr.length;
    var reList = [];
    var i = 0;
    var count = 0;
    for (; i < len; i++) {
        if (!obj.hasOwnProperty(arr[i])) {
            obj[arr[i]] = true;
            reList.push(arr[i]);
            count++;
        }
    }
    console.log('noRepeatVal: ' + count);    
    return reList;
}

function getNoRepeatList2(arr) {
    var len = arr.length;
    var reList = [];
    var i = 0;
    var count = 0;
    for (; i < len; i++) {
        if (reList.indexOf(arr[i]) < 0) {
            reList.push(arr[i]);
            count++;
        }
    }
    console.log('noRepeatVal: ' + count);
    return reList;
}

var arr1 = [];

// 生成随机大小的数字
function genRandomNum (min, max) {
	return min + parseInt(Math.random() * (max - min));
};

var i = 0;
console.time('arr');
for(; i < 10000; i++) {
    arr1.push(genRandomNum(0, 10000));
}
console.timeEnd('arr');

var arr2 = arr1.slice(0, arr1.length);

console.time('arr1');
console.log(arr1.length);
getNoRepeatList1(arr1);
console.timeEnd('arr1');

console.time('arr2');
console.log(arr2.length);
getNoRepeatList2(arr2);
console.timeEnd('arr2');

// 结果证明，对象遍历速度比数组快得多
// D:\test>node checkList.js
// arr: 2ms
// 10000
// noRepeatVal: 6293
// arr1: 5ms
// 10000
// noRepeatVal: 6293
// arr2: 56ms

// D:\test>node checkList.js
// arr: 2ms
// 10000
// noRepeatVal: 6331
// arr1: 4ms
// 10000
// noRepeatVal: 6331
// arr2: 56ms
