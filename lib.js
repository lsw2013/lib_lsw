
// 使用source的属性来扩展target的属性
function extend(target, source) {
	if(source) {
		for(var key in source) {
			var val = source[key];

			if (typeof val !== "undefined") {
				target[key] = val;
			}
		}
	}
	return target;
}

// 判断是不是数组
function isArray(o) {
	return Object.prototype.toString.call(o) === '[object Array]';
}
