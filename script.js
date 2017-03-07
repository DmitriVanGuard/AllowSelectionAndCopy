var imageElement = document.createElement('img');
var newStyleTag = document.createElement('style');
setTimeout(allowSelect, 2000);
var ultraMode = {
	toggle: false,
	17: false, // ctrl
	16: false, // shift
	65: false // a
};
// var parentModification = function(event){console.log("childing");var child = event.target || event.srcElement; child.onmousedown = child.oncontextmenu = child.ondragstart = child.onclick = child.onselectstart = child.onmousemove = child.oncopy = null; while(child.parentNode){ child = child.parentNode; child.onmousedown = child.oncontextmenu = child.ondragstart = 	child.onclick = child.onselectstart = child.onmousemove = child.oncopy = null;}};
//Inherited Copy Unblock Logic

function allowSelect(){
	//Last argument must be a style that you want to set!
	setNewStyleTag("body", "div", "li", "p", "h1", "h2", "h3", "h4", "h5", "h6", "user-select: text !important;");

	//First argument - tag(element name), second argument - tag attribute, following arguements are code that you want to run
	setElementJS(imageElement, "onerror",
		"window.onkeydown = window.onkeyup = window.onkeypress = null;",
		"(function(global){var parentModification = function(event){console.log('childing');var child = event.target || event.srcElement; child.onmousedown = child.oncontextmenu = child.ondragstart = child.onclick = child.onselectstart = child.onmousemove = child.oncopy = null; while(child.parentNode){ child = child.parentNode; child.onmousedown = child.oncontextmenu = child.ondragstart = 	child.onclick = child.onselectstart = child.onmousemove = child.oncopy = null;}};global.parentModification = parentModification;})(window);"
	);
	window.addEventListener('mousedown', function(e){ e.stopPropagation(); }, true);

	document.body.appendChild(imageElement);

	var ultraModeLogic = function(event){
		keyPressed();
		combinationPressed();
	};

	window.addEventListener('keydown', ultraModeLogic, true);
	window.addEventListener('keyup', ultraModeLogic, true);
	
	document.head.appendChild(newStyleTag);
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
function keyPressed(){
	if(event.type == 'keydown'){
		if(ultraMode.hasOwnProperty(event.keyCode)){
			ultraMode[event.keyCode] = true;
		}
	}
	else if(event.type == 'keyup'){
		if(ultraMode.hasOwnProperty(event.keyCode)){
			ultraMode[event.keyCode] = false;
		}
	}
}

function combinationPressed(){
	if(ultraMode[17] && ultraMode[16] && ultraMode[65]){
		if(ultraMode.toggle){
			document.removeEventListener('selectstart', window.parentModification, true);
			ultraMode.toggle = false;
		}else{
			document.addEventListener('selectstart', window.parentModification, true);
			ultraMode.toggle = true;
		}
		console.log(window.parentModification);
	}
}