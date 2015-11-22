
document.addEventListener('DOMContentLoaded', function(){
	document.getElementById("resetPortal").addEventListener("click", resetPortal);
	document.getElementById("activatePortalAntenna").addEventListener('click',  activatePortalAntenna);
	//document.getElementById("restartPolling").addEventListener('click',  myDevicePoll);
	document.getElementById("color").addEventListener("change", changeColor);
	myText = document.getElementById("mytext");
});

/*set the color via the color.js widget*/
function changeColor()
{
	var color = document.getElementById("color").value;
	var r = parseInt("0x" + color.substr(0,2)); //R
	var g = parseInt("0x" + color.substr(2,2)); //G
	var b = parseInt("0x" + color.substr(4,2)); //B
	//changePortalColor(r, g, b);
	portalPort.postMessage({command: "color", data: {r:r, g:g, b:b}});
}
function activatePortalAntenna()
{
	portalPort.postMessage({command: "antenna", data: 1});
}
function resetPortal()
{
	portalPort.postMessage({command:"resetPortal"});
}
function restartPolling()
{
	portalPort.postMessage({command:"restartPolling"});	
}

function readPortalMessage(msg)
{
	//console.log(msg);
	if(msg.command == "placed_characters_string")
	{
		document.getElementById("textbox").innerText = msg.data;
	}
	if(msg.command == "hid_data")
	{
		myText.value = msg.data;
	}
	if(msg.command == "status_change")
	{
		document.getElementById("statusChange").innerHTML =
			document.getElementById("statusChange").innerHTML +
 			"<br />" +
 			msg.data;
 	}
}
var portalPort = chrome.runtime.connect({name: "portal"});
portalPort.onMessage.addListener(readPortalMessage);
portalPort.postMessage({command:"startUSB"});
portalPort.postMessage({command:"color",data:{r:3,g:42,b:43}});
