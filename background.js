chrome.runtime.onMessage.addListener(function(request) {
   // request contains the YOURMESSAGEPAYLOAD sent above as a Javascript object literal
	if(request){
		badgeState("ULTRA", [255, 40, 40, 255]);

	}else{
		badgeState("", [0,0,0,0]);
	}
});

function badgeState(badgeText, badgeColor){
		chrome.browserAction.setBadgeBackgroundColor({color:badgeColor});
		chrome.browserAction.setBadgeText({text:badgeText});
}