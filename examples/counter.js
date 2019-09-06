const persists = require ("persists");
const inititalStats = {
	counter: 0
	};
const options = {
	flLogToConsole: true
	};
persists ("stats", inititalStats, options, function (stats) {
	setInterval (function () {
		stats.counter++;
		}, 1000);
	});
