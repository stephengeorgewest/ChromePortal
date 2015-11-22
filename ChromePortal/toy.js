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
