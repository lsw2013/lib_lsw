//用于从一个字符串中删除特定字符
//首字符不删除，末尾字符不删除
//str 为要处理的字符串，del为要删除的字符
function test(str, del) {
    if(!del) {
        del = "*";
    };
    var length = str.length, ret = '', arr = [];
    if(length < 2) {
        return str;
    };
    if(str[0] === del) {
        arr[0] = del;
    };
    if(length > 1 && str[length - 1] === del) {
        arr[1] = "*";
    };
    for(var i = 0; i < length; i++) {
        if(str[i] !== del) {
            ret = ret + str[i];
        } else {
            continue;
        };
    };
    if(arr[0]) {
        ret = arr[0] + ret;
    };
    if(arr[1]) {
        ret = ret + arr[1];
    };
    return ret;
};
console.log(test("*","*"));
console.log(test("**"));
console.log(test("*******"));
console.log(test("*123213*", "3"));
console.log(test("*2334**2342"));
console.log(test("123214124"));
