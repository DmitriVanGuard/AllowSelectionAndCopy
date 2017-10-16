let extActive = true;

const ultraMode = {
	toggle: false,
	18: false,
	16: false,
	65: false
};

const defaultEventHandlersContainer = [];

const defaultHandlers = [
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

const newStyles = [];

chrome.runtime.sendMessage('wait');
window.addEventListener('load', allowSelect);

function allowSelect() {
	chrome.storage.sync.get(window.location.host, item => {
		console.log(item);
	});

	console.log('Loading extension');

	if (newStyles.length === 0) {
		setNewStyles('user-select: text !important;', 'body', 'div', 'a', 'p', 'span');
		setNewStyles('cursor: auto; user-select: text !important;', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6');
		setNewStyles('background-color: #338FFF !important; color: #fff !important;', '::selection');
	}

	setNewStyleTag(newStyles);
	extensionReady();
	autoAllowSelectAndCopy(defaultEventHandlersContainer, window, document, document.documentElement, document.body);
}

/* *** APPEND DOM *** */
function setNewStyles(style, ...selectors) {
	const resultCss = `${selectors.join(', ')}{ ${style} }`;
	newStyles.push(resultCss);
}
function setNewStyleTag(stylesArray) {
	const newStyleTag = document.createElement('style');
	newStyleTag.type = 'text/css';
	for (let i = 0; i < stylesArray.length; i++) {
		newStyleTag.appendChild(document.createTextNode(stylesArray[i]));
	}
	newStyleTag.setAttribute('data-asas-style', '');
	document.head.appendChild(newStyleTag);
	appendIFrame('head', newStyleTag);
}
function appendIFrame(target, obj) {
	const iframes = window.frames;
	for (let i = 0; i < iframes.length; i++) {
		try {
			iframes[i].document[target].appendChild(obj);
			console.log('Appended Iframe');
		} catch (err) {
			// console.log(err);
		}
	}
}
/* *** APPEND DOM END *** */

/* *** ULTRA MODE LOGIC *** */
const ultraModeLogic = function(event) {
	ultraKeyPressed(event);
	ultraCombinationPressed();
};
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
const ultraPropagation = function(event) {
	if (ultraMode.toggle) event.stopPropagation();
};

/* *** ULTRA MODE LOGIC END *** */

function extensionReady() {
	chrome.runtime.sendMessage('ready');
}

// Saving default handlers to backup them if user disable extension in POPUP
function autoAllowSelectAndCopy(arr, ...elems) {
	elems.forEach((elem, index) => {
		const elemContainer = {};
		elemContainer.refElem = elem;
		defaultHandlers.forEach(function(item) {
			elemContainer[item] = elem[item];
			elem[item] = null;
		});
		arr.push(elemContainer);
	});
}

function disableExtension() {
	disableSiteHandlers(defaultEventHandlersContainer);

	const styleTag = document.querySelector('[data-asas-style]');
	if (styleTag) styleTag.remove();

	function disableSiteHandlers(arr) {
		arr.forEach(item => {
			for (const prop in item) {
				if (item[prop] === item.refElem) continue;
				item.refElem[prop] = item[prop];
			}
		});
	}

	console.log('Extension disabled');
}

window.addEventListener('keydown', ultraModeLogic, true);
window.addEventListener('keyup', ultraModeLogic, true);

//Manage extension from a popup settings
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
	if (request.hasOwnProperty('extStatus')) {
		request.extStatus ? allowSelect() : disableExtension();
		console.log(request.extStatus);
	}
});

function getExtensionStatus(target, callback) {
	chrome.storage.sync.get(target, items => {
		callback(chrome.runtime.lastError ? null : items);
	});
}

function getCurrentTabUrl(callback) {
	var queryInfo = {
		active: true,
		currentWindow: true
	};

	console.log(chrome);
	chrome.tabs.query(queryInfo, tabs => {
		var tab = tabs[0];
		var url = tab.url;

		console.assert(typeof url == 'string', 'tab.url should be a string');

		callback(url, tab.id);
	});
}
