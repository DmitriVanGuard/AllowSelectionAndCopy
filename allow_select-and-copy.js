// var ultraMode = {
// 	toggle: false,
// 	18: false,
// 	16: false,
// 	65: false
// };
// var ultraModeLogic = function(event) {
// 	ultraKeyPressed(event);
// 	ultraCombinationPressed();
// };
// autoAllowSelectAndCopy(window, document, document.body);
// window.addEventListener('keydown', ultraModeLogic, true);
// window.addEventListener('keyup', ultraModeLogic, true);
// window.addEventListener(
// 	'copy',
// 	function(e) {
// 		e.stopPropagation();
// 	},
// 	true
// );

// var ultraPropagation = function(event) {
// 	if (ultraMode.toggle) {
// 		event.stopPropagation();
// 	}
// };
// function ultraKeyPressed(event) {
// 	if (event.type == 'keydown') {
// 		if (ultraMode.hasOwnProperty(event.keyCode)) {
// 			ultraMode[event.keyCode] = true;
// 		}
// 	} else if (event.type == 'keyup') {
// 		if (ultraMode.hasOwnProperty(event.keyCode)) {
// 			ultraMode[event.keyCode] = false;
// 		}
// 	}
// }
// function ultraCombinationPressed() {
// 	if (ultraMode[18] && ultraMode[16] && ultraMode[65]) {
// 		if (ultraMode.toggle) {
// 			removeHandlers('selectstart mousedown contextmenu copy', ultraPropagation);
// 			ultraMode.toggle = false;
// 		} else {
// 			ultraMode.toggle = true;
// 			addHandlers('selectstart mousedown contextmenu copy', ultraPropagation);
// 		}
// 	}
// }
// function autoAllowSelectAndCopy() {
// 	for (var i = 0; i < arguments.length; i++) {
// 		var element = arguments[i];
// 		if (element) {
// 			element.onselectstart = element.oncopy = element.oncontextmenu = element.onclick = element.onkeypress = element.onkeyup = element.onkeydown = element.onmousedown = element.onmousemove = element.onmouseup = null;
// 		}
// 	}
// }
// function addHandlers(events, callback) {
// 	events = events.split(' ');
// 	events.forEach(function(item) {
// 		window.addEventListener(item, callback, true);
// 	});
// }
// function removeHandlers(events, callback) {
// 	events = events.split(' ');
// 	events.forEach(function(item) {
// 		window.removeEventListener(item, callback, true);
// 	});
// }
