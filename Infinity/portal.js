/*GLOBAL CONSTANTS*/
// { "vendorId": 3695, "productId":297}
var VENDOR_ID  = 0x0E6F; // 3695 in decimal 
var WII_PRODUCT_ID = 0x0129; // 297 in decimal 
//var XBOX_PRODUCT_ID = 0x1f17;

var DEVICE_INFO = 
	{"vendorId": VENDOR_ID, "productId": WII_PRODUCT_ID };
//var DEVICE_INFO2 = 
//	{"vendorId": VENDOR_ID, "productId": XBOX_PRODUCT_ID };


// portal state stuff.
//var placed_characters = new Array();
//placed_characters[0] = {"portal_spot": 1, "Character": new SkylanderCharacter()};
//var portal_spots = new Array();  
//portal_spots[5] = {"placed_character": 0, "Active": true, "Stability": 0...50?};
//var pending_read = new Array();//? or just use SkylanderCharacter.blocks
// {"placed_character": 2, "BlockNumbers": [2,3,4]}
//var currently_reading;
//{"placed_character": 2, "BlockNumber": 1, "Age": 4, "Retries": 4}

var connectionId = null;
var usbhandle;
var rw_buf_size = 32;
var myText;
var claimed=false;
var releaseInterfaceTimeoutHandle;

// these should be overridden in background.js
var placedCharacterCallback = function(c, d, n)
{
	console.log(c, d, n);
}
var debugMessageCallback = function(c, d)
{
	console.log(c, d);
}



function arrayBufferToString(array) {
	return String.fromCharCode.apply(null, new Uint8Array(array));
}



/***************************************/
/************ USB hid setup ************/
/***************************************/
var messageCount;
var myDevicePoll = function() {
	if(connectionId != null)
	{
		chrome.hid.receive(connectionId, function(reportID, data) {
			if(chrome.runtime.lastError != null && myText != null)
			{
				debugMessageCallback("status_change",chrome.runtime.lastError.message);
			}
			else
			{
				if (data != null)
				{
					// Convert Byte into Ascii to follow the format of our device
					array = new Uint8Array(data);
					var raw_string = reportID + "-" + array.length + ":";
					for(var i = 0 ; i < array.length; i++ )
					{
						raw_string = raw_string + ":" + array[i].toString(16);
					}
					debugMessageCallback("hid_data", raw_string);
					var message_type = array[0];
					switch(message_type)
					{
						case 0xab:
						//ab:4:1:1:0:1:b2:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0
							var platformSetting = array[2];
							var placedRemoved = array[5];

							if(placedRemoved == 0x00)
							{
								debugMessageCallback("status_change", "Tag placed on platform: " + platformSetting);
								
								getTagId();
							}
							else
							{
								debugMessageCallback("status_change", "Tag removed from platform: " + platformSetting);
							}
							break;
						case 0xaa:
							switch(array[1])
							{
								case 0x1: // aa:01:41:ec
									debugMessageCallback("status_change", "color change response");
									break;
								case 0x9: // aa:0x09: 
									//debugMessageCallback("status_change", "Got tag info");
									// make print tag info!!!
									var raw_tag = "Tag:";
									// mr.Incredible
									// aa:09:26:00:04:ba:09:1a:25:2b:90:9a:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0
									// tree rex
									// aa:09:26:00:04:a9:c4:b0:00:00:00:fa:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0:0
									// first ?four? bytes of the first block were returned
									// ?padded with leading 0 and trailing 3 zeros in the case of skylander
									// 04:A9:C4:B0:D9:81:0F:C4:33:00:00:00:00:00:12 ... dumped from skylander portal
									for(var i = 10 ; i > 2 ; i--) {
										raw_tag = raw_tag + ":" + array[i].toString(16);
									}
									debugMessageCallback("status_change", raw_tag);
									placedCharacterCallback("placed_tag",/* array.slice(2,10)*/raw_tag ,"?")
									break;
								default:
									debugMessageCallback("status_error", "Unknown packet");
									break;
							}
							break;
						default:
							break;

					}// end read message
					debugMessageCallback("status_change", raw_string);
				}
			}
			setTimeout(myDevicePoll, 1);
		});
	}
}

