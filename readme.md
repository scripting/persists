## The persists package

Persistence for JavaScript objects in Node. 

#### How to use

<code>npm install persists</code>

#### What is it for?

I found I was creating the same code in every Node app I wrote. 

* A global object called <i>stats</i> with properties like ctServerStarts, whenLastDayRollover, backupSerialNum. Sometimes even an array used to generate an RSS feed. 

* There's a global flag called <i>flStatsChanged.</i> When one or more values in stats changes, set flStatsChanged true.

* When the program starts,  read the stats object from a file called stats.json.

* Every second check flStatsChanged, if true set it false and write the JSONified object to stats.json. 

I wanted this to be a lot simpler. 

* At startup, call a function that creates a shared object called stats. 

* When I make a change to the object, <i>without calling a function</i> persists detects the change, sets an internal flag to save the shared object, which it does at the top of the next second. 

* Once the shared object is created, as far as the app is concerned, stats is just a global variable.

Why is this possible now?

* The JavaScript <a href="https://davidwalsh.name/javascript-proxy">Proxy</a> API.  

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

### About the demo app

1. The <i>persists</i> call creates a shared object we call stats. When we change a value in stats, it's automatically saved by the persist package. 

2. The data is saved in a JSON file in the local directory. The name specified in the first parameter says what we will call the file. 

3. The second parameter specifies the initial values for the shared object. 

4. The third parameter, which is undefined in this example, provides options for the shared object, such as whether or not you want it to log assignments and saves.

5. When the shared object is ready to use, the callback is called with one parameter, the shared object. 

6. As a test of persists, the app increases stats.counter by one, every second. In the console you'll see the value of the counter. 

7. If you stop and restart the program, it will resume the count where it left off.

### Options

These are the possible values that configure persists via the third parameter. 

* flPersistsLog -- whether to log changes to properties and saving. default false

* persistsPath -- where to save the JSON files. default persists/sharedObjects/

* maxSecsBetwSaves -- how often to check for changes, default 1

### More complex test apps

1. I wrote a test app, <a href="https://github.com/scripting/persists/blob/master/examples/lotsofobjects.js">lotsofobjects.js</a>, that makes sure each shared object is distinct from the others. This uncovered a flaw that when fixed made the <i>persists</i> code simpler.

2. As part of the XML-RPC-in-JavaScript project, here's an <a href="https://github.com/scripting/xml-rpc/blob/master/examples/mailservice/mailservice.js">email gateway app</a>. It uses persists to keep track of a serial number. 

### Notes

1. I thought about allowing callbacks for saving and restoring, and might yet still do it. It seemed like something to think about after a while, see how much use this gets, and what kinds of apps might be possible.

### Changes

#### 9/14/19 by DW

When we copy from the xxx struct into the sharedObject, we only were copying scalars. Changed it so it copies objects and arrays too.

#### 9/8/19 by DW

Change in the format that shared objects are saved on disk.

There's no reason we can't include metadata, when created, number of saves, when last saved, a version number.

The JSON file will now have several top-level properties.

1. version -- a string, so the format can easily change in the future. 

2. meta -- information about the file

3. data -- the JSONified object.

Here's an <a href="https://gist.github.com/scripting/e22acccb9f5239b1e2bde64e6e25a275">example</a> of a saved object from the lotsofobjects demo.

#### 9/7/19 by DW

New options: flPersistsLog, persistsPath, maxSecsBetwSaves.

Reviewed demo code, simplified, corrected a spelling error.

#### 9/6/19 by DW

Don't need a <i>get</i> handler, removed it. 

Made the console message on setting optional, defaults true.

Added an options param to persists, so we can pass other options in as-needed.

