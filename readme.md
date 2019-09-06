## The persists package

Persistence for JavaScript objects in Node. 

### How to use

Here's an app that adds one to a counter every second. If you stop it and restart, counter will start with its last value.

```

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


```

### Changes

9/6/19 by DW

Don't need a <i>get</i> handler, removed it. 

Made the console message on setting optional, defaults true.

Added an options param to persists, so we can pass other options in as-needed.

