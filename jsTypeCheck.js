function is(a) {
	return function(b) {
		return Object.prototype.toString.call(b) === '[object ' + a + ']';
	}
}

var isArray = is('Array');

// log(isArray.toString());

var c = {};

log(isArray(c));
