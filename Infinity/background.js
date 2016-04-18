chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('debug.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    }
  });
});

var tags;
chrome.storage.local.get("tags", function(items){
	chrome.storage.local.get(items.Tags, function(items2){
		//foreach(var key in items2.Tags)
		delete items2.Tags;// for some reason this gets returned too.
		tags = items2;
	});
});
var tagsNotStored=false;
var tagsKeysNotStored = false;
var placedCharacterCallback = function(c, d, n)
{
	//console.log(c, d, n);
	if(tags == undefined)
		tags = {};
	var tag = tags[d];
	if(!tag)
		tags[d] = tag = {"Tag":d,"Name":"?","ScanCount":1};
	else
		tag.ScanCount++;
	delete tags.Tags;
	tagsNotStored = true;
	tagsKeysNotStored = true;

	//tag.ModelNumber = "INF-4000066"; tag.Name = "Nemo's Seascape (Finding Nemo Skydome)";
	//tag.ModelNumber = "INF-1000001"; tag.Name = "Mr. Incredible";
	chrome.storage.local.set({"Tags": Object.keys(tags)}, function(){
		if(chrome.runtime.lastError != null)
		{
			debugMessageCallback("status_change",chrome.runtime.lastError.message);
		}
		tagsKeysNotStored = false
	});
	chrome.storage.local.set(tags, function(){
		if(chrome.runtime.lastError != null)
		{
			debugMessageCallback("status_change",chrome.runtime.lastError.message);
		}
		tagsNotStored = false
	});
	portalPorts["debug.html"].postMessage(
		{command: "placed_tag", data:tag,
			padNumber:n}
	);
}
var debugMessageCallback = function(c, d)
{
	portalPorts["debug.html"].postMessage(
		{command: c, data: d}
	);
}

var portalPorts = new Array();
//function changePortalColor(r,g,b){console.log(r,g,b)};
function messageListener(msg)
{
	console.log(msg);
	if(msg.command == "color")
	{
		changePortalColor(msg.data.r, msg.data.g, msg.data.b, msg.data.pad);
	}
	if(msg.command == "startUSB")
	{
		initializeHid(myDevicePoll);
		//setup_usb();
	}
	if(msg.command == "antenna")
	{
		activatePortal();
	}
	if(msg.command == "readData")
	{
		getTagId();
	}
	if(msg.command == "restartPolling")
	{
		myDevicePoll();
	}
	if(msg.command == "updateTagName")
	{

	}
}
function usbListener(port)
{
	console.log(port);
	console.assert(port.name == "portal");
	if(port.sender.url.replace("chrome-extension://"+chrome.runtime.id+"/") == "video.html")
	{
		port.onDisconnect.addListener(function(thingy){
			videoWindow = "closed";
		});
		videoWindow = "opened";
	}
	portalPorts[port.sender.url.replace("chrome-extension://"+chrome.runtime.id+"/", "")] = port;
	port.onMessage.addListener(messageListener);
}
chrome.runtime.onConnect.addListener(usbListener);
