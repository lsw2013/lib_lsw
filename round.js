// round.js
// 百家乐逻辑
// 2016年11月18日
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

/**
 * 判断花色是否相同
 * player = {
 * 1: 'A3',  // 红桃3
 * 2: 'B5'	// 黑桃5
 * }
 */
function checkPlayerSuit(player) {
	var suit = '';
	var tmpSuit = '';
	for (k in player) {
		suit = player[k].substring(0, 1);
		if (!tmpSuit) {
			tmpSuit = suit;
		} else {
			if (tmpSuit !== suit) {
				return false;
			}
		}
	}
	return true;
}

// 获取玩家的点数
function getCardsPoint(player) {
	var num = 0;
	var tmp = 0;
	for (k in player) {
		tmp = player[k].substring(1);
		tmp = parseInt(tmp);
		// 如果点数大于9则记作0
		tmp = tmp > 9 ? 0 : tmp;
		num += tmp;
	}
	// 如果总点数大于9则只要个位数
	num = num > 10 ? num - 10 : num;
	return num;
}

// round.start(n) 初始化n副牌的牌池
// round.next() 消耗牌池并返回结果，如果牌池消耗完，自动start新牌池
// round.getResultList() 返回历史结果列表
var Round = function() {

	// 公共数据可以放在外面，私有数据需要放在里面，防止被其它实例修改掉。
	var numPool = [];
	var cardPool = [];
	var round = {
		banker: {},
		player: {}
	}; // 一局里面的局势
	var result = {};
	var resultList = [];

	// start：初始化牌局
	this.start = function(num) {
		this.genNumPool(num).genCardPool();
		return this;
	}

	// round：进行一局游戏
	this.getRoundResult = function() {
		return this.genRound().genResult().getResult();
		// return this;  此处不能return this...  上面的getResult()处已有return;
	}

	// next：下一局
	this.next = function() {
		return this.getRoundResult();
	}

	// 生成数字池
	this.genNumPool = function(num) {
		num = num || CARDS_NUM;
		if (typeof num !== 'number') {
			throw new TypeError('need a number but not given!', 'bjl.js');
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

	// 生成牌局
	this.genRound = function() {
		// 如果牌池的牌数量是0，生成牌池
		if (cardPool.length === 0) {
			this.start(CARDS_NUM);
		}
		if (cardPool.length < 4) {
			throw new Error('last pork isn\'t enough! game over!')
			var newPool = getCardPool(getNumPool());
			cardPool = cardPool.concat(newPool);
		}
		round.player[1] = cardPool.shift();
		round.banker[1] = cardPool.shift();
		round.player[2] = cardPool.shift();
		round.banker[2] = cardPool.shift();
		// log(this.getCardPool().length);
		return this;
	}


	/**
	 * 百家乐生成结果
	 * banker,player数据结构相同
	 */
	this.genResult = function() {
		// var round = this.getRound();
		var banker = round.banker;
		var player = round.player;
		var bankerPoint = getCardsPoint(banker);
		var playerPoint = getCardsPoint(player);
		var bRlt = Math.abs(bankerPoint - 9); 
		var pRlt = Math.abs(playerPoint - 9);
		if (bRlt > pRlt) {
			result.winner = 'player';
		} else if (bRlt === pRlt) {
			result.winner = 'none';
		} else {
			result.winner = 'banker';
		}
		// result.winner = bRlt > pRlt ? 'player' : 'banker';
		result.bankerSuit = checkPlayerSuit(banker);
		result.playerSuit = checkPlayerSuit(player);
		var tmpObj = {};
		for(k in result) {
			tmpObj[k] = result[k];
		}
		resultList.push(tmpObj);  // 不能直接push result,也不能tmpObj = result；引用类型好烦
		return this;
	}

	// 获取私有变量的函数放在最后
	this.getNumPool = function() {
		return numPool;
	}

	this.getCardPool = function() {
		return cardPool;
	}

	this.getRound = function() {
		return round;
	}

	this.getResult = function() {
		return result;
	}

	this.getResultList = function() {
		return resultList;
	}
}

var r = new Round();
r.start(2);

// log(r.getCardPool().length);

for(var i = 0; i < 52; i++) {
	// log(r.next());
	log(r.getCardPool().length);
	r.next();
}
// log(r.getResultList());



module.exports = Round;