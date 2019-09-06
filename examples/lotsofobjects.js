//a test that creates a bunch of shared objects and then changes them every second.

const persists = require ("persists");
const utils = require ("daveutils");

const inititalStats = {
	mynum: 0,
	counter: 0, 
	random: 0
	};
const config = {
	flLogToConsole: false
	};
for (var i = 0; i < 10; i++) {
	inititalStats.mynum = i;
	persists ("obj" + i, inititalStats, config, function (stats) {
		setInterval (function () {
			stats.counter++;
			stats.random = utils.random (0, i);
			}, 1000);
		});
	}
