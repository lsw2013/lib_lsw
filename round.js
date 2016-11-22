// round.js
// 百家乐逻辑
// round：接收一个pool，每次round.next()进行下一步
// round.next()返回结果或者返回 '牌池已空'
// 每局开始先各发两张牌pushCards，然后判断是不是需要补牌check
// 2016年11月18日
// var CardPool = require('./cardPool.js');

var CardPool = require('./cardPool.js');
var log = console.log;
const CARDS_NUM = 4;
var suit = {
	1: 'A',
	2: 'B',
	3: 'C',
	4: 'D'
};

// 公共方法放在外面

// 获取牌点数
function getPoint(card) {
	return parseInt(card.substring(1));
}

// 返回真正的点数
function getRealPoint(point) {
	return point > 9 ? 0 : point;
}

// 检查牌点数是不是9
function checkNine(card) {
	return getPoint(card) === 9;
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
		tmp = getPoint(player[k]);
		// 如果点数大于9则记作0
		tmp = tmp > 9 ? 0 : tmp;
		num += tmp;
	}
	// 如果总点数大于9则只要个位数
	num = num > 9 ? num - 10 : num;
	return num;
}


// round.start(n) 初始化n副牌的牌池
// round.next() 消耗牌池并返回结果
// // 如果牌池消耗完，自动start新牌池
// round.getResultList() 返回历史结果列表
var Round = function(cardPool) {

	// 公共数据可以放在外面，私有数据需要放在里面，防止被其它实例修改掉。
	var player = {};
	var banker = {};

	var round = {
		player: player,
		banker: banker
	}; // 一局里面的局势

	var bankerPoints = 0;
	var playerPoints = 0;

	var result = {
		winner: '',
		playerSuit: false,
		bankerSuit: false
	};
	var resultList = [];
	var roundEnd;

	// 私用方法放前面
	function getCard() {
		return cardPool.shift();
	}

	// 获取结果
	function genResult() {
		// log('genResult:     p:', playerPoints, 'b:', bankerPoints);

		if (playerPoints > bankerPoints) {
			result.winner = 'player';
		} else if (playerPoints === bankerPoints) {
			result.winner = 'none';
		} else {
			result.winner = 'banker';
		}
	}

	// 检查玩家是否需要补牌，先不管庄家最终不得补牌的情况
	function checkNatural () {
		// 都不需要补牌的情况
		// if (playerPoints >= 6 && bankerPoints >= 7) {
		if (playerPoints >= 6 && bankerPoints >= 7) { // 只要玩家大于等于6，并且庄家大于等于7，就都不能补牌了，结束
			roundEnd = true;
			// result.winner = playerPoints > bankerPoints ? 'player' : 'banker';
		// log('checkNatural: p:', playerPoints, 'b:', bankerPoints);

			genResult();
		}
	}

	// 检查庄家是否补牌
	// 检查玩家的牌来判断庄家是否需要补牌，此时玩家的牌是0-5，庄家的牌是0-6
	// 返回即定胜负的情况(庄家不能补牌的情况)
	// 用来锁定胜局，其它的是庄家需要补牌的情况
	function checkPlayerCard() {
		var point = getPoint(player[3]);
		// 庄家不能补牌的情况，此时玩家已经补牌
		if (bankerPoints === 3 && point === 8) {
			// 庄家是3点且玩家第三张牌是8，不补牌
			roundEnd = true;
		} else if (bankerPoints === 4 && (point >= 8 || point === 1)) {
			// 庄家是4点且闲家第3张牌是1,8,9,10,11,12,13 (0,1,8,9)
			roundEnd = true;
		} else if (bankerPoints === 5 && (point >= 8 || point <= 3)) {
			// 庄家是5点且闲家第3张牌是0,1,2,3,8,9 (1,2,3 8,9,10,11,12,13)
			roundEnd = true;
		} else if (bankerPoints === 6 && (point < 6 || point > 7)) {
			// 庄家是6点且玩家第3张牌是不是6或7
			roundEnd = true;
		}
		// 既然发牌了就需要重新计算玩家真正点数，而不是要结束才计算
		point = getRealPoint(point);
		playerPoints += point;
		playerPoints = playerPoints > 9 ? playerPoints - 10 : playerPoints;
		// 如果结束，判断结果
		if (roundEnd) {
		log('checkPlayerCard: p:', playerPoints, 'b:', bankerPoints);
			genResult();
		}

	}

	// 发牌
	this.pushCards = function() {
		round.player[1] = getCard();
		round.banker[1] = getCard();
		round.player[2] = getCard();
		round.banker[2] = getCard();
		result.bankerSuit = checkPlayerSuit(banker);
		result.playerSuit = checkPlayerSuit(player);
		return this;
	}

	// 获取结果
	// 1.检查双方是否为8或9(天牌)，判断是否结束
	// 2.检查闲是否需要补牌
	// 3.判断庄是否需要补牌
	// 4.判断结果
	this.getRoundResult = function() {
		playerPoints = getCardsPoint(player);  // 0
		bankerPoints = getCardsPoint(banker);  // 6
		// log('getRoundResult: p:', playerPoints, 'b:', bankerPoints);
		checkNatural();  // 检查是不是都不能补牌

		if (!roundEnd) {  // 玩家补牌，检查庄家是否需要补牌
			// log('player get card!');
			if(playerPoints <= 5) {
				// 只有玩家的点数小于等于5才可以补牌，否则就到下一步
				player[3] = getCard();
				checkPlayerCard();
			}
		}

		if (!roundEnd) {  // 庄家补牌，判断结果
			// log('banker get card!');
			// log('getRoundResult2: p:', playerPoints, 'b:', bankerPoints);
			if(bankerPoints <= 6) {
				// 前面的checkPlayerCard() 已经过滤掉了庄不能补牌的情况
				// 因此只要庄这里的小于5都可以补牌
				banker[3] = getCard();
				roundEnd = true;
				bankerPoints = bankerPoints + getRealPoint(getPoint(banker[3]));
				bankerPoints = bankerPoints > 9 ? bankerPoints - 10 : bankerPoints;
			}
			
		// log('getRoundResult2: p:', playerPoints, 'b:', bankerPoints);

			genResult();
		}
		var tmpResult = {};
		tmpResult = result;

		resultList.push(tmpResult);
		return result;
	}

	// next：下一局
	this.next = function() {
		// 初始化所有信息
		roundEnd = false;
		player = {};
		banker = {};
		round = {
			player: player,
			banker: banker,
		};
		pGetCard = false;
		bGetCard = true;
		result = {
			winner: '',
			bankerSuit: false,
			playerSuit: false
		}
		return this.pushCards().getRoundResult();
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

var p = new CardPool().get(8);

var r = new Round(p);
// log(r.next());
// log(r.getRound());
// log(r.getResult());
// log(r.getResultList());

// log(r.getCardPool().length);

// var card = '';
// for(var i = 0; i < 50; i++) {
// 	card += r.getCardPool()[i] + ' ';
// 	if((i+1)%10 === 0) {
// 		card += '\r\n';
// 	}
// }
// log(card);

// var l = [];
for (var i = 0; i < 24; i++) {
	// (function(i) {
	// 	var a = {};
	// 	a[i] = i;
	// 	l.push(a);
	// })(i);
	
	log(r.getCardPool().length);
	// log(r.next());
	r.next();
	// log(r.getRound());
	if(r.getRound().banker[3]) {
		log(r.getRound());
	}
	log(r.getResult());
}
// log(l);
log();
// log(r.getResultList());


module.exports = Round;
