
class Util {
	static randomRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	static arrRandom(arr){
		var sonuc = arr[Math.floor(Math.random() * (arr.length))]
		return `${sonuc}`
	}
}

module.exports = Util;
