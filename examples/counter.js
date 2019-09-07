const persists = require ("persists");
const initialStats = {
	counter: 0
	};
persists ("stats", initialStats, undefined, function (stats) {
	setInterval (function () {
		console.log (stats.counter++);
		}, 1000);
	});
