var imageElement = document.createElement('img');
setTimeout(allowSelect, 2000);

function allowSelect(){
	imageElement.src = "allowSelectionAndCopy.jpg";

	//First argument - tag(element name), second argument - tag attribute, following arguements are code that you want to run
	setElementAttr(imageElement, "onerror",
		"document.ondragstart = document.onselectstart = document.oncontextmenu = null;",
		"document.body.setAttribute('oncopy', '');",
		"document.body.setAttribute('style', 'user-select: text !important');",
		"window.onkeydown = window.onkeyup = window.onkeypress = null;",
		"window.onmousemove = window.onmousedown = window.onmouseup = function(e){window.getSelection().removeAllRanges = function(){};};"
		);
	
	document.body.appendChild(imageElement);
	document.body.removeChild(imageElement);
}

function setElementAttr(element){
	var attribute = {}
	attribute.name = arguments[1];
	attribute.codeToRun = [];
	
	for(var i = 2; i < arguments.length; i++){
		attribute.codeToRun[i-2] = arguments[i];
	}

	attribute.codeToRun = attribute.codeToRun.join('');
	element.setAttribute(attribute.name, attribute.codeToRun);
}