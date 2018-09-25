
var exp = exports = module.exports;

// 使用 source 的属性来扩展 target 的属性
function extend(target, source) {
    if (source) {
        for (var key in source) {
            var val = source[key];

            if (typeof val !== "undefined") {
                target[key] = val;
            }
        }
    }
    return target;
}

// 获取一个概率值
// some = 1, all = 5, 获取一个1/5的概率真值
function probability(some, all) {
    var tmp = Math.random();
    return tmp < some / all;
}
// 生成平均分布的 [min, max] 区间的数字
function genRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    // return Math.floor(Math.random() * (max - min)) + min; // [min, max) // 不包括max
    // return Math.ceil(Math.random() * (max - min + 1)) + min; // (min, max] // 不包括min
}

// 判断是不是数组
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}
exp.extend = extend;
exp.probability = probability;
exp.genRandomNum = genRandomNum;
exp.isArray = isArray;
