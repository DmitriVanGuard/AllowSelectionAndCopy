setTimeout(allowSelect, 2000);
function allowSelect(){
	//Last argument must be style that you want to set
	setNewStyleTag("body", "div", "a", "user-select: text !important;");
	setNewStyleTag("p", "h1", "h2", "h3", "h4", "h5", "h6", "cursor: auto; user-select: text !important;");
	//Pass name of the script to load
	setNewScriptTag("allow_select-and-copy.js");
}
function setNewStyleTag(){
	var newStyleTag = document.createElement('style');
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
	document.head.appendChild(newStyleTag);
}
function setNewScriptTag(scriptName){
	var newScriptTag = document.createElement('script');
	newScriptTag.type = 'text/javascript';
	newScriptTag.src = chrome.extension.getURL(scriptName);
	document.body.appendChild(newScriptTag);
}

var ultraMode = {
	toggle: false, 
	18: false, 
	16: false, 
	65: false
};
function ultraKeyPressed(event){
	if(event.type == 'keydown'){
		if(ultraMode.hasOwnProperty(event.keyCode)){
			ultraMode[event.keyCode] = true;
		}
	}else if(event.type == 'keyup'){
		if(ultraMode.hasOwnProperty(event.keyCode)){
			ultraMode[event.keyCode] = false;
		}
	}
}
function ultraCombinationPressed(){
	if(ultraMode[18] && ultraMode[16] && ultraMode[65]){
		if(ultraMode.toggle){
			document.removeEventListener('selectstart', window.parentModification, true);
			ultraMode.toggle = false;
			chrome.runtime.sendMessage(ultraMode.toggle);
		}
		else{
			document.addEventListener('selectstart', window.parentModification, true);ultraMode.toggle = true;
			chrome.runtime.sendMessage(ultraMode.toggle);
		}
	}
}
var ultraModeLogic = function (event){
	ultraKeyPressed(event);
	ultraCombinationPressed();
}; 

window.addEventListener('keydown', ultraModeLogic, true);
window.addEventListener('keyup', ultraModeLogic, true);