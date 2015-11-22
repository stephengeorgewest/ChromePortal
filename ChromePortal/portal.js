/*GLOBAL CONSTANTS*/
var VENDOR_ID  = 0x1430; // 5168 in decimal Spyroporta
var WII_PRODUCT_ID = 0x0150; // 336 in decimal 
var XBOX_PRODUCT_ID = 0x1f17;

var DEVICE_INFO = 
	{"vendorId": VENDOR_ID, "productId": WII_PRODUCT_ID };
var DEVICE_INFO2 = 
	{"vendorId": VENDOR_ID, "productId": XBOX_PRODUCT_ID };


// portal state stuff.
var placed_characters = new Array();
//placed_characters[0] = {"portal_spot": 1, "Character": new SkylanderCharacter()};
var portal_spots = new Array();  
//portal_spots[5] = {"placed_character": 0, "Active": true, "Stability": 0...50?};
var pending_read = new Array();//? or just use SkylanderCharacter.blocks
// {"placed_character": 2, "BlockNumbers": [2,3,4]}
var currently_reading;
//{"placed_character": 2, "BlockNumber": 1, "Age": 4, "Retries": 4}

var connectionId = null;
var usbhandle;
var rw_buf_size = 0x21;
var myText;





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
				portalPorts[0].postMessage(
					{command: "status_change", data: chrome.runtime.lastError.message}
				);
			}
			else
			{
				if (data != null)
				{
					// Convert Byte into Ascii to follow the format of our device
					array = new Uint8Array(data);
					var raw_string = reportID + "-" + array.length + ":" + String.fromCharCode(array[0]);
					for(var i = 1 ; i < array.length; i++ )
					{
						raw_string = raw_string + ":" + array[i].toString(16);
					}
					portalPorts[0].postMessage(
						{command: "hid_data", data: raw_string}
					);
					var message_type = String.fromCharCode(array[0]);
					switch(message_type)
					{
						case 'Z':
							// sleeping
							// clear out placed_characters, and rread upon wake?
							// Probably, they could have all changed.
							/*if(portal_spots.length>0 || placed_characters.length>0)
							{
								placed_characters.splice(0,placed_characters.length);
								portal_spots.splice(0, portal_spots.length);
							}*/
							
							//nevermind. they simply won't match portal_spots
							// and that will remove thim.
							break;
						case 'S': 
							for(var i=0; i<4*8; i++)
							{
								var spot_taken = array[Math.floor(i/8)+1]&1<<(i%8);
								if(spot_taken)
								{ 
									if(portal_spots[i] == null)
									{
										portal_spots[i] = {"placed_character": placed_characters.length, Active: true, "Stability": 0};
										placed_characters[placed_characters.length] = {"portal_spot": i, "Character": null};
									}
									else
									{
										if(portal_spots[i].Active)
										{
											if(portal_spots[i].Stability < 50)
												portal_spots[i].Stability++
											else if(placed_characters[portal_spots[i].placed_character].Character == null)
											{// can we get here but alread have a character populated?
												placed_characters[portal_spots[i].placed_character].Character = new SkylanderCharacter();
												// new charcter
												pending_read[pending_read.length] = {
													"placed_character": portal_spots[i].placed_character,
													"BlockNumbers": [0,1] 
												};
											}
										}
										else
										{
											portal_spots[i].Active = true;
										}
									}

								}
								if(!spot_taken && portal_spots[i] != null && portal_spots[i].Active)
								{
									// character removed
									var num = portal_spots[i].placed_character;
									placed_characters[num].Character = null;
									if(currently_reading != null && currently_reading.placed_character == num)
										currently_reading = null;
									// clear pending reads for the removed character
									for(p in pending_read)
									{
										if(pending_read[p].placed_character == num)
											pending_read.splice(p,1);
									}
									//placed_characters.splice(num,1);
									// do we want to leave the spot blank?
									// yeah. we do...
									
									// renumber if necessary...
									/*for(pc in placed_characters)
									{
										if(pc<num)
											continue;

										portal_spots[placed_characters[pc].portal_spot].placed_character = pc;
									}*/
									portal_spots[i].Active = false;
								}
							}
							var recievedMessageCount = array[5];
							//if(recievedMessageCount - (messageCount+1)%256 && messageCount != null)
							//	console.log("missed messages: " +(messageCount - recievedMessageCount +1));

							messageCount = recievedMessageCount;
							break;
						case 'Q': // got a block read
						// create a pending reads to see if we missed some
						// remove the read from the pending reads 
							if(array[1] < 0x10)
							{
								console.log("invalid placedCharacter");
								break; 
							}
								 
							var placedCharacter = array[1] - 0x10;
							var blockNumber = array[2];
							//var name = characters[array[3] + array[4]*16];

							if(currently_reading != null)
								if(currently_reading.placed_character == placedCharacter && currently_reading.BlockNumber == blockNumber)
									currently_reading = null;
									
							var character = null;
							if(placed_characters[placedCharacter] != null)
								character = placed_characters[placedCharacter].Character;
								
							if(character == null)// must be first read...
								character = new SkylanderCharacter();
								
							character.importBlock(placedCharacter, blockNumber, array.subarray(3, array.length));
							//var obj = {"name": name};
							
							placed_characters[placedCharacter].Character = character;
							//var _portalSpot = placed_characters[placedCharacter]["portal_spot"];
							//portal_spots[_portalSpot].Character = character;
							//character type
	   					  		 console.log(character.name);
							break;

					}// end read message


					if(currently_reading != null && message_type != 'Z')
					{
						currently_reading.Age ++;
						if(currently_reading.Age > 50)
						{
							if(currently_reading.Retries >5)
								currently_reading = null;
							else
							{
								readBlock(currently_reading.placed_character, currently_reading.BlockNumber);
								currently_reading.Age = 0;
								currently_reading.Retries ++;
							}
						}
					}
					else if(pending_read.length > 0)
					{
						currently_reading = {
							"placed_character": pending_read[0].placed_character,
							"BlockNumber": pending_read[0].BlockNumbers[0],
							"Age": 0,
							"Retries": 0
						};
						readBlock(pending_read[0].placed_character, pending_read[0].BlockNumbers[0]);
						pending_read[0].BlockNumbers.splice(0,1);
						if(pending_read[0].BlockNumbers.length==0)
							pending_read.splice(0,1);
						//read off block 1 for the character name.
						//readBlock(portal_spots[i].placed_character, 1, null);
					}

					var characters_on_portal = "";
					for(var i = 0; i < placed_characters.length; i++)
						if(placed_characters[i] != null)
							if(placed_characters[i].Character != null)
								characters_on_portal += "#" + placed_characters[i].Character.characterId + " - " + placed_characters[i].Character.name + "(" + placed_characters[i].Character.serialNumber + "), ";
					portalPorts[0].postMessage(
						{command: "placed_characters_string", data: characters_on_portal}
					);
					if(String.fromCharCode(array[0]) != 'S' && String.fromCharCode(array[0]) != 'Z')
					{
						console.log(raw_string);
					}
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
			console.log('device not found');
			portalPorts[0].postMessage(
				{command: "status_change", data: "HID Device not found."}
			);
			return;
		}
		console.log('Found device: ' + devices[0].deviceId);
		portalPorts[0].postMessage(
			{command: "status_change", data: "HID Device not found."}
		);
		myHidDevice = devices[0].deviceId;
		
		console.log(devices);
		// Connect to the HID device
		chrome.hid.connect(myHidDevice, function(connection) {
			console.log('Connected to the HID device!');
			portalPorts[0].postMessage(
				{command: "status_change", data: "HID Device Connected: " + connection.connectionId}
			);
			connectionId = connection.connectionId;
			
			// Poll the USB HID Interrupt pipe
			pollHid();
		});
	});
}
chrome.hid.onDeviceAdded.addListener( function (device)
{
	if (!device) {
		console.log('device not found');
		portalPorts[0].postMessage(
			{command: "status_change", data: "HID Device not found."}
		);
		return;
	}
	console.log('Found device: ' + device.deviceId);
	portalPorts[0].postMessage(
		{command: "status_change", data: "HID Found device: " + device.deviceId}
	);
	myHidDevice = device.deviceId;
	
	/*document.getElementById("textbox").innerText = devices;*/
	//device_ = device;
	console.log(device);
	// Connect to the HID device
	chrome.hid.connect(myHidDevice, function(connection) {
		console.log('Connected to the HID device!');
		portalPorts[0].postMessage(
			{command: "status_change", data: "HID Device connected: " + connection.connectionId}
		);
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
	console.log(connectionHandle);
	usbhandle = connectionHandle;
	resetPortal();
	activatePortalAntenna();
	changePortalColor(255,255,255);
}

/***************************************/
/***** Portal Specific Usb Command *****/
/***************************************/
// put these in var portal = function(){ this.sendRequest = function()}?
// needs on usb device added/removed
function sendRequest(data) {
	var ti = {
		"requestType": "class", /*bmRequestType 0x21*/
		"recipient": "device", //interface",
		"direction": "in",
		"request": 0x09,//request, /*bRequest 0x09*/
		"value": 0x0200,//val,/*wValue 0x0200*/
		"index": 0,//idx,/*wIndex zero*/
		"length": rw_buf_size,
		"data": data.buffer
	};
	if(usbhandle)
		chrome.usb.controlTransfer(usbhandle, ti, sendCompleted);
}

function sendCommand(data)
{
	var ti = {
		"requestType": "class", /*bmRequestType 0x21*/
		"recipient": "device", //interface",
		"direction": "out",
		"request": 0x09,//request, /*bRequest 0x09*/
		"value": 0x0200,//val,/*wValue 0x0200*/
		"index": 0,//idx,/*wIndex zero*/
		"length": rw_buf_size,
		"data": data.buffer
	};
	if(usbhandle)
		chrome.usb.controlTransfer(usbhandle, ti, sendCompleted);
}

function sendCompleted(usbEvent)
{
	if (chrome.runtime.lastError)
	{
		console.error("sendCompleted Error:", chrome.runtime.lastError);
	}

	if (usbEvent)
	{
		if (usbEvent.data)
		{
			var buf = new Uint8Array(usbEvent.data);
			console.log("sendCompleted Buffer:", usbEvent.data.byteLength, buf);
			if(buf[0] = 0x51/*'Q'*/)
			{
				//add to pendingblockread list so we can retry if we miss it in polling
			}
		}
		if (usbEvent.resultCode !== 0) {
			console.error("Error writing to device", usbEvent.resultCode);
		}
	}
}

/***************************************/
/********** All the API stuffs**********/
/***************************************/
function resetPortal()
{
	var data = new Uint8Array(rw_buf_size);
		data[0] = 0x52; //R
		data[1] = 0x00;
		data[2] = 0x00;
		data[3] = 0x00;
	sendCommand(data);
}
function setPortalAntenna(upDown)
{
	if(typeof upDown === "number")
	{
		if(upDown == 0 || upDown == 1)
		var data = new Uint8Array(rw_buf_size);
			data[0] = 0x41; //A
			data[1] = upDown;
			data[2] = 0x00;
			data[3] = 0x00;
		sendCommand(data);
	}
	else
	{
		console.log("setPortalAntenna upDown is not numeric");
	}
}
function activatePortalAntenna()
{
	setPortalAntenna(1);
}
function deactivatePortalAntenna()
{
	setPortalAntenna(0);
}
function getPortalStatus()
{
	var data = new Uint8Array(rw_buf_size);
		data[0] = 0x53; // S
		data[1] = 0x00;
		data[2] = 0x00;
		data[3] = 0x00;
	sendCommand(data);
}
function changePortalColor(r, g, b)
{
	var data = new Uint8Array(rw_buf_size);
		data[0] = 0x43; // C
		data[1] = r; //R
		data[2] = g; //G
		data[3] = b; //B
	sendCommand(data);
}
function readBlock(/*number*/skylanderNumber, /*unsigned int*/ blockNumber/*, /*unsigned char* character_data/*[0x10]*/ )
{
	if(blockNumber > 40)// nothing past 40?
		return;
	var data = new Uint8Array(rw_buf_size);
		data[0] = 0x51;//0d81 Q for read obviously
		data[1] = 0x10+skylanderNumber;
		if(blockNumber == 0)
			data[1] +=0x10;
		data[2] = blockNumber;
	sendCommand(data);
}
function writeBlock(skylanderNumber, blockNumber, blockData)
{
	if(blockNumber > 40)// nothing past 40?
		return;
	var data = new Uint8Array(rw_buf_size);
		data[0] = 0x57;// W for wingcommander
		data[1] = 0x10+skylanderNumber;
		if(blockNumber == 0)
			data[1] +=0x10;
		data[2] = blockNumber;
	//sendCommand(data);
}
//todos
/*
figure out what kind
read battery status
read antenna status
read color
*/



/* start it all.*/
// done in background.js
