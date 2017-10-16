chrome.runtime.onMessage.addListener(function(request) {
	// request contains the YOURMESSAGEPAYLOAD sent above as a Javascript object literal
	if (request === 'ready') {
		badgeState('COPY', [45, 100, 245, 255]);
	} else if (request === 'wait') {
		badgeState('WAIT', [40, 40, 40, 255]);
	} else if (request === 'off') {
		badgeState('OFF', [40, 40, 40, 255]);
	} else if (request === 'ultra') {
		badgeState('ULTRA', [255, 40, 40, 255]);
	} else {
		badgeState('', [0, 0, 0, 0]);
	}
});

function badgeState(badgeText, badgeColor) {
	chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor });
	chrome.browserAction.setBadgeText({ text: badgeText });
}