function initializeHid(pollHid) {
	// Try to open the USB HID device
	chrome.hid.getDevices(DEVICE_INFO, function(devices) {
		if (!devices || !devices.length) {
			debugMessageCallback("status_change", "HID Device not found.");
			return;
		}
		debugMessageCallback("status_change", 'Found device: ' + devices[0].deviceId);
		myHidDevice = devices[0].deviceId;
		
		console.log(devices);
		// Connect to the HID device
		chrome.hid.connect(myHidDevice, function(connection) {
			debugMessageCallback("status_change", "HID Device Connected: " + connection.connectionId);
			connectionId = connection.connectionId;
			setup_usb();
			// Poll the USB HID Interrupt pipe
			pollHid();
		});
	});
}
chrome.hid.onDeviceAdded.addListener( function (device)
{
	if (!device) {
		debugMessageCallback("status_change", "HID Device not found.");
		return;
	}
	debugMessageCallback("status_change", "HID Found device: " + device.deviceId);
	myHidDevice = device.deviceId;
	
	/*document.getElementById("textbox").innerText = devices;*/
	//device_ = device;
	console.log(device);
	// Connect to the HID device
	chrome.hid.connect(myHidDevice, function(connection) {
		debugMessageCallback("status_change", "HID Device connected: " + connection.connectionId);
		connectionId = connection.connectionId;
		setup_usb();
		// Poll the USB HID Interrupt pipe
		myDevicePoll();
	});
});


chrome.hid.onDeviceRemoved.addListener(function (device){connectionId = null;});


/***************************************/
/********** USB control setup **********/
/***************************************/
function setup_usb()
{
	chrome.usb.getDevices(DEVICE_INFO, function(devices){
		console.log(devices);
		debugMessageCallback("status_change", "setup_usb: " + devices.length + " matching devices");
		if(devices != null && devices.length > 0)
			chrome.usb.openDevice(devices[0], onOpenDevice);
	});
}
//doesn't get fired until we run openDevice?'
// hid.ondeviceadded fires on plug.
/*chrome.usb.onDeviceAdded.addListener(function(device){
	if(device != null)
		chrome.usb.openDevice(devices, onOpenDevice);
});*/
chrome.usb.onDeviceRemoved.addListener(function(device){usbhandle = null});
function onOpenDevice(connectionHandle)
{
	debugMessageCallback("status_change", "connectionHandle: " 	+
		connectionHandle.handle + " : " + 
		connectionHandle.vendorId + " : " + 
		connectionHandle.productId);
	usbhandle = connectionHandle;
	if(usbhandle)
	{
		if(false && !claimed)
		{
			chrome.usb.claimInterface(usbhandle,0,function(){
				if (chrome.runtime.lastError)
				{
					console.error(chrome.runtime.lastError);
					return;
				}
				claimed=true;
				if (releaseInterfaceTimeoutHandle != undefined)
				{
					clearTimeout(releaseInterfaceTimeoutHandle);
					releaseInterfaceTimeoutHandle = undefined;
				}
				activatePortal();
			});
		}
		else
		{
			activatePortal();
		}
		//sendRequest();
		//activatePortal();
		//changePortalColor(255,255,255,1);
	}
}

