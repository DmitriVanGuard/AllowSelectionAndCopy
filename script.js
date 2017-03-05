
	setTimeout(allowSelect, 2000);

	function allowSelect(){
		var scr = document.createElement('img');
		scr.src = "allowSelectionAndCopy.jpg";
		scr.setAttribute("onerror", "document.ondragstart=null; document.onselectstart=null; document.oncontextmenu=null; document.body.setAttribute('oncopy', '');");
		document.body.setAttribute('style', 'user-select: text !important');
		document.body.appendChild(scr);
		document.body.removeChild(scr);
	}
