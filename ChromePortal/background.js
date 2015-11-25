chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('debug.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    }
  });
});
var videoWindow = "closed";
function launchVideo(video)
{
	if(video == null)
		video = "zSL8NEObp3E";
	if(videoWindow == "closed")
	{
		chrome.app.window.create(
			'video.html', 
			{
				'id':"video",
				'innerBounds': {
					'width': 1280,
					'height': 720
				},
				'frame':'none',
				'state':'fullscreen',

			},
			function (window){
				window.contentWindow.initialVideo = video;
			}

		);
		chrome.app.window.onClosed.addListener(function(thingy){
			videoWindow = "closed";
		});
	}
	else
		portalPorts["video.html"].postMessage({command: "showVideo", data: video});
}

var portalPorts = new Array();
//function changePortalColor(r,g,b){console.log(r,g,b)};
function messageListener(msg)
{
	console.log(msg);
	if(msg.command == "color")
	{
		changePortalColor(msg.data.r, msg.data.g, msg.data.b);
	}
	if(msg.command == "startUSB")
	{
		initializeHid(myDevicePoll);
		setup_usb();
	}
	if(msg.command == "antenna")
	{
		setPortalAntenna(msg.data);
	}
	if(msg.command == "resetPortal")
	{
		resetPortal();
	}
	if(msg.command == "restartPolling")
	{
		myDevicePoll();
	}
	if(msg.command == "startVideo")
	{
		launchVideo();
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
