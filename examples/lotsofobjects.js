//a test that creates a bunch of shared objects and then changes them every second.

const persists = require ("../persists.js");
const utils = require ("daveutils");

const initialStats = {
	mynum: 0,
	counter: 0, 
	random: 0
	};
const config = {
	flPersistsLog: false
	};
for (var i = 0; i < 10; i++) {
	initialStats.mynum = i;
	persists ("obj" + i, initialStats, config, function (stats) {
		setInterval (function () {
			stats.counter++;
			stats.random = utils.random (0, stats.mynum);
			}, 1000);
		});
	}
