var imageElement = document.createElement('img');
var newStyleTag = document.createElement('style');
setTimeout(allowSelect, 2000);

function allowSelect(){
	//Last argument must be a style that you want to set!
	setNewStyleTag("body", "div", "li", "p", "h1", "h2", "h3", "h4", "h5", "h6", "user-select: text !important;");

	//First argument - tag(element name), second argument - tag attribute, following arguements are code that you want to run
	setElementJS(imageElement, "onerror",
		"window.onkeydown = window.onkeyup = window.onkeypress = null;",
		"(function(){var parentModification = function(event){var child = event.target || event.srcElement; child.onmousedown = child.oncontextmenu = child.ondragstart = child.onclick = child.onselectstart = child.onmousemove = child.oncopy = null; while(child.parentNode){ child = child.parentNode; child.onmousedown = child.oncontextmenu = child.ondragstart = 	child.onclick = child.onselectstart = child.onmousemove = child.oncopy = null;}};document.addEventListener('selectstart', parentModification, true);})();"
	);
	window.addEventListener('mousedown', function(e){ e.stopPropagation(); }, true);
	document.head.appendChild(newStyleTag);
	document.body.appendChild(imageElement);
	document.body.removeChild(imageElement);
}
function setElementJS(element){
	var attribute = {};
	attribute.name = arguments[1];
	attribute.codeToRun = [];
	element.src = "allow_Selection-And-Copy.jpg";
	for(var i = 2; i < arguments.length; i++){
		attribute.codeToRun.push(arguments[i]);
	}
	attribute.codeToRun = attribute.codeToRun.join('');
	element.setAttribute(attribute.name, attribute.codeToRun);
}
function setNewStyleTag(){
	newStyleTag.type = "text/css";
	var lastArgumentIndex = arguments.length - 1;
	var cssStyle = "{" + arguments[lastArgumentIndex] + "}";
	var tags = [];
	var resultCss;
	for(var i = 0; i < lastArgumentIndex; i++){
		tags.push(arguments[i]);
	}
	tags = tags.join(", ");
	resultCss = tags + cssStyle;
	newStyleTag.appendChild(document.createTextNode(resultCss));
}