module.exports = makePersistentProxy;

const utils = require ("daveutils");
const fs = require ("fs");

function makePersistentProxy (nameobject, obj, callback) {
	var fname = nameobject + ".json";
	var flchanged = false;
	var theTarget;
	
	function saveIfChanged () {
		if (flchanged) {
			flchanged = false;
			fs.writeFile (fname, utils.jsonStringify (theTarget), function (err) {
				});
			}
		}
	function get (target, name) {
		return (target [name]);
		}
	function set (target, name, value) {
		console.log ("name == " + name + ", value == " + value);
		target [name] = value;
		flchanged = true;
		theTarget = target;
		}
	fs.readFile (fname, function (err, data) {
		if (!err) {
			try {
				var jstruct = JSON.parse (data);
				for (var x in jstruct) {
					obj [x] = jstruct [x];
					}
				}
			catch (err) {
				console.log (err.message);
				}
			}
		setInterval (saveIfChanged, 1000);
		callback (new Proxy (obj, {get, set}));
		});
	}
