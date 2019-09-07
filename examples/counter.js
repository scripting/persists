const persists = require ("../persists.js");
const initialStats = {
	counter: 0
	};
const config = {
	flPersistsLog: false,
	maxSecsBetwSaves: 3
	};
persists ("stats", initialStats, config, function (stats) {
	setInterval (function () {
		console.log (stats.counter++);
		}, 1000);
	});
