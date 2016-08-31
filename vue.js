// 替换vue的数组的位置
		function changeArr(arr, i1, i2) {
			var reArr = [];
			for (var i = 0; i < i1 - 1; i++) {
				reArr.push(arr.shift());
			}
			// console.log(a);
			// console.log(reArr);
			reArr.push(arr.splice(1, 1)[0]);
			// console.log(a);
			// console.log(reArr);
			var len = arr.length;
			for (var i = 0; i < len; i++) {
				reArr.push(arr.shift());
			}
			return reArr;
		}
