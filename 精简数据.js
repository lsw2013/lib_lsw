var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var async = require('async');

var streamFile = function(filename) {
    var instream = fs.createReadStream(filename);
    var outstream = new stream;
    return readline.createInterface(instream, outstream);
}

var rl = streamFile('./in.txt');

var i = 0;
var startTime, stopTime;
var errCount = 0;

var colectorNum = '';
var obj = {},
    obj_i = 0,
    obj_rev = {},
    list = [],
    file_len = 0;


var Datetemp1 = new Date();
startTime = Datetemp1.getFullYear() + "-" + (Datetemp1.getMonth() + 1) + "-" + Datetemp1.getDate() + " " + Datetemp1.getHours() + ":" + Datetemp1.getMinutes() + ":" + Datetemp1.getSeconds() + ":" + Datetemp1.getMilliseconds();

rl.on('line', function(line) {
    if (line !== '') {
        var hn = line.substring(0, 8);
        if (!obj[hn]) {
            obj[hn] = line;
        }
        file_len++;
    }
});


rl.on('close', function() {
    var str = '';
    var i = 0;
    async.waterfall(
        [function(callback) {
            fs.exists('./out.txt', function(exists) {
                if (exists) {
                    console.log('文件[out.txt]已存在,删除中...');
                    callback(0);
                } else {
                    callback(-1);
                };
            });
        }, function(callback) {
            fs.unlink('./out.txt', function(err) {
                if (err) throw err;
                console.log('[out.txt]已删除');
                callback(0);
            });
        }],
        function(err) {
            for (k in obj) {
                fs.appendFileSync('./out.txt', obj[k].toString() + '\r\n', options = {
                    encoding: 'utf8'
                });
                i++;
            }
            console.log('总共处理了' + file_len + '行数据');
            console.log('总共有' + i + '个有效数据');
            var Datetemp2 = new Date();
            stopTime = Datetemp2.getFullYear() + "-" + (Datetemp2.getMonth() + 1) + "-" + Datetemp2.getDate() + " " + Datetemp2.getHours() + ":" + Datetemp2.getMinutes() + ":" + Datetemp2.getSeconds() + ":" + Datetemp2.getMilliseconds();
            console.log('\n输出结束！');
            process.exit(0);
        }
    );
});
