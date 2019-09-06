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

The <i>persists</i> call creates a shared object we call stats. When we change a value in stats, it's automatically saved by the persist package. 

The data is saved in a JSON file in the local directory. The name specified in the first parameter says what we will call the file, in this case stats.json, and it must be unique within that folder. 

The second parameter specifies the initial values for the properties of the shared object. 

The third parameter, which is undefined in this example, provides options for the shared object, such as whether or not you want it to log assignments and saves.

When the shared object is ready to use, the callback is called with one parameter, the shared object. When you assign new values to properties of this object they are automatically saved by the persist package. 

### More you should know about persists

I thought about allowing callbacks for saving and restoring, and might yet still do it. It seemed like something to think about after a while, see how much use this gets, and what kinds of apps might be possible.

"Shared objects" is what <i>persists</i> manages. That's why this works. Your app can do what it would normally do with a persistent object. I will use it for stats which each app has to manage for itself. Finally figured out how to factor this so it could be packed away in a lower level and forgotten.

It checks to see if the object changed once a second. 

I wrote a test app, <a href="https://github.com/scripting/persists/blob/master/examples/lotsofobjects.js">lotsofobjects.js</a>, that makes sure each shared object is distinct from the others. This uncovered a flaw that when fixed made the <i>persists</i> code simpler.

### Changes

#### 9/6/19 by DW

Don't need a <i>get</i> handler, removed it. 

Made the console message on setting optional, defaults true.

Added an options param to persists, so we can pass other options in as-needed.

