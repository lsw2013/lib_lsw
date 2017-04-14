// 获取格式化的字符串

function getNumStr (num) {
	var str = '';
	var i = 0;
	if(num <= 4) {
		for(i = 0; i < num - 1; i++) {
			str += '	';
		}
		str += num.toString();
		for(i = num; i < 5; i++) {
			str += '	';
		}
		str += '|';
	}
	else {
		str += '				|';
		for(i = 0; i < num - 4; i++) {
			str += '	';
		}
		str += num.toString();
		for(i = num; i < 9; i++) {
			str += '	';
		}
	}
	return str;
}

log(getNumStr(5));
log(getNumStr(6));
log(getNumStr(7));
log(getNumStr(8));
log(getNumStr(3));
log(getNumStr(4));
log(getNumStr(1));
log(getNumStr(2));

//                                 |       5
//                                 |               6
//                                 |                       7
//                                 |                               8
//                 3               |
//                         4       |
// 1                               |
//         2                       |

