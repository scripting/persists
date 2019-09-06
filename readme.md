## The persists package

Persistence for JavaScript objects in Node. 

### A simple app

<pre>const persists = require ("persists");
const inititalStats = {
	counter: 0
	};
persists ("stats", inititalStats, undefined, function (stats) {
	setInterval (function () {
		stats.counter++;
		}, 1000);
	});
</pre>

### Narrative for the simple app

The <i>persists</i> call creates a shared object we call stats. When we change a value in stats, it's automatically saved by the persist package. 

The data is saved in a JSON file in the local directory. The name specified in the first parameter says what we will call the file, in this case stats.json, and it must be unique within that folder. 

The second parameter specifies the initial values for the properties of the shared object. 

The third parameter, which is undefined in this example, provides options for the shared object, such as whether or not you want it to log assignments and saves.

When the shared object is ready to use, the callback is called with one parameter, the shared object. When you assign new values to properties of this object they are automatically saved by the persist package. 

### Changes

#### 9/6/19 by DW

Don't need a <i>get</i> handler, removed it. 

Made the console message on setting optional, defaults true.

Added an options param to persists, so we can pass other options in as-needed.

