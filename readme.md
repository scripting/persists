## The persists package

Persistence for JavaScript objects in Node. 

#### Why

I found I was creating the same code in every Node app I wrote. 

* A global object called <i>stats</i> with properties like ctServerStarts, whenLastDayRollover, backupSerialNum. Sometimes even an array used to generate an RSS feed. 

* Then there's a global flag called <i>flStatsChanged.</i> When you change one or more values in stats, set it true.

* When the program starts, you read the stats object from a file called stats.json.

* Every second check if flStatsChanged is true, if so you set it false and write the JSONified object to stats.json. 

I wanted this to be a lot simpler. 

* At startup, call a function that creates a shared object called stats. 

* When I make a change to the object, <i>without calling a function</i> it detects the change, sets an internal flag to save the shared object at the top of the next second. 

* Once the shared object is created, as far as the app is concerned, stats is just a global variable.

Why is this possible now?

* The JavaScript <a href="https://davidwalsh.name/javascript-proxy">Proxy</a> object.  

### A simple app

<pre>const persists = require ("persists");
const initialStats = {
	counter: 0
	};
persists ("stats", initialStats, undefined, function (stats) {
	setInterval (function () {
		console.log (stats.counter++);
		}, 1000);
	});
</pre>

### About the demo app

1. The <i>persists</i> call creates a shared object we call stats. When we change a value in stats, it's automatically saved by the persist package. 

2. The data is saved in a JSON file in the local directory. The name specified in the first parameter says what we will call the file, in this case stats.json, and it must be unique within that folder. 

3. The second parameter specifies the initial values for the properties of the shared object. 

4. The third parameter, which is undefined in this example, provides options for the shared object, such as whether or not you want it to log assignments and saves.

5. When the shared object is ready to use, the callback is called with one parameter, the shared object. When you assign new values to properties of this object they are automatically saved by the persist package. 

### More you should know about persists

1. I thought about allowing callbacks for saving and restoring, and might yet still do it. It seemed like something to think about after a while, see how much use this gets, and what kinds of apps might be possible.

2. <i>persists</i> manages "shared objects." Your app can do what it would normally do with an object. Every second persist will see if it changed, and if so, save it. You don't have to do anything to tell it the object changed, it knows. That's the key innovation here. Saving is automatic. 

3. It checks to see if the object changed once a second. 

### A more complex test app

I wrote a test app, <a href="https://github.com/scripting/persists/blob/master/examples/lotsofobjects.js">lotsofobjects.js</a>, that makes sure each shared object is distinct from the others. This uncovered a flaw that when fixed made the <i>persists</i> code simpler.

### Changes

#### 9/6/19 by DW

Don't need a <i>get</i> handler, removed it. 

Made the console message on setting optional, defaults true.

Added an options param to persists, so we can pass other options in as-needed.