/***************************************/
/***** Portal Specific Usb Command *****/
/***************************************/
/*
chrome.usb.listInterfaces(usbhandle, function(list){debugMessageCallback("status_error", list)})
"[{"alternateSetting":0,
"endpoints":
	[
	{"address":129,"direction":"in","extra_data":{},"maximumPacketSize":32,"pollingInterval":1,"type":"interrupt","usage":"data"},
	{"address":1,"direction":"out","extra_data":{},"maximumPacketSize":32,"pollingInterval":1,"type":"interrupt","usage":"data"}
	],
	"extra_data":{},"interfaceClass":3,"interfaceNumber":0,"interfaceProtocol":0,"interfaceSubclass":0}]"
*/
/*class3 = hid device*/
/*try switching back to interrupt transfers...*/
// put these in var portal = function(){ this.sendRequest = function()}?
// needs on usb device added/removed
function sendRequest() {
	var ti = {
		"direction": "in",
		"length": rw_buf_size,
		"endpoint": 0x81,//129
		"timeout": 1000
	};
	if(usbhandle)
	{
		if(!claimed)
		{
			chrome.usb.claimInterface(usbhandle,0,function(){
				if (chrome.runtime.lastError)
				{
					console.error(chrome.runtime.lastError);
					return;
				}
				claimed=true;
				if (releaseInterfaceTimeoutHandle != undefined)
				{
					clearTimeout(releaseInterfaceTimeoutHandle);
					releaseInterfaceTimeoutHandle = undefined;
				}
				chrome.usb.bulkTransfer(usbhandle, ti, sendCompleted);
			});
		}
		else
		{
			chrome.usb.bulkTransfer(usbhandle, ti, sendCompleted);
		}
	}
}
/*same but interrupt*/
function sendInterruptRequest() {
var ti = {
		"direction": "in",
		"length": rw_buf_size,
		"endpoint": 0x81,//129
		"timeout": 1000
	};
	if(usbhandle)
	{
		if(!claimed)
		{
			chrome.usb.claimInterface(usbhandle,0,function(){
				if (chrome.runtime.lastError)
				{
					console.error(chrome.runtime.lastError);
					return;
				}
				claimed=true;
				if (releaseInterfaceTimeoutHandle != undefined)
				{
					clearTimeout(releaseInterfaceTimeoutHandle);
					releaseInterfaceTimeoutHandle = undefined;
				}
				chrome.usb.interruptTransfer(usbhandle, ti, sendCompleted);
			});
		}
		else
		{
			chrome.usb.interruptTransfer(usbhandle, ti, sendCompleted);
		}
	}
}
/*
function sendBulkCommand(data)
{
	var ti = {
		"direction": "out",
		"length": rw_buf_size,
		"endpoint": 1,
		"data": data.buffer,
		"timeout": 10000
	};
	if(usbhandle)
	{
		if(!claimed)
		{
			chrome.usb.claimInterface(usbhandle,0,function(){
				if (chrome.runtime.lastError)
				{
					console.error(chrome.runtime.lastError);
					return;
					}
				claimed=true;
				if (releaseInterfaceTimeoutHandle != undefined)
				{
					clearTimeout(releaseInterfaceTimeoutHandle);
					releaseInterfaceTimeoutHandle = undefined;
				}
				chrome.usb.bulkTransfer(usbhandle, ti, sendCompleted);
			});
		}
		else
		{
			chrome.usb.bulkTransfer(usbhandle, ti, sendCompleted);
		}
	}
}*/
function sendCommand(data)
{
	var ti = {
		"direction": "out",
		"length": rw_buf_size,
		"endpoint": 1,
		"data": data.buffer,
		"timeout": 10000
	};
	if(usbhandle)
	{
		if(!claimed)
		{
			chrome.usb.claimInterface(usbhandle,0,function(){
				if (chrome.runtime.lastError)
				{
					console.error(chrome.runtime.lastError);
					return;
				}
				claimed=true;
				console.log("clearing: ", releaseInterfaceTimeoutHandle)
				if (releaseInterfaceTimeoutHandle!= undefined)
				{
					clearTimeout(releaseInterfaceTimeoutHandle);
					releaseInterfaceTimeoutHandle = undefined;
				}
				chrome.usb.interruptTransfer(usbhandle, ti, sendCompleted);
			});
		}
		else
		{
			chrome.usb.interruptTransfer(usbhandle, ti, sendCompleted);
		}
	}
}

function sendCompleted( /*TransferResultInfo*/ info)
{
	if (chrome.runtime.lastError)
	{
		debugMessageCallback("status_error", "sendCompleted Error: " + chrome.runtime.lastError.message);
	}

	if (info)
	{
		if(info.resultCode==undefined)
		{console.log("no resultCode, bulkTransfer out?");}
		else if(info.resultCode==0)
		{console.log("bulkTransfer success");}
		else{console.log("bulkTransfer error");}
		if (info.data)
		{
			// this just returns what we sent...
			// use HID Recieve to get tag data?
			var buf = new Uint8Array(info.data);
			debugMessageCallback("hid_data", buf.toString(16));
			console.log("sendCompleted Buffer:", info.data.byteLength, buf);
			if(buf[0] = 0x51/*'Q'*/)
			{
				//add to pendingblockread list so we can retry if we miss it in polling
			}
		}
		if (info.resultCode != 0) {
			debugMessageCallback("status_error", "Error writing to device: " + info.resultCode);
		}
		// chrome won't let us re-claim the interface in a new
		//instance of the "app" unless released before closing this one
		if(releaseInterfaceTimeoutHandle == undefined)
		{
			releaseInterfaceTimeoutHandle = setTimeout(releaseInterface, 1000);
			console.log("setting timeout", releaseInterfaceTimeoutHandle);
		}
	}
}
function releaseInterface()
{
	chrome.usb.releaseInterface(usbhandle, 0, function() {
		claimed=false;
		debugMessageCallback("status_error", "Interface Released.");
		if (chrome.runtime.lastError)
			console.error(chrome.runtime.lastError);
	});
}

