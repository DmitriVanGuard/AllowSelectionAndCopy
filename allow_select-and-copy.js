var ultraModeLogic = function (event){
	ultraKeyPressed(event);
	ultraCombinationPressed();
}; 

autoAllowSelectAndCopy(window, document, document.body);
window.addEventListener('mousedown', function(e){ e.stopPropagation(); }, true);
window.addEventListener('keydown', ultraModeLogic, true);
window.addEventListener('keyup', ultraModeLogic, true);

//Inherited copy unblock logic
var parentModification = function(event){
	var child = event.target || event.srcElement;
	child.onmousedown = child.oncontextmenu = child.ondragstart = child.onclick = child.onselectstart = child.onmousemove = child.oncopy = null;
	while(child.parentNode){ 
		child = child.parentNode; 
		child.onmousedown = child.oncontextmenu = child.ondragstart = child.onclick = child.onselectstart = child.onmousemove = child.oncopy = null;
	}
};
var ultraMode = {
	toggle: false, 
	17: false, 
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
	if(ultraMode[17] && ultraMode[16] && ultraMode[65]){
		if(ultraMode.toggle){
			document.removeEventListener('selectstart', window.parentModification, true);
			ultraMode.toggle = false;
		}
		else{
			document.addEventListener('selectstart', window.parentModification, true);ultraMode.toggle = true;
			
		}
	}
}
function autoAllowSelectAndCopy(){
	for(var i = 0; i < arguments.length; i++){
		var element = arguments[i];
		if(element){
			element.onselectstart = element.oncopy = element.oncontextmenu = element.onclick = element.onkeypress = element.onkeyup = element.onkeydown = element.onmousedown = element.onmousemove = element.onmouseup = null;
		}
	}
}