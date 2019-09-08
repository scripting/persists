var myProductName = "persists", myVersion = "0.4.10";  

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
	flPersistsLog: false,
	persistsPath: "persists/sharedObjects/",
	maxSecsBetwSaves: 1
	};
const defaultObjectMetadata = { //the metadata stored with each JSONified object
	ctSaves: 0,
	whenLastSave: undefined,
	whenCreated: new Date ()
	};
const currentSavedObjectVersion = 1;

function nowString () {
	return (new Date ().toLocaleString ());
	}
function createSharedObject (nameobject, initialObjectValues, myConfig, callback) {
	var flchanged = false;
	var theSharedObject = new Object (), objMetadata = new Object ();
	var ctSecsSinceLastCheck = 0;
	//set up theSharedObject
		if (initialObjectValues !== undefined) {
			utils.copyScalars (initialObjectValues, theSharedObject);
			}
	//set up objMetadata
		utils.copyScalars (defaultObjectMetadata, objMetadata);
		objMetadata.whenCreated = nowString ();
	//set up config
		var config = new Object ();
		utils.copyScalars (defaultConfig, config);
		if (myConfig !== undefined) { 
			utils.copyScalars (myConfig, config);
			}
		console.log ("persists: config == " + utils.jsonStringify (config));
	var f = config.persistsPath + nameobject + ".json";
	
	function readObject (f, callback) {
		fs.readFile (f, function (err, data) {
			if (!err) {
				try {
					var jstruct = JSON.parse (data);
					switch (jstruct.version) {
						case undefined: //a file from before we had versions -- 9/8/19 by DW
							for (var x in jstruct) {
								theSharedObject [x] = jstruct [x];
								}
							break;
						case 1:
							for (var x in jstruct.data) {
								theSharedObject [x] = jstruct.data [x];
								}
							for (var x in jstruct.metadata) {
								objMetadata [x] = jstruct.metadata [x];
								}
							break;
						}
					}
				catch (err) {
					console.log (err.message);
					}
				}
			callback ();
			});
		}
	function saveObject (f, callback) {
		objMetadata.ctSaves++;
		objMetadata.whenLastSave = nowString ();
		utils.sureFilePath (f, function () {
			var jstruct = {
				version: currentSavedObjectVersion,
				metadata: objMetadata,
				data: theSharedObject
				};
			fs.writeFile (f, utils.jsonStringify (jstruct), function (err) {
				if (config.flPersistsLog) {
					console.log ("saved: f == " + f);
					}
				if (callback !== undefined) {
					callback (err);
					}
				});
			});
		}
	function saveIfChanged () {
		if (++ctSecsSinceLastCheck > config.maxSecsBetwSaves) {
			ctSecsSinceLastCheck = 0;
			if (flchanged) {
				flchanged = false;
				saveObject (f);
				}
			}
		}
	function set (obj, name, value) {
		if (config.flPersistsLog) {
			console.log ("name == " + name + ", value == " + value);
			}
		obj [name] = value;
		flchanged = true;
		}
	readObject (f, function () {
		setInterval (saveIfChanged, 1000);
		callback (new Proxy (theSharedObject, {set}));
		});
	}
