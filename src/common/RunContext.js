var baseURL = "";

var context = null;
var local_exec = document.URL.indexOf('file:') === 0;
var html_exec = document.URL.indexOf('http:') === 0 || document.URL.indexOf('https:') === 0;

function determineRunContext() {
	if (context) return context;
    context = {local_exec, html_exec};

	if (!html_exec) {
		return context;
	}

	// The following tests for executing from the web server buit into the
	// FlashAir card, which is called 'xcerebellum'.

	console.log("The following deprecation warning may safely be ignored.");

	var req = new XMLHttpRequest();
	req.open('HEAD', document.location, false);
	req.send(null);
	var headers = req.getAllResponseHeaders().toLowerCase();
	context.flashAir = headers.indexOf('xcerebellum') >= 0;

	if (context.flashAir) {
		console.log("Running on FlashAir server");
	}

	return context;

}


export {determineRunContext};