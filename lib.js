
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
};

// 判断是不是数组
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

function mysqlJoin(arr) {
    return '`' + arr.join('`, `') + '`';
}

function getTbl(tbl, type) {
    var rlt = {};
    console.log(tbl);
    if (!tbl.tblName) {
        rlt = {
            err: 'has not find tblName!'
        }
    }
    if (!tbl.tblRow) {
        rlt = {
            err: 'has not find tblRow!'
        }
    }
    if (!isArray(tbl.tblRow)) {
        rlt = {
            err: 'typeof tblRow error; should be Array!'
        }
    }
    // 加速返回
    if (rlt.error) {
        return rlt;
    }
    var name = tbl.tblName,
        rows = tbl.tblRows,
        len = tbl.tblRows.length;
    var insertArr = [];
    for (var i = 0; i < len; i++) {
        insertArr.push('?');
    }
    var insertStr = insertArr.join(',');
    var rowsStr = mysqlJoin(rows);
    var tblSlt = 'SELECT ' + rowsStr + ' FROM ' + name;
    var tblIst = 'INSERT INTO `' + name + '` (' + rowsStr + ') VALUES (' + insertStr + ')';
    // update table test set num = 2 where id = 1;
    var upStr = '';
    for (i = 1; i < len; i++) {
        upStr = '`' + rows[i] + '` = ? ';
    };
    var tblUpById = 'UPDATE TABLE `' + name + '` SET ' + upStr + 'WHERE ' + rows[0] + ' = ?';
    var tblDelById = 'DELETE FROM TABLE `' + name + '` WHERE `' + rows[0] + '` = ?';
    rlt = {
        select: tblSlt,
        insert: tblIst,
        upById: tblUpById,
        delById: tblDelById
    };
    console.log(rlt);
}

