
document.addEventListener('DOMContentLoaded', function(){
	document.getElementById("readData").addEventListener("click", readData);
	document.getElementById("activatePortalAntenna").addEventListener('click',  activatePortalAntenna);
	document.getElementById("restartPolling").addEventListener('click',  restartPolling);
	document.getElementById("color1").addEventListener("change", changeColor1);
	document.getElementById("color2").addEventListener("change", changeColor2);
	document.getElementById("color3").addEventListener("change", changeColor3);

});
var tags = {};
function startVideo()
{
	//portalPort.postMessage({command: "startVideo"});
}
/*set the color via the color.js widget*/
function changeColor1() {changeColor(1);}
function changeColor2() {changeColor(2);}
function changeColor3() {changeColor(3);}

function changeColor(num)
{
	var color = document.getElementById("color"+num).value;
	var r = parseInt("0x" + color.substr(0,2)); //R
	var g = parseInt("0x" + color.substr(2,2)); //G
	var b = parseInt("0x" + color.substr(4,2)); //B
	//changePortalColor(r, g, b);
	portalPort.postMessage({command: "color", data: {r:r, g:g, b:b, pad:num}});
}
function activatePortalAntenna()
{
	portalPort.postMessage({command: "antenna"});
}
function readData()
{
	portalPort.postMessage({command:"readData"});
}
function restartPolling()
{
	portalPort.postMessage({command:"restartPolling"});	
}

function readPortalMessage(msg)
{
	//console.log(msg);
	if(msg.command == "placed_tag")
	{
		document.getElementById("textbox").innerText = JSON.stringify(msg);
	}
	if(msg.command == "hid_data")
	{
		document.getElementById("mytext").value = msg.data;
	}
	if(msg.command == "status_change" || msg.command == "status_error")
	{
		var p = document.createElement("p");
		p.innerText = msg.data;
		p.title = Date();
		if(msg.command == "status_error")
			p.className = "error";
		var parent = document.getElementById("statusChange");
		if(parent.children.length > 0)
			parent.insertBefore(p, parent.firstChild);
		else
			parent.appendChild(p);
	}
}
var portalPort = chrome.runtime.connect({name: "portal"});
portalPort.onMessage.addListener(readPortalMessage);
portalPort.postMessage({command:"startUSB"});
setTimeout(portalPort.postMessage({command:"color",data:{r:3,g:42,b:43,pad:1}}),500);
