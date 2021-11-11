//I figure all of the Alpha reset stuff should go into a seperate file, mainly because of the convoluted upgrade code, which I will regret making later.

//Gaining Tech Points.
function getSmeltingCost() {
	var cost = Decimal.pow(10, Decimal.add(1, game.alpha.totalAlphonium));
	return cost;
	
}
//It wouldn't be an incremental without tons of upgrades.
//The upgrade code MIGHT be a bit... messy
//First, we verify if upgrades can be bought. 
function verifyUpgrade(tree, row, column) {
	var cost;
	if (row == 1 || row == 2) cost = 1;
	if (row == 3) cost = 2;
	if (row == 4) cost = 3;
	if (game.tech.points.gte(cost)) {
	switch(tree){
		case "grinder"
		if (game.tech.points.gte(cost)) {
		if (column < 3) {
			if (grindUpgIncl("g" + (row-1) + column)) return true;
			if (grindUpgIncl("g" + row + (column+1)) return true;
		}
		if (column == 3) {
			if (grindUpgIncl("g" + (row-1) + column)) return true;
		}
		if (column > 3) {
			if (grindUpgIncl("g" + (row-1) + column)) return true;
			if (grindUpgIncl("g" + row + (column-1)) return true;
		}
		break
	}
	}
}

//Second, the code for actually buying the upgrade.
function buyAlphaUpgrade(column, row) {
	var cost;
	if (row == 1 || row == 2) cost = 1;
	if (row == 3) cost = 2;
	if (row == 4) cost = 3;
	if (verifyUpgrade(tree, column, row)) {
		error.alphaUpgrades.push(column + row);
		game.alpha.alphonium = game.alpha.alphonium.minus(cost);
	}
}

//Third, the code for describing upgrades.
function getAlphaDescription(column, row) {
	var desc;
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
function grindUpgIncl(upg) {
	return grinder.tier1.includes(upg);
}

window.setInterval(function() {
	getAlphaDescription(upgradeSelected[0], upgradeSelected[1]);
}, 100)
