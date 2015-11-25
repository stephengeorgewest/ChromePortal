function readPortalMessage(msg)
{
	if(msg.command == "showVideo")
	{
		showVideo(msg.data);
	}
}
function showVideo(video)
{
	var wv = document.getElementById("wv");
		if(wv == null)
		{
			wv = document.createElement("webview");
			wv.setAttribute("id", "wv");
			wv.setAttribute("sandbox", "allow-same-origin allow-scripts");
			wv.setAttribute("frameborder","0");
			wv.setAttribute("allowfullscreen", "allowfullscreen");
			document.body.appendChild(wv);
		}
		wv.setAttribute("src", "https://www.youtube.com/embed/"+video+"?rel=0&autoplay=1&vq=hd720");
}
//chrome.app.window.current().fullscreen();
var portalPort = chrome.runtime.connect({name: "portal"});
portalPort.onMessage.addListener(readPortalMessage);
document.addEventListener('DOMContentLoaded', function(){showVideo(initialVideo);});