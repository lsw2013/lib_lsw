// 2016年12月1日
// redis读取所有数据

var redis = require('redis');
var waterfall = require('async').waterfall;
var each = require('async').each;

var client = redis.createClient();
client.on('error', function(error, response) {
    console.log(error);
});

var read = function() {
    var ret = {};

    waterfall([
        function(cb) { // 获取所有key
            client.keys('*', function(err, keys) {
                console.log(keys);
                ret.keys = keys;
                cb(null, keys)
            })
        },
        function(keys, cb) { // 获取所有key的类型，并存起来
            ret.stringKeys = [];
            ret.hashKeys = [];
            ret.listKeys = [];
            ret.setKeys = [];
            ret.zSetKeys = [];
            // every会在有一个值的情况下结束
            // each会对每一个值进行计算
            each(keys, function(key, callback) {
                // string(字符串) list(列表) set(集合) zset(有序集) hash(哈希表)
                client.type(key, function(err, type) {
                    console.log(key, ': ', type);
                    if (type == 'string') {
                        ret.stringKeys.push(key);
                    } else if (type == 'hash') {
                        ret.hashKeys.push(key);
                    } else if (type == 'list') {
                        ret.listKeys.push(key);
                    } else if (type == 'set') {
                        ret.setKeys.push(key);
                    } else if (type == 'zset') {
                        ret.zSetKeys.push(key);
                    }
                    callback(null);
                })
            }, function(err, result) {
                cb(null, ret); // 这里返回上一层的cb
                // if result is true then every file exists
            });
        },
        function(ret, cb) { // 获取所有string类型的数据
            ret.string = {};
            each(ret.stringKeys, function(key, callback) {
                        client.get(key, function(err, val) {
                            if (!err) {
                                ret.string[key] = val;
                            }
                            callback(null);
                        }); // end of client
                    },
                    function(err, rel) {
                        cb(null, ret);
                    }) // end of each
        },
        function(ret, cb) { // 获取所有hash类型的数据
            ret.hash = {};
            each(ret.hashKeys, function(key, callback) {
                        client.hgetall(key, function(err, val) {
                            if (!err) {
                                ret.hash[key] = val;
                            }
                            callback(null);
                        }); // end of client
                    },
                    function(err, rel) {
                        cb(null, ret);
                    }) // end of each
        },
        function(ret, cb) { // 获取所有list类型的数据
            ret.list = {};
            each(ret.listKeys, function(key, callback) {
                        client.lrange(key, 0, -1, function(err, val) {
                            if (!err) {
                                ret.list[key] = val;
                            }
                            callback(null);
                        }); // end of client
                    },
                    function(err, rel) {
                        cb(null, ret);
                    }) // end of each
        },
        function(ret, cb) { // 获取所有set类型的数据
            ret.set = {};
            each(ret.setKeys, function(key, callback) {
                        client.smembers(key, function(err, val) {
                            if (!err) {
                                ret.set[key] = val;
                            }
                            callback(null);
                        }); // end of client
                    },
                    function(err, rel) {
                        cb(null, ret);
                    }) // end of each
        },
        function(ret, cb) { // 获取所有set类型的数据
            ret.zset = {};
            // zset = {
            //     key1: {
            //         scoreList: [score1, score2],
            //         memberList: [member1, member2]
            //     },
            //     key2: {
            //         scoreList: [score1, score2],
            //         memberList: [member1, member2]
            //     }
            // }
            // zset.key1.member1.score = zset.key1.scoreList[zset.key1.memberList.indexOf(member1)];
            each(ret.zSetKeys, function(key, callback) {
                        // zrange: [member1, score1, member2, score2, ...]
                        client.zrange(key, 0, -1, 'withscores', function(err, val) {
                            console.log('val --------------');
                            console.log(Array.isArray(val));
                            if (!err) {
                                ret.zset[key] = {};
                                ret.zset[key].memberList = val.filter(function(v, i, arr) {
                                    return i % 2 === 0;
                                });
                                ret.zset[key].scoreList = val.filter(function(v, i, arr) {
                                    return i % 2 === 1;
                                });
                            }
                            callback(null);
                        }); // end of client
                    },
                    function(err, rel) {
                        cb(null, ret);
                    }) // end of each
        }
    ], function(err, rel) {
        console.log(JSON.stringify(rel));
        console.log(rel);  // in this case, zset's memberList and scoreList will show as 'Object', but infact it's Array 
        client.quit();
    });
    return ret;
};

read();