/***************************************/
/********** All the API stuffs**********/
/***************************************/

function activatePortal()
{
	var data = new Uint8Array(rw_buf_size)
		data[0] = 0xff;
		data[1] = 0x11;
		data[2] = 0x80;
		data[3] = 0x00;
		data[4] = 0x28;
		data[5] = 0x63;
		data[6] = 0x29;
		data[7] = 0x20;
		data[8] = 0x44;
		data[9] = 0x69;
		data[10] = 0x73;
		data[11] = 0x6e;
		data[12] = 0x65;
		data[13] = 0x79;
		data[14] = 0x20;
		data[15] = 0x32;
		data[16] = 0x30;
		data[17] = 0x31;
		data[18] = 0x33;
		data[19] = 0xb6;
		data[20] = 0x30;
		data[21] = 0x6f;
		data[22] = 0xcb;
		data[23] = 0x40;
		data[24] = 0x30;
		data[25] = 0x6a;
		data[26] = 0x44;
		data[27] = 0x20;
		data[28] = 0x30;
		data[29] = 0x5c;
		data[30] = 0x6f;
		data[31] = 0x00;
	sendCommand(data);
}

function changePortalColor(r, g, b, platform)
{
	var data = new Uint8Array(rw_buf_size);
		data[0] = 0xff;
		data[1] = 0x06; // data length
		data[2] = 0x90; // weird data length
		data[3] = 0x41;
		data[4] = platform; // platform
		data[5] = r; // r
		data[6] = g; // g
		data[7] = b; // b
		// data[8] = 0xd8;

	var checksum = 0;
	for(var l = 0 ; l < 8 ; l++) {
		checksum += data[l];
	}
		checksum = checksum & 0xFF;

		data[8] = checksum;
		data[9] = 0x00;
		data[10] = 0x00;
		data[11] = 0x00;
		data[12] = 0x36;
		data[13] = 0xf1;
		data[14] = 0x2c;
		data[15] = 0x70;
		data[16] = 0x00;
		data[17] = 0x00;
		data[18] = 0x00;
		data[19] = 0x00;
		data[20] = 0x36;
		data[21] = 0xe7;
		data[22] = 0x3c;
		data[23] = 0x90;
		data[24] = 0x00;
		data[25] = 0x00;
		data[26] = 0x00;
		data[27] = 0x00;
		data[28] = 0x00;
		data[29] = 0x00;
		data[30] = 0x00;
		data[31] = 0x00;
	sendCommand(data);
}
function getTagId()
{
	// ff 03 b4 26 00 dc 02 06 ff 00 00 ca 36 f1 2c 70 00 00 00 00 36 e7 3c 90 00 00 00 00 00 00 00 00
	var packet = new Uint8Array(rw_buf_size);
		packet[0] = 0xff;
		packet[1] = 0x03;
		packet[2] = 0xb4;
		packet[3] = 0x26;
		packet[4] = 0x00;
		packet[5] = 0xdc;
		packet[6] = 0x02;
		packet[7] = 0x06;
		packet[8] = 0xff;
		packet[9] = 0x00;
		packet[10] = 0x00;
		packet[11] = 0xca;
		packet[12] = 0x36;
		packet[13] = 0xf1;
		packet[14] = 0x2c;
		packet[15] = 0x70;
		packet[16] = 0x00;
		packet[17] = 0x00;
		packet[18] = 0x00;
		packet[19] = 0x00;
		packet[20] = 0x36;
		packet[21] = 0xe7;
		packet[22] = 0x3c;
		packet[23] = 0x90;
		packet[25] = 0x00;
		packet[26] = 0x00;
		packet[27] = 0x00;
		packet[28] = 0x00;
		packet[29] = 0x00;
		packet[30] = 0x00;
		packet[31] = 0x00;
	sendCommand(packet);
}



/* start it all.*/
// done in background.js
