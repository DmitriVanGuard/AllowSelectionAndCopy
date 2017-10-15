var ultraMode = {
	toggle: false,
	18: false,
	16: false,
	65: false
};

var defaultEventHandlersContainer = [];

var defaultHandlers = [
	'onselectstart',
	'oncopy',
	'oncontextmenu',
	'onclick',
	'onkeypress',
	'onkeyup',
	'onkeydown',
	'onmousedown',
	'onmousemove',
	'onmouseup'
];

chrome.runtime.sendMessage('wait');
var newStyles = [];
window.addEventListener('load', allowSelect);
function allowSelect() {
	console.log('Loading extension');
	// console.log(document.readyState);
	//Last argument must be style that you want to set. Optional argument (true, false) to create pseudo element ::selection
	setNewStyles('body', 'div', 'a', 'p', 'span', 'user-select: text !important;');
	setNewStyles('p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'cursor: auto; user-select: text !important;');
	setNewStyles('::selection', 'background-color: #338FFF !important; color: #fff !important;');
	setNewStyleTag(newStyles);
	autoAllowSelectAndCopy(defaultEventHandlersContainer, window, document, document.documentElement, document.body);
	extensionReady();
}

function setNewStyles() {
	var lastArgumentIndex = arguments.length - 1,
		cssStyle = '{' + arguments[lastArgumentIndex] + '}',
		tags = [],
		resultCss;
	for (var i = 0; i < lastArgumentIndex; i++) {
		tags.push(arguments[i]);
	}
	tags = tags.join(', ');
	resultCss = tags + cssStyle;
	newStyles.push(resultCss);
}
function setNewStyleTag(stylesArray) {
	var newStyleTag = document.createElement('style');
	newStyleTag.type = 'text/css';
	for (var i = 0; i < stylesArray.length; i++) {
		newStyleTag.appendChild(document.createTextNode(stylesArray[i]));
	}
	document.head.appendChild(newStyleTag);
	appendIFrame('head', newStyleTag);
}

function appendIFrame(target, obj) {
	iframes = window.frames;
	for (var i = 0; i < iframes.length; i++) {
		try {
			iframes[i].document[target].appendChild(obj);
			console.log('Appended Iframe');
		} catch (err) {
			// console.log(err);
		}
	}
}

function ultraKeyPressed(event) {
	if (event.type == 'keydown') {
		if (ultraMode.hasOwnProperty(event.keyCode)) {
			ultraMode[event.keyCode] = true;
		}
	} else if (event.type == 'keyup') {
		if (ultraMode.hasOwnProperty(event.keyCode)) {
			ultraMode[event.keyCode] = false;
		}
	}
}
function ultraCombinationPressed() {
	if (ultraMode[18] && ultraMode[16] && ultraMode[65]) {
		ultraMode.toggle = !ultraMode.toggle;
		console.log('ultra', ultraMode.toggle);
		toggleUltraHandlers('selectstart mousedown contextmenu copy', ultraPropagation, ultraMode.toggle);
	}
}
var ultraModeLogic = function(event) {
	ultraKeyPressed(event);
	ultraCombinationPressed();
};

function extensionReady() {
	chrome.runtime.sendMessage('ready');
}

var ultraPropagation = function(event) {
	if (ultraMode.toggle) {
		event.stopPropagation();
	}
};

// Saving default handlers to backup them if user disable extension in POPUP
function autoAllowSelectAndCopy(obj, ...elems) {
	elems.forEach((elem, index) => {
		if (obj[index]) return;
		var elemContainer = {};
		elemContainer.refElem = elem;
		defaultHandlers.forEach(function(item) {
			elemContainer[item] = elem[item];
			elem[item] = null;
		});
		obj.push(elemContainer);
	});
	console.log(obj);
}

function toggleUltraHandlers(events, callback, activate) {
	events = events.split(' ');
	if (activate) {
		events.forEach(function(item) {
			window.addEventListener(item, callback, true);
		});
		chrome.runtime.sendMessage('ultra');
	} else {
		events.forEach(function(item) {
			window.removeEventListener(item, callback, true);
		});
		chrome.runtime.sendMessage('ready');
	}
}

window.addEventListener('keydown', ultraModeLogic, true);
window.addEventListener('keyup', ultraModeLogic, true);

//Manage extension from a popup settings
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
	if (request.greeting == 'hello') sendResponse({ farewell: 'goodbye' });
});
