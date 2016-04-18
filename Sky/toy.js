
var DOMAIN = "https://www.skylanders.com/";
var SITE_BASE_PATH = "characters/";
var SOUND_BASE_PATH = "content/dam/atvi/skylanders/base/characters/audio/";
var TOY_INFO = {
	0: {"Type": "Character", "Name": "Whirlwind"},
	// "Element": "Air", "webname": "whirlwind", "Youtube": "FM_xV6ZFpz0", "SoundBite": "vo_whirlwind_catchphrase_01.ogg"},
	1: {"Type": "Character", "Name": "SonicBoom"},
	2: {"Type": "Character", "Name": "Warnado"},
	3: {"Type": "Character", "Name": "LightningRod"},
	4: {"Type": "Character", "Name": "Bash"},
	5: {"Type": "Character", "Name": "Terrafin"},
	6: {"Type": "Character", "Name": "DinoRang"},
	7: {"Type": "Character", "Name": "PrismBreak"},
	8: {"Type": "Character", "Name": "Sunburn"},
	9: {"Type": "Character", "Name": "Eruptor"},
	10: {"Type": "Character", "Name": "Ignitor"},
	11: {"Type": "Character", "Name": "Flameslinger"},
	12: {"Type": "Character", "Name": "Zap"},
	13: {"Type": "Character", "Name": "WhamShell"},
	14: {"Type": "Character", "Name": "GillGrunt"},
	15: {"Type": "Character", "Name": "SlamBam"},
	16: {"Type": "Character", "Name": "Spyro"},
	17: {"Type": "Character", "Name": "Voodood"},
	18: {"Type": "Character", "Name": "DoubleTrouble"},
	19: {"Type": "Character", "Name": "TriggerHappy"},
	20: {"Type": "Character", "Name": "Drobot"},
	21: {"Type": "Character", "Name": "DrillSergeant"},
	22: {"Type": "Character", "Name": "Boomer"},
	23: {"Type": "Character", "Name": "WreckingBall"},
	24: {"Type": "Character", "Name": "Camo"},
	25: {"Type": "Character", "Name": "Zook"},
	26: {"Type": "Character", "Name": "StealthElf"},
	27: {"Type": "Character", "Name": "StumpSmash"},
	28: {"Type": "Character", "Name": "DarkSpyro"},
	29: {"Type": "Character", "Name": "Hex"},
	30: {"Type": "Character", "Name": "ChopChop"},
	31: {"Type": "Character", "Name": "GhostRoaster"},
	32: {"Type": "Character", "Name": "Cynder"},
	100: {"Type": "Character", "Name": "2012"},
	100: {"Type": "Character", "Name": "Bouncer"},
	100: {"Type": "Character", "Name": "JetVac"},
	101: {"Type": "Character", "Name": "Swarm"},
	102: {"Type": "Character", "Name": "Crusher"},
	103: {"Type": "Character", "Name": "Flashwing"},
	104: {"Type": "Character", "Name": "HotHead"},
	105: {"Type": "Character", "Name": "HotDog"},
	106: {"Type": "Character", "Name": "Chill"},
	107: {"Type": "Character", "Name": "Thumpback"},
	108: {"Type": "Character", "Name": "PopFizz"},
	109: {"Type": "Character", "Name": "Ninjinni"},
	111: {"Type": "Character", "Name": "Sprocket"},
	112: {"Type": "Character", "Name": "TreeRex"},
	113: {"Type": "Character", "Name": "Shroomboom"},
	114: {"Type": "Character", "Name": "EyeBrawl"},
	115: {"Type": "Character", "Name": "FrightRider"},
	/*200: "ITEM",*/
	200: {"Type": "Item", "Name": "Anvil"},
	201: {"Type": "Item", "Name": "SecretStash"},
	202: {"Type": "Item", "Name": "Regeneration"},
	203: {"Type": "Item", "Name": "CrossedSwords"},
	204: {"Type": "Item", "Name": "Hourglass"},
	205: {"Type": "Item", "Name": "Shield"},
	206: {"Type": "Item", "Name": "SpeedBoots"},
	207: {"Type": "Item", "Name": "Sparx"},
	208: {"Type": "Item", "Name": "Cannon"},
	209: {"Type": "Item", "Name": "Catapult"},
	/*300: "EXPANSION",*/
	300: {"Type": "Expansion", "Name": "Dragon"},
	301: {"Type": "Expansion", "Name": "Ice"},
	302: {"Type": "Expansion", "Name": "Pirate"},
	303: {"Type": "Expansion", "Name": "Undead"},
	304: {"Type": "Expansion", "Name": "PVPUnlock"},
	/*400: "LEGENDARY",*/
	404: {"Type": "Legendary", "Name": "Bash"},
	416: {"Type": "Legendary", "Name": "Spyro"},
	419: {"Type": "Legendary", "Name": "TriggerHappy"},
	430: {"Type": "Legendary", "Name": "ChopChop"},
	/*500: "PET",*/
	505: {"Type": "Pet", "Name": "TerraBite"},//fin"},
	514: {"Type": "Pet", "Name": "GillRunt"},//Grunt"},
	519: {"Type": "Pet", "Name": "TriggerSnappy"},//Happy"},
	526: {"Type": "Pet", "Name": "WhisperElf"},//StealthElf"},
	540: {"Type": "SideKick", "Name": "Barkley"},//TreeRex"},
	541: {"Type": "SideKick", "Name": "Thumpling"},//back"},
	542: {"Type": "SideKick", "Name": "MiniJini"},//Ninjini"},
	543: {"Type": "SideKick", "Name": "EyeSmall"},//Brawl"}
	/*1000: CharacterTop*/
	/*2000: CharacterBottom*/
	2004: {"Type": "CharacterTop", "Name": "Bomb"},
	1004: {"Type": "CharacterBottom", "Name": "Blast"},
	2010: {"Type": "CharacterTop", "Name": "NitroMagna"},
	1010: {"Type": "CharacterBottom", "Name": "Charge"},
	2015: {"Type": "CharacterTop", "Name": "Wash"},
	1015: {"Type": "CharacterBottom", "Name": "Buckler"},
	2014: {"Type": "CharacterTop", "Name": "Freeze"},
	1014: {"Type": "CharacterBottom", "Name": "Blade"}
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
			return TOY_INFO[this.characterId].Name;
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
