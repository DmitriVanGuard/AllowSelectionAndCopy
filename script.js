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
const maxLoadingTime = 5000;

chrome.runtime.sendMessage('wait');
let extentionLoadingTimeout = setTimeout(checkExtensionStatus, maxLoadingTime);

window.addEventListener('load', checkExtensionStatus);

function checkExtensionStatus() {
	clearTimeout(extentionLoadingTimeout);
	chrome.storage.sync.get(window.location.host, item => {
		extActive = Object.keys(item).length === 0;
		extActive ? allowSelect() : setExtensionBadgeStatus('off');
	});
}


function allowSelect() {
	console.log('Loading extension');

	if (newStyles.length === 0) {
		setNewStyles('user-select: text !important;', 'body', 'div', 'a', 'p', 'span');
		setNewStyles('cursor: auto; user-select: text !important;', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6');
		setNewStyles('background-color: #338FFF !important; color: #fff !important;', '::selection');
	}

	setNewStyleTag(newStyles);

	window.addEventListener('keydown', ultraModeLogic, true);
	window.addEventListener('keyup', ultraModeLogic, true);

	setExtensionBadgeStatus('ready');
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
	// appendIFrame('head', newStyleTag);
}
function appendIFrame(target, obj) {
	const iframes = window.frames;
	for (let i = 0; i < iframes.length; i++) {
		try {
			iframes[i].document[target].appendChild(obj);
			// console.log('Appended Iframe');
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
		toggleUltraHandlers('selectstart mousedown contextmenu copy keydown', ultraPropagation, ultraMode.toggle);
	}
}
function toggleUltraHandlers(events, callback, activate) {
	events = events.split(' ');
	if (activate) {
		events.forEach(function(item) {
			window.addEventListener(item, callback, true);
		});
		setExtensionBadgeStatus('ultra');
	} else {
		events.forEach(function(item) {
			window.removeEventListener(item, callback, true);
		});
		setExtensionBadgeStatus('ready');
	}
}
const ultraPropagation = function(event) {
	if (ultraMode.toggle) event.stopPropagation();
};

/* *** ULTRA MODE LOGIC END *** */

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

	window.removeEventListener('keyup', ultraModeLogic, true);
	window.removeEventListener('keydown', ultraModeLogic, true);

	setExtensionBadgeStatus('off');
	console.log('Extension disabled');
}

function setExtensionBadgeStatus(status) {
	chrome.runtime.sendMessage(status);
}

//Manage extension from a popup settings
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.hasOwnProperty('extStatus')) {
		request.extStatus ? allowSelect() : disableExtension();
	}
	if (request.hasOwnProperty('extReload')) {
		if (request.extReload) {
			console.log('Reloading...');
			disableExtension();
			checkExtensionStatus();
		}
	}
});

function getExtensionStatus(target, callback) {
	chrome.storage.sync.get(target, items => {
		callback(chrome.runtime.lastError ? null : items);
	});
}
