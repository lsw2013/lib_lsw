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
function getNoRepetList(list, prop) {
	var obj = {},
		len = list.length,
		list_i = '',
		reList = [];
	for (var i = 0; i < len; i++) {
		list_i = list[i][prop];
		if (!obj.hasOwnProperty(list_i)) {
			obj[list_i] = 1;
		};
	};
	for (k in obj) {
		reList.push(k);
	};
	return reList;
};

console.log(getNoRepetList(uidList, 'uid').join(','));
