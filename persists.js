var myProductName = "persists", myVersion = "0.4.4";  

/*  The MIT License (MIT)
	Copyright (c) 2014-2019 Dave Winer
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	*/

module.exports = createSharedObject;

const utils = require ("daveutils");
const fs = require ("fs");

const defaultConfig = {
	flLogToConsole: true
	};

function createSharedObject (nameobject, obj, myConfig, callback) {
	var fname = nameobject + ".json";
	var flchanged = false;
	var theSharedObject = new Object ();
	//set up theSharedObject
		if (obj !== undefined) {
			utils.copyScalars (obj, theSharedObject);
			}
	//set up config
		var config = new Object ();
		utils.copyScalars (defaultConfig, config);
		if (myConfig !== undefined) { 
			utils.copyScalars (myConfig, config);
			}
	function saveIfChanged () {
		if (flchanged) {
			flchanged = false;
			fs.writeFile (fname, utils.jsonStringify (theSharedObject), function (err) {
				if (config.flLogToConsole) {
					console.log ("saved: fname == " + fname);
					}
				});
			}
		}
	function set (obj, name, value) {
		if (config.flLogToConsole) {
			console.log ("name == " + name + ", value == " + value);
			}
		obj [name] = value;
		flchanged = true;
		}
	fs.readFile (fname, function (err, data) {
		if (!err) {
			try {
				var jstruct = JSON.parse (data);
				for (var x in jstruct) {
					theSharedObject [x] = jstruct [x];
					}
				}
			catch (err) {
				console.log (err.message);
				}
			}
		setInterval (saveIfChanged, 1000);
		callback (new Proxy (theSharedObject, {set}));
		});
	}
