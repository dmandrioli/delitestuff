var http = require("http"), util = require("util"), mu   = require("mu2");

var configurations = null;

http.createServer(function (req, res) {
	if (!configurations) {
		var llStyle = [];
		llStyle.push("position: absolute; width: 100%; height: 100%");
		llStyle.push("position: absolute; width: 100%; height: 50%");
		llStyle.push("position: absolute; width: 50%; height: 100%");
		surround(llStyle, "style");
		var vertStyle = [];
		vertStyle.push("true");
		vertStyle.push("false");
		surround(vertStyle, "vertical");
		var divStyle = [];
		divStyle.push("");
		divStyle.push("width: 30%");
		divStyle.push("width: 100px");
		surround(divStyle, "style");
		var divClass = [];
		divClass.push("");
		divClass.push("fill");
		surround(divClass, "class");

		configurations = combine(llStyle, vertStyle, vertStyle, vertStyle, divStyle, divStyle, divStyle, divClass, divClass);
		console.log(configurations.length + " configurations.");
	}
	var confNumber;
	var sid = req.url.match(/[0-9]+/);
	if (sid) {
		confNumber = sid[0];
	} else {
		confNumber = parseInt(Math.random() * (configurations.length - 1), 10);
	}
	var conf = configurations[confNumber];
	var templateData = {
		sampleid: confNumber,
		llStyle: conf[0],
		vertStyle1: conf[1],
		vertStyle2: conf[2],
		vertStyle3: conf[3],
		divStyle1: conf[4],
		divStyle2: conf[5],
		divStyle3: conf[6],
		divClass1: conf[7],
		divClass2: conf[8]
	};

	var stream = mu.compileAndRender("LinearLayoutTestTemplate.html", templateData);
	util.pump(stream, res);
}).listen(81);

function combine() {
	var r = [], arg = arguments, max = arg.length - 1;
	function helper(arr, i) {
		for (var j = 0, l = arg[i].length; j < l; j++) {
			var a = arr.slice(0); // clone arr
			a.push(arg[i][j]);
			if (i === max) {
				r.push(a);
			} else {
				helper(a, i + 1);
			}
		}
	}
	helper([], 0);
	return r;
}

function surround(arr, str) {
	for (var i = 0; i < arr.length; i++) {
		arr[i] = str + '="' + arr[i] + '"';
	}
}