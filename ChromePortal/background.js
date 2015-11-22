chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('debug.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    }
  });
});
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
}
function usbListener(port)
{
	console.log(port);
	console.assert(port.name == "portal");
	portalPorts[0] = port;
	port.onMessage.addListener(messageListener);
}
chrome.runtime.onConnect.addListener(usbListener);
