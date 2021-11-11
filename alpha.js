//I figure all of the Alpha reset stuff should go into a seperate file, mainly because of the convoluted upgrade code, which I will regret making later.

function alphaReset() {
	if (game.money.gte("1e10") && game.money.gte(game.alpha.shards.pow(10))) {
		game.alpha.resets += 1
		game.alpha.shards = game.alpha.shards.plus(getAlphaGain());
		game.money = new Decimal(0);
		game.rocket = {
			active:false,
			fuel: new Decimal(25),
			maxFuel: new Decimal(25),
			speed: new Decimal(0.001),
			exchangeRate: new Decimal(0.01),
			coolDown: new Decimal(2),
			cdActive: false,
			upgrade: [0,0,0,0],
			cost: [new Decimal(50),new Decimal(50),50,50],
			costMult: [1.15, 1.2, 1.05, 1.1],
			costMultInc: [0.02, 0.03, 0.05, 0.05],
			heightMax: new Decimal(1000),
			launched: new Decimal(0),
			time: new Decimal(0),
		}
		if (error.alphaUpgrades.includes("B2")) game.rocket.launched = new Decimal(25);
	}
}
function getAlphaGain() {
	var gain = new Decimal(game.money.pow(1/10));
	gain = gain.minus(game.alpha.shards);
	return gain;
}
//Alphatic Shards convert into Alphonium.
function alphoniumPurchase() {
	if (game.alpha.shards.gte(getSmeltingCost())) {
		game.alpha.shards = game.alpha.shards.minus(getSmeltingCost());
		game.alpha.alphonium = game.alpha.alphonium.plus(1);
		game.alpha.totalAlphonium = game.alpha.totalAlphonium.plus(1);
	}
}
function getSmeltingCost() {
	var cost = Decimal.pow(10, Decimal.add(1, game.alpha.totalAlphonium));
	return cost;
	
}
//It wouldn't be an incremental without tons of upgrades.
//The upgrade code MIGHT be a bit... messy
//First, we verify if upgrades can be bought. 
function verifyAlphaUpgrade(column, row) {
	var cost;
	if (row == 1 || row == 2) cost = 1;
	if (row == 3 || row == 5 || row == 6) cost = 2;
	if (row == 4) cost = 3;
	if (row == 7) cost = 4;
	if (row == 8) cost = 5;
	
	if(!upgIncl(column + row)) {
	switch(column) {
			case "A":
			if (row > 6 || row < 4) return false;
			if (row == 4 && upgIncl("E4") && upgIncl("B4") && game.alpha.alphonium.gte(cost)) return true;
			if (row <= 6 && row >= 5 && error.alphaUpgrades.includes("A" + (row-1)) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "B":
			if (row == 1 && !upgIncl("E1") && !upgIncl("H1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("E1") && upgIncl("E7") && !upgIncl("H1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("H1") && upgIncl("H7") && !upgIncl("E1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("E1") && upgIncl("E7") && upgIncl("H1") && upgIncl("H7") && game.alpha.alphonium.gte(cost)) return true;
			if (row > 1 && upgIncl("B"+(row-1)) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "C":
			if (row > 6 || row < 4) return false;
			if (row == 4 && upgIncl("H4") && upgIncl("B4") && game.alpha.alphonium.gte(cost)) return true;
			if (row <= 6 && row >= 5 && error.alphaUpgrades.includes("C" + (row-1)) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "D":
			if (row > 6 || row < 4) return false;
			if (row == 4 && upgIncl("E4") && upgIncl("B4") && game.alpha.alphonium.gte(cost)) return true;
			if (row <= 6 && row >= 5 && error.alphaUpgrades.includes("D" + (row-1)) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "E":
			if (row == 1 && !upgIncl("B1") && !upgIncl("H1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("B1") && upgIncl("B7") && !upgIncl("H1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("H1") && upgIncl("H7") && !upgIncl("B1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("B1") && upgIncl("B7") && upgIncl("H1") && upgIncl("H7") && game.alpha.alphonium.gte(cost)) return true;
			if (row > 1 && upgIncl("E"+(row-1)) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "F":
			if (row > 6 || row < 4) return false;
			if (row == 4 && upgIncl("H4") && upgIncl("E4") && game.alpha.alphonium.gte(cost)) return true;
			if (row <= 6 && row >= 5 && error.alphaUpgrades.includes("F" + (row-1)) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "G":
			if (row > 6 || row < 4) return false;
			if (row == 4 && upgIncl("H4") && upgIncl("B4") && game.alpha.alphonium.gte(cost)) return true;
			if (row <= 6 && row >= 5 && error.alphaUpgrades.includes("G" + (row-1)) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "H":
			if (row == 1 && !upgIncl("E1") && !upgIncl("B1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("E1") && upgIncl("E7") && !upgIncl("B1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("B1") && upgIncl("B7") && !upgIncl("E1") && game.alpha.alphonium.gte(cost)) return true;
			if (row == 1 && upgIncl("E1") && upgIncl("E7") && upgIncl("B1") && upgIncl("B7") && game.alpha.alphonium.gte(cost)) return true;
			if (row > 1 && upgIncl("H"+(row-1)) && game.alpha.alphonium.gte(cost)) return true;
			break
			case "I":
			if (row > 6 || row < 4) return false;
			if (row == 4 && upgIncl("H4") && upgIncl("E4") && game.alpha.alphonium.gte(cost)) return true;
			if (row <= 6 && row >= 5 && error.alphaUpgrades.includes("I" + (row-1)) && game.alpha.alphonium.gte(cost)) return true;
			break
		}
		if (game.alpha.alphonium.lt(cost)) return false;
	}
	else return false;
}

//Second, the code for actually buying the upgrade.
function buyAlphaUpgrade(column, row) {
	var cost;
	if (row == 1 || row == 2) cost = 1;
	if (row == 3 || row == 5 || row == 6) cost = 2;
	if (row == 4) cost = 3;
	if (row == 7) cost = 4;
	if (row == 8) cost = 5;
	if (verifyAlphaUpgrade(column, row)) {
		error.alphaUpgrades.push(column + row);
		game.alpha.alphonium = game.alpha.alphonium.minus(cost);
	}
}

//Third, the code for describing upgrades.
function getAlphaDescription(column, row) {
	var desc;
	switch(column) {
		case "B":
		switch(row) {
			case 1:
			desc = "Upgrade B1<br>";
			desc += "Unlocks the Grinder path.<br>";
			desc += "Double the amount of launched stat you get per launch.<br>";
			desc += "Increase neta gain based on launches this Alpha. Currently x" + scientific.format(getAlphaUpgradeEffect("B", 1, 0),2,2) + "<br>";
			desc += "Increase neta based on time this Alpha. Currently x" + scientific.format(getAlphaUpgradeEffect("B", 1, 1),2,2) + "<br>";
			break
			case 2:
			desc = "Upgrade B2<br>"
			desc += "You start each Alpha as if you have already done 25 rocket launches<br>"
			desc += "The power of the first upgrade is increased based on launches this Alpha<br>"
			desc += "You get +1 launched stat per launch, before multipliers are applied."
			break
			case 3:
			desc = "Upgrade B3<br>"
			desc += "Neta gain is increased more based on launches this Alpha. Currently x" + scientific.format(getAlphaUpgradeEffect("B",3,0),2,2) + "<br>"
			desc += "You get +3 launched stat per launch, before multipliers are applied."
			break
			case 4:
			desc = "Upgrade B4<br>"
			desc += "Unlock Assistants.<br>"
			desc += "If you have upgrades E4 or H4, upgrades D4 and G4 become available.<br>"
			break
			case 5:
			desc = "Upgrade B5<br>"
			desc += "Time moves faster based on launches per launch, before multipliers.<br>"
			desc += "Assistants gain more EXP based on launches this alpha.<br>"
			desc += "You gain more launches per launch based on total assistant levels.<br>"
			break
			case 6:
			desc = "Upgrade B6<br>"
			desc += "Neta gain is increased more based on time this alpha.<br>"
			desc += "You bank 10% of launches this alpha and time this alpha.<br>"
			desc += "Assistant level caps are increased by 25.<br>"
			desc += "You gain more launches per launch based on time this alpha.<br>"
			break
			case 7:
			desc = "Upgrade B7<br>"
			desc += "You can buy another upgrade from the first row. It will now cost the value"
			if (upgIncl("E1") || upgIncl("H1")) desc += " on the right of the Cost column.<br>"
			else desc += " in the center of the Cost column.<br>"
			desc += "Cost of all permanent upgrades are doubled.<br>"
			desc += "Double launch stat per launch.<br>"
			desc += "Increase launch stat per launch by +10.<br>"
			desc += "Neta gain is increased even more based on launches this Alpha.<br>"
			desc += "Neta gain is increased even more based on time this alpha.<br>"
			desc += "You start each Alpha with 25 launches, multiplied by launch stat multipliers.<br>"
			desc += "You start each Alpha with 10 minutes on the clock.<br>"
			desc += "Assistant level caps are increased by 75.<br>"
			desc += "Assistant EXP gain is doubled.<br>"
			desc += "Launch stat per launch, time speed, and assistant EXP gain is increased based on total smelted Alphonium.<br>"
			desc += "If you have all other upgrades, E8 becomes available for purchase."
		}
		break
	}
	if (column + row == "Z0") {
		desc = "Click on an upgrade to see what it does!<br>Click on an upgrade again to purchase it.<br>"
		desc += "The cost of an upgrade is the leftmost value for the first main(B, E, H) column you use.<br>"
		desc += "The second main column you use uses the center value, and the third uses the right value.<br>"
		desc += "Secondary columns (A,C,D,F,G,I) always use the center value.<br>"
	}
	ge("alphaEffect").innerHTML = desc;
}

//Fourth, what the upgrade doin
function getAlphaUpgradeEffect(column, row, type) {
	var effect;
	switch(column) {
		case "B":
		switch(row) {
			case 1:
			if (type == 0) return game.rocket.launched.times(3).pow(1.5).div(3).plus(1);
			if (type == 1) return game.rocket.time.pow(1.2).plus(1);
			break
			case 3:
			if (type == 0) return game.rocket.launched.times(10).pow(2.3).div(2).plus(1);
			break
		}
		
		break
	
	}
}

//Fifth, for HOW you buy the upgrade.
var upgradeSelected = ["Z", 0];
function alphaUpgradeClick(column, row) {
	if (upgradeSelected[0] == column && upgradeSelected[1] == row) buyAlphaUpgrade(column, row);
	else {
		getAlphaDescription(column, row);
		upgradeSelected = [column, row];
	}
}
//Sixth, for changing the upgrade's appearance in the menu
function alphaUpgradeView(column, row) {
	if (error.alphaUpgrades.includes(column+row)) ge("alpha"+column+row).className = "miniAlphaBought";
	else if(verifyAlphaUpgrade(column, row)) ge("alpha"+column+row).className = "miniAlphaYes";
	else ge("alpha"+column+row).className = "miniAlphaNo";
}
function upgIncl(upg) {
	return error.alphaUpgrades.includes(upg);
}
window.setInterval(function() {
	getAlphaDescription(upgradeSelected[0], upgradeSelected[1]);
}, 100)
