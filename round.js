// round.js
// 百家乐逻辑
// round：接收一个pool，每次round.next()进行下一步
// round.next()返回结果或者返回 '牌池已空'
// 每局开始先各发两张牌pushCards，然后判断是不是需要补牌check
// 2016年11月18日
// var CardPool = require('./cardPool.js');

// 所有的牌局都是存在round.js中的；
// 通过接口设置、获取牌局；
var CardPool = require('./cardPool.js');
var exp = module.exports;

// var roundObj = {};
var cardPoolObj = {};  // 牌池才需要存起来，过程不用存
var resultListObj = {};

// 获取牌点数
function getPoint(card) {
	return parseInt(card.substring(1));
}

// 返回真正的点数
function getRealPoint(point) {
	return point > 9 ? 0 : point;
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

// 为一个房间初始化牌局
function initCardPool(rid) {
	if(!cardPoolObj[rid]) {
		var cardPool = new CardPool().get(8);
		cardPoolObj[rid] = cardPool;
		resultListObj[rid] = [];
	}
	return cardPoolObj[rid];
}

// 一个牌局进行一轮
function next(rid) {

	var cardPool;

	// 初始化所有信息
	if(!cardPoolObj[rid]) {
		cardPool = initCardPool(rid);
	}
	if(!resultListObj[rid]) {
		resultListObj[rid] = [];
	}

	cardPool = cardPoolObj[rid];

	var player = {};
	var banker = {};
	var bankerPoints = 0;
	var playerPoints = 0;
	var roundEnd = false;
	var round = {
		player: player,
		banker: banker,
	};

	var result = {
		winner: '',
		bankerSuit: false,
		playerSuit: false
	};

	var resultList = [];

	function getCard() {
		return cardPool.shift();
	}

	// 发牌
	function pushCards() {
		round.player[1] = getCard();
		round.banker[1] = getCard();
		round.player[2] = getCard();
		round.banker[2] = getCard();
		result.bankerSuit = checkPlayerSuit(banker);
		result.playerSuit = checkPlayerSuit(player);
	}

	// 获取结果
	function getRoundResult() {
		playerPoints = getCardsPoint(player);  // 0
		bankerPoints = getCardsPoint(banker);  // 6
		checkNatural();  // 检查是不是都不能补牌

		if (!roundEnd) {  // 玩家补牌，检查庄家是否需要补牌
			if(playerPoints <= 5) {
				// 只有玩家的点数小于等于5才可以补牌，否则就到下一步
				player[3] = getCard();
				checkPlayerCard();
			}
		}

		if (!roundEnd) {  // 庄家补牌，判断结果
			if(bankerPoints <= 6) {
				// 前面的checkPlayerCard() 已经过滤掉了庄不能补牌的情况
				// 因此只要庄这里的小于5都可以补牌
				banker[3] = getCard();
				roundEnd = true;
				bankerPoints = bankerPoints + getRealPoint(getPoint(banker[3]));
				bankerPoints = bankerPoints > 9 ? bankerPoints - 10 : bankerPoints;
			}
			genResult();
		}
		var tmpResult = {};
		tmpResult = result;

		resultListObj[rid].push(tmpResult);
	}

	// 获取结果
	function genResult() {
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
			genResult();
		}
	}

	pushCards();
	getRoundResult();

	var cardObj = {};
	cardObj.len = 4;
	for(var i = 0; i < 2; i++) {
		cardObj['p' + i] = round.player[i];
		cardObj['b' + i] = round.banker[i];
	}
	if(round.player[3]) {
		cardObj['p3'] = round.player[3];
		cardObj.len++;
	}
	if(round.banker[3]) {
		cardObj['b3'] = round.banker[3];
		cardObj.len++;
	}

	return {round: round, result: result};
}

function getRltList(rid) {
	return resultListObj[rid];
}

function getCardPool(rid) {
	return cardPoolObj[rid];
}


exp.initCardPool = initCardPool;
exp.next = next;
exp.getRltList = getRltList;
exp.getCardPool = getCardPool;
