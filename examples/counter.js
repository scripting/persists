const persists = require ("persists");
const inititalStats = {
	counter: 0
	};
persists ("stats", inititalStats, undefined, function (stats) {
	setInterval (function () {
		stats.counter++;
		}, 1000);
	});
