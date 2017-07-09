// setTimeout(allowSelect, 3000);
var newStyles = [];
/*document.onreadystatechange = function(){
	if(document.readyState === 'complete'){
		console.log(document.readyState);
		console.log("Loading extension");
		allowSelect();
	}
};*/
window.onload = function(){
	console.log(document.readyState);
	allowSelect();
};
function allowSelect(){
	console.log("Loading extension");
	// console.log(document.readyState);
	//Last argument must be style that you want to set. Optional argument (true, false) to create pseudo element ::selection
	setNewStyles("body", "div", "a", "p", "span", "user-select: text !important;");
	setNewStyles("p", "h1", "h2", "h3", "h4", "h5", "h6", "cursor: auto; user-select: text !important;");
	setNewStyles("::selection", "background-color: #338FFF !important; color: #fff !important;");
	setNewStyleTag(newStyles);
	//Pass name of the script to load
	setNewScriptTag("allow_select-and-copy.js");
	extensionReady();
}

function setNewStyles(){
	var lastArgumentIndex = arguments.length - 1,
		cssStyle = "{" + arguments[lastArgumentIndex] + "}",
		tags = [],
		resultCss;
	for(var i = 0; i < lastArgumentIndex; i++){
		tags.push(arguments[i]);
	}
	tags = tags.join(", ");
	resultCss = tags + cssStyle;
	newStyles.push(resultCss);
}
function setNewStyleTag(stylesArray){
	var newStyleTag = document.createElement('style');
	newStyleTag.type = "text/css";
	for(var i = 0; i < stylesArray.length ; i++){
		newStyleTag.appendChild(document.createTextNode(stylesArray[i]));
	}
	document.head.appendChild(newStyleTag);
	appendIFrame('head', newStyleTag);
}
function setNewScriptTag(scriptName){
	var newScriptTag = document.createElement('script');
	newScriptTag.type = 'text/javascript';
	newScriptTag.src = chrome.extension.getURL(scriptName);
	document.body.appendChild(newScriptTag); // Load script to page to see full potential
	appendIFrame('body', newScriptTag);
}

function appendIFrame(target, obj){
	iframes = window.frames;
	for(var i = 0; i < iframes.length; i++){
		try{
			iframes[i].document[target].appendChild(obj);
		}
		catch(err){
			console.log(err)
		}
	}
	console.log("Appended Iframe");
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
			extensionReady();
			console.log('ultra', false);
		}
		else{
			ultraModeToggleChange(true);
			console.log('ultra', true);
		}
	}
}
var ultraModeLogic = function (event){
	ultraKeyPressed(event);
	ultraCombinationPressed();
}; 

window.addEventListener('keydown', ultraModeLogic, true);
window.addEventListener('keyup', ultraModeLogic, true);

function ultraModeToggleChange(value){
	ultraMode.toggle = value;
	chrome.runtime.sendMessage(ultraMode.toggle);
}
function extensionReady(){
	chrome.runtime.sendMessage('ready');
}