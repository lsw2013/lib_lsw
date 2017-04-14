// cardPool.js
// 只生成牌局
// 2016年11月21日
var log = console.log;
const CARDS_NUM = 4;
var suit = {
	1: 'A',
	2: 'B',
	3: 'C',
	4: 'D'
};

// 公共方法放在外面
function randomsort(a, b) {
	return Math.random() > 0.5 ? -1 : 1;
	//用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
}

var CardPool = function() {

	// 公共数据可以放在外面，私有数据需要放在里面，防止被其它实例修改掉。
	var numPool = [];
	var cardPool = [];

	// start：初始化牌局
	this.get = function(num) {
		return this.genNumPool(num).genCardPool().getCardPool();
	}

	// 生成数字池
	this.genNumPool = function(num) {
		num = num || CARDS_NUM;
		if (typeof num !== 'number') {
			throw new TypeError('need a number but not given!', 'cardPool.js');
			return;
		}
		// 获取1到52*n顺序的数组
		for (var a = 1, count = 52 * num; a <= count; a++) {
			numPool.push(a);
		}
		// 再打乱它
		numPool = numPool.sort(randomsort);
		return this;
	}

	// 生成牌池
	this.genCardPool = function() {
		for (var i = 0, len = numPool.length; i < len; i++) {
			var num = numPool.pop();
			// 花色
			var cardSuit = parseInt(num % 4) + 1;
			cardSuit = suit[cardSuit];
			// 点数
			var point = (num % 52) % 13 + 1;
			// 推进牌池
			cardPool.push(cardSuit + point);
		}
		// 牌池get
		return this;
	}

	// 获取私有变量的函数放在最后
	this.getNumPool = function() {
		return numPool;
	}

	this.getCardPool = function() {
		return cardPool;
	}
}

// var r = new CardPool();
// var a = r.get(1);

// // log(r.getCardPool().length);

// for(var i = 0, len = a.length, str = ''; i < len; i++) {
// 	str += a[i] + '_';
// }
// log(len);
// log(str);

/**
 * 使用方法
 * var CardPool = require('./cardPool.js');
 * var p = new CardPool().get(4);
*/


module.exports = CardPool;