/*GLOBAL CONSTANTS*/
var VENDOR_ID  = 0x1430; // 5168 in decimal Spyroporta
var WII_PRODUCT_ID = 0x0150; // 336 in decimal 
var XBOX_PRODUCT_ID = 0x1f17;

var DEVICE_INFO = 
	{"vendorId": VENDOR_ID, "productId": WII_PRODUCT_ID };
var DEVICE_INFO2 = 
	{"vendorId": VENDOR_ID, "productId": XBOX_PRODUCT_ID };

	//Change CHARACTER_NAMES to CHARACTRS. with names and attributes.
var CHARACTER_NAMES = {
	0: "Character_Whirlwind",
	1: "Character_SonicBoom",
	2: "Character_Warnado",
	3: "Character_LightningRod",
	4: "Character_Bash",
	5: "Character_Terrafin",
	6: "Character_DinoRang",
	7: "Character_PrismBreak",
	8: "Character_Sunburn",
	9: "Character_Eruptor",
	10: "Character_Ignitor",
	11: "Character_Flameslinger",
	12: "Character_Zap",
	13: "Character_WhamShell",
	14: "Character_GillGrunt",
	15: "Character_SlamBam",
	16: "Character_Spyro",
	17: "Character_Voodood",
	18: "Character_DoubleTrouble",
	19: "Character_TriggerHappy",
	20: "Character_Drobot",
	21: "Character_DrillSergeant",
	22: "Character_Boomer",
	23: "Character_WreckingBall",
	24: "Character_Camo",
	25: "Character_Zook",
	26: "Character_StealthElf",
	27: "Character_StumpSmash",
	28: "Character_DarkSpyro",
	29: "Character_Hex",
	30: "Character_ChopChop",
	31: "Character_GhostRoaster",
	32: "Character_Cynder",
	100: "Character_2012",
	100: "Character_Bouncer",
	100: "Character_JetVac",
	101: "Character_Swarm",
	102: "Character_Crusher",
	103: "Character_Flashwing",
	104: "Character_HotHead",
	105: "Character_HotDog",
	106: "Character_Chill",
	107: "Character_Thumpback",
	108: "Character_PopFizz",
	109: "Character_Ninjinni",
	111: "Character_Sprocket",
	112: "Character_TreeRex",
	113: "Character_Shroomboom",
	114: "Character_EyeBrawl",
	115: "Character_FrightRider",
	200: "ITEM",
	200: "Item_Anvil",
	201: "Item_SecretStash",
	202: "Item_Regeneration",
	203: "Item_CrossedSwords",
	204: "Item_Hourglass",
	205: "Item_Shield",
	206: "Item_SpeedBoots",
	207: "Item_Sparx",
	208: "Item_Cannon",
	209: "Item_Catapult",
	300: "EXPANSION",
	300: "Expansion_Dragon",
	301: "Expansion_Ice",
	302: "Expansion_Pirate",
	303: "Expansion_Undead",
	304: "Expansion_PVPUnlock",
	400: "LEGENDARY",
	404: "Legendary_Bash",
	416: "Legendary_Spyro",
	419: "Legendary_TriggerHappy",
	430: "Legendary_ChopChop",
	500: "PET",
	505: "Pet_TerraBite",//fin",
	514: "Pet_GillRunt",//Grunt",
	519: "Pet_TriggerSnappy",//Happy",
	526: "Pet_WhisperElf",//StealthElf",
	540: "SideKick_Barkley",//TreeRex",
	541: "SideKick_Thumpling",//back",
	542: "SideKick_MiniJini",//Ninjini",
	543: "SideKick_EyeSmall",//Brawl",
	2004: "CharacterTop-Bomb",
	1004: "CharacterBottom-Blast",
	2010: "CharacterTop-NitroMagna",
	1010: "CharacterBottom-Charge",
	2015: "CharacterTop-Wash",
	1015: "CharacterBottom-Buckler",
	2014: "CharacterTop-Freeze",
	1014: "CharacterBottom-Blade"
};
//HATS etc


function SkylanderCharacter()
{
	this.portalPlacementNumber;

	this.blocks = new Array();
	this.serialNumber;
	this.characterId;
	this.name;
	this.baseColor;
	this.series;
	this.toyType;
	this.tradingCardId = new Array();
	this.getTradingCardId = function()
	{
		var tcid = "";
		for(var i=0; i<this.tradingCardId.length; i++)
			tcid += this.tradingCardId[i].toString(16) + ":";
		return tcid;
	}
	
	this.getName = function()
	{
		if(this.characterId != null)
			return CHARACTER_NAMES[this.characterId];
	}
	// array[0] == 'Q';
	// ppn = array[0]-0x10;
	// blockNumber = array[2];
	// data = array.subarray(2,array.length);
	this.importBlock = function(ppn, blockNumber, data)
	{
		if(this.portalPlacementNumber == null)
			this.portalPlacementNumber = ppn;
		else if(this.portalPlacementNumber != ppn)
			console.log("PortalPlacmentNumber didn't match error");
		
		this.blocks[blockNumber] = data;
		switch(blockNumber)
		{
			
			case 0:
				//serialNumber 0-2
				this.serialNumber = data[0] + data[1]*0x100 + data[2]*0x10000//3,4also?;
				
				// x04 -0x0E unknown 
				// 0x4=?
				// 0x5 = 129
				// 0x6 = 1 
				// 0x7 = 15
				// 0x8 = 196(195 spyro1)
				// 0x9 = 56,57,39,51...
				// 00000
				// 0xf = 18(17 spyro1, 19 elf3 wash magna blade freeze blast)? 
			
				var _us = "";
				for(var i = 0x4 ; i < array.length; i++ )
				{
					_us = _us + ":" + array[i].toString(16);
				}
				this.unknownData = _us
				break;
			case 1:
				// block 1 
				this.characterId = data[0] + data[1]*0x100;
				this.name = this.getName();
				for(var i=0; i<8; i++)
					this.tradingCardId[i] = data[4+i];
				//0x0c = character iteration
					//0(bomb/blast,freeze/blade,wash/buckrer),
					//2(magna/charge),
					//5(elf3) ,0=elf, 1=legendary?, 2=elf2?, 3=dark?, 4=elf3? 
					//0(elf,spyro1,dark),
					//1(cynder2),
					//0(jetvac, barkly, eyesmall)
					//6(light core shroom boom, lc hex,lc prisim)
				//0x0d = compatabilty/base color?
					//32(bomb/blast,freeze/blade,wash/buckrer), 
					//36(magna/charge),
					//40(elf3),
					//0(elf,spyro1,dark), 
					//24(cynder2),
					//16(jetvac, barkley, eyesmall)
					//18(lightcore shroom, lc hex, lc prisim)
				/*switch(data[0xd])
				{
					case 0:
						this.base="green";
						break;
					case 1:
						this.base="orange";
						break;
					case 3:
					default:
						this.base="blue";
						break;
				}*/
				//0x0e, +2, CRC16 type0
				break;
			case 2:
			default:
				console.log("import block not implement for block " + blockNumber);
				break;

		}
	}
	this.createBlock = function(blockNumber)
	{
		var data = new Uint8Array(16);
		switch(blockNumber)
		{
			case 0:// should be read only
				data[0] = this.serialNumber%0xff;
				data[1] = Math.floor(this.serialNumber/0xff);
				break;

		}
		return data;
	}
}

// portal state stuff.
var placed_characters = new Array();
//placed_characters[0] = {"portal_spot":1, "Character": new SkylanderCharacter()};
var portal_spots = new Array();  
//portal_spots[5] = {"placed_character": 0, "Active": true, "Stability":0...50?};
var pending_read = new Array();//? or just use SkylanderCharacter.blocks
// {"placed_character": 2, "BlockNumbers":[2,3,4]}
var currently_reading;
//{"placed_character":2, "BlockNumber":1, "Age":4, "Retries":4}

var connectionId = null;
var usbhandle;
var rw_buf_size = 0x21;
var myText;


document.addEventListener('DOMContentLoaded', function(){
	document.getElementById("resetPortal").addEventListener("click", resetPortal);
	document.getElementById("activatePortalAntenna").addEventListener('click',  activatePortalAntenna);
	document.getElementById("restartPolling").addEventListener('click',  myDevicePoll);
	document.getElementById("color").addEventListener("change", changeColor);
	myText = document.getElementById("mytext");
});




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
				myText.value = chrome.runtime.lastError.message;
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
					if(myText != null)
						myText.value = raw_string;
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
								characters_on_portal += "#" + placed_characters[i].Character.characterId + " - " +placed_characters[i].Character.name+"(" + placed_characters[i].Character.serialNumber + "), ";
					document.getElementById("textbox").innerText = characters_on_portal;

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
			myText.value = "device not found";
			return;
		}
		console.log('Found device: ' + devices[0].deviceId);
		if(myText != null)
			myText.value = 'Found device: ' + devices[0].deviceId;
		myHidDevice = devices[0].deviceId;
		
		/*document.getElementById("textbox").innerText = devices;*/
		console.log(devices);
		// Connect to the HID device
		chrome.hid.connect(myHidDevice, function(connection) {
			console.log('Connected to the HID device!');
			if(myText != null)
				myText.value = 'Device Connected : ' + connection.connectionId;
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
		if(myText != null)
			myText.value = "device not found";
		return;
	}
	console.log('Found device: ' + device.deviceId);
	if(myText != null)
		myText.value = 'Found device: ' + device.deviceId;
	myHidDevice = device.deviceId;
	
	/*document.getElementById("textbox").innerText = devices;*/
	//device_ = device;
	console.log(device);
	// Connect to the HID device
	chrome.hid.connect(myHidDevice, function(connection) {
		console.log('Connected to the HID device!');
		myText.value = 'Device Connected : ' + connection.connectionId;
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
			chrome.usb.openDevice(devices[0],onOpenDevice);
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
	changeColor();
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
function activatePortalAntenna()
{
	var data = new Uint8Array(rw_buf_size);
		data[0] = 0x41; //A
		data[1] = 0x01;
		data[2] = 0x00;
		data[3] = 0x00;
	sendCommand(data);
}
function deactivatePortalAntenna()
{
	var data = new Uint8Array(rw_buf_size);
		data[0] = 0x41; //A
		data[1] = 0x00;
		data[2] = 0x00;
		data[3] = 0x00;
	sendCommand(data);
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
	var color = document.getElementById("color").value;
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

/*set the color via the color.js widget*/
function changeColor()
{
	var color = document.getElementById("color").value;
	var r = parseInt("0x"+color.substr(0,2)); //R
	var g = parseInt("0x"+color.substr(2,2)); //G
	var b = parseInt("0x"+color.substr(4,2)); //B
	changePortalColor(r, g, b);
}



/* start it all.*/

initializeHid(myDevicePoll);
setup_usb();