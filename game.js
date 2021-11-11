//Classes will go up here, if I make any.

//Your save file! If you need to save and somehow I broke the Export button, copy the game variable.
var game = {
	money: new Decimal(0),
	rocket:{
		active:false,
		fuel: new Decimal(25),
		maxFuel: new Decimal(25),
		speed: new Decimal(0.001),
		exchangeRate: new Decimal(1000),
		coolDown: new Decimal(4),
		cdActive: false,
		upgrade: [0,0,0,0],
		cost: [new Decimal(50),new Decimal(50),new Decimal(50),new Decimal(50)],
		costMult: [1.35, 1.2, 1.3, 1.2],
		costMultInc: [0.05, 0.05, 0.1, 0.05],
		heightMax: new Decimal(1),
		launched: new Decimal(0),
		time: new Decimal(0),
	},
	alpha:{
		resets:0,
		shards: new Decimal(0),
		alphonium: new Decimal(0),
		totalAlphonium: new Decimal(0),
		repeatUps:[0, 0, 0, 0],
		cost:[new Decimal(10), new Decimal(10), new Decimal(10), new Decimal(10)],
		costMult:[3, 3, 5, 10],
		launchMult: new Decimal(1),
		time: new Decimal(0),
		boostMac:{
			
		},
		challenges: {
			
			
		},
		assistants: {
			unlocked:false,
			xpMult:new Decimal(0),
			//Level, max level, exp so far
			basic:[0,100,new Decimal(0)],
			meta:[0,100, new Decimal(0)],
			
		},
	},
	totalMoney:new Decimal(0),
	
}
var error = {
	alphaUpgrades:[]
	
	
};
const scientific = new ADNotations.ScientificNotation();
//A general getElement function.
function ge(x) {
	return document.getElementById(x)
}
//Launching the rocket.
function rocketLaunch() {
	if (game.rocket.active == false && game.rocket.cdActive == false) {
		game.rocket.active = true;
		game.rocket.launched = game.rocket.launched.plus(game.alpha.launchMult);
	}
}
//Getting the rocket's current height.
function getHeight() {
	var height = game.rocket.maxFuel.sub(game.rocket.fuel).times(game.rocket.speed);
	if (height.gte(1)) height = height.minus(1).times(100).pow(1/1.5).div(100).plus(1);
	if (height.gte(2)) height = height.minus(2).times(100).pow(1/1.5).div(100).plus(2);
	if (height.gte(4)) height = height.minus(4).times(100).pow(1/1.5).div(100).plus(4);
	if (height.gte(game.rocket.heightMax)) height = game.rocket.heightMax;
	return height;
}
//Increases your money.
function incMoney() {
	if (game.rocket.fuel.gt(0)) {
		game.money = game.money.plus(getNetaGain());
		game.totalMoney = game.totalMoney.plus(getNetaGain());
		game.rocket.fuel = game.rocket.fuel.minus(getConsumption());
	}
	if (game.rocket.fuel.lte(0)) {
		game.rocket.fuel = new Decimal(0);
		game.rocket.active = false;
		game.rocket.cdActive = true;
	}
}
//Refuels your rocket after a launch is finished.
function refuel() {
	if (game.rocket.fuel.lt(game.rocket.maxFuel)) {
		game.rocket.fuel = game.rocket.fuel.plus(game.rocket.coolDown/30);
	}
	if (game.rocket.fuel.gte(game.rocket.maxFuel)) {
		game.rocket.cdActive = false;
	}
}

//Upgrading the rocket. The upgrading is simple, but it starts to get difficult later.
function upgrade(id) {
	if (id >= 0 && id <= 3) {
		if (game.money.gte(game.rocket.cost[id]) && game.rocket.active == false) {
			game.money = game.money.minus(game.rocket.cost[id]);
			game.rocket.upgrade[id]++
		}
		initUpgrades();
		if (id == 2) game.rocket.cdActive = true;
	}
	if (id >= 4 && id <= 7) {
		if (game.alpha.shards.gte(game.alpha.cost[id]) && game.rocket.active == false) {
			game.alpha.shards = game.alpha.shards.minus(game.alpha.cost[id-4]);
			game.alpha.repeatUps[id-4]++;
		}
		initUpgrades();
	}
}
function getUpgradeCost(id) {
	if (id >= 0 && id <= 3) {
		var costMult = Decimal.add(game.rocket.costMult[id], Decimal.mul(game.rocket.costMultInc[id], game.rocket.upgrade[id]));
		var cost = Decimal.mul(50, Decimal.pow(costMult, game.rocket.upgrade[id]));
	}
	if (id >= 4 && id <= 7) {
		var cost = Decimal.mul(10, Decimal.pow(game.alpha.costMult[id-4], game.alpha.repeatUps[id-4]));
	}
	return cost;
}
function updateCostMults() {
	game.rocket.costMult = [1.2, 1.1, 1.25, 1.35];
	game.rocket.costMultInc = [0.025, 0.03, 0.1, 0.1];
	game.rocket.coolDown = new Decimal(5).plus(game.rocket.upgrade[2]);
	if (game.rocket.upgrade[2] >= 15) game.rocket.costMultInc[2] = 0.3;
}
//Get the neta gain. Also the first time I use a while loop in a long time.
function getNetaGain() {
	var moneyTemp  = getHeight().div(30).times(game.rocket.exchangeRate)
	var iterations = 0
	while(Decimal.log10(moneyTemp) > 100) {
		moneyTemp = moneyTemp.div(1e100);
		moneyTemp = moneyTemp.pow(0.8);
		iterations++;
	}
	moneyTemp = moneyTemp.times(Decimal.pow(1e100, iterations));
	return moneyTemp;
}
//Initializes the upgrades.
function initUpgrades() {
	initSpeed();
	initFuel();
	initExchangeRate();
	initMaxHeight();
	initOthers();
}
//Initialize speed
function initSpeed() {
	//Buffs
	game.rocket.speed = Decimal.add("1e-3", new Decimal("3e-4").times(game.rocket.upgrade[1]));
	game.rocket.speed = game.rocket.speed.times(Decimal.pow(1.12, game.rocket.upgrade[1]));
}
//Init Fuel
function initFuel() {
	//Buffs
	game.rocket.maxFuel = Decimal.add(25, Decimal.mul(5, game.rocket.upgrade[2]));
}
//Init Exchange Rate
function initExchangeRate() {
	//Multipliers
	var up1Pow = new Decimal(1.3)
	if (error.alphaUpgrades.includes("B2")) up1Pow = up1Pow.plus(Decimal.mul(0.005, game.rocket.launched));
	game.rocket.exchangeRate = Decimal.add(250, Decimal.mul(75, game.rocket.upgrade[0]));
	game.rocket.exchangeRate = game.rocket.exchangeRate.times(Decimal.pow(up1Pow, game.rocket.upgrade[0]));
	if (game.rocket.maxFuel.gte(100)) game.rocket.exchangeRate = game.rocket.exchangeRate.times(10);
	game.rocket.exchangeRate = game.rocket.exchangeRate.times(Decimal.pow(3, game.alpha.repeatUps[0]));
	if (game.rocket.heightMax.lte(getHeight())) game.rocket.exchangeRate = game.rocket.exchangeRate.times(Decimal.pow(3, game.alpha.repeatUps[1]));
	if (getHeight().gte(2)) game.rocket.exchangeRate = game.rocket.exchangeRate.times(getHeight().sub(2).times(10).pow(2).plus(1));
	if (getHeight().gte(4)) game.rocket.exchangeRate = game.rocket.exchangeRate.times(getHeight().sub(4).times(10).pow(2).plus(1));
	if (error.alphaUpgrades.includes("B1")) game.rocket.exchangeRate = game.rocket.exchangeRate.times(getAlphaUpgradeEffect("B", 1, 0));
	if (error.alphaUpgrades.includes("B1")) game.rocket.exchangeRate = game.rocket.exchangeRate.times(getAlphaUpgradeEffect("B", 1, 1));
	if (error.alphaUpgrades.includes("B3")) game.rocket.exchangeRate = game.rocket.exchangeRate.times(getAlphaUpgradeEffect("B", 3, 0));
	var up7Pow = new Decimal(0);
	up7Pow = Decimal.mul(-5, new Decimal(game.alpha.repeatUps[3]).plus(1).pow(-1/3)).plus(5);
	if (game.alpha.shards.gte(1)) game.rocket.exchangeRate = game.rocket.exchangeRate.times(game.alpha.shards.pow(up7Pow));
}
function breakdnExchangeRate() {
	var desc;
	var up1Pow = new Decimal(1.3)
	if (error.alphaUpgrades.includes("B2")) up1Pow = up1Pow.plus(Decimal.mul(0.005, game.rocket.launched));
	desc = "Exchange Rate Breakdown<br>";
	desc += "Base Rate: 250<br>";
	desc += "Upgrade 1: +" + scientific.format(Decimal.mul(75, game.rocket.upgrade[0]),2,2) + "<br>";
	desc += "Upgrade 1: x" + scientific.format(Decimal.pow(up1Pow, game.rocket.upgrade[0]), 2, 2) + "<br>";
	if (game.rocket.maxFuel.gte(100)) desc += "100+ Fuel boost: x10<br>"
	if (game.alpha.repeatUps[0] > 0) desc += "Alpha upgrade 1: x" + scientific.format(Decimal.pow(3, game.alpha.repeatUps[0]),2,2) + "<br>"
	if (game.alpha.repeatUps[1] > 0 && game.rocket.heightMax.lte(getHeight())) desc += "Alpha upgrade 2: x" + scientific.format(Decimal.pow(3, game.alpha.repeatUps[1]),2,2) + "<br>"
	var up7Pow = new Decimal(0);
	up7Pow = Decimal.mul(-5, new Decimal(game.alpha.repeatUps[3]).plus(1).pow(-1/3)).plus(5);
	if (game.alpha.repeatUps[3] > 0 && game.alpha.shards.gte(1)) desc += "Alpha upgrade 4: x" + scientific.format(game.alpha.shards.pow(up7Pow),2,2) + "<br>"
	if (getHeight().gte(2)) desc += ">2 km Height bonus: x" + scientific.format(getHeight().sub(2).times(10).pow(2).plus(1),2,2) + "<br>"
	if (getHeight().gte(4)) desc += ">4 km Height bonus: x" + scientific.format(getHeight().sub(4).times(10).pow(2).plus(1),2,2) + "<br>"
	if (error.alphaUpgrades.includes("B1")) desc += "B1 launch bonus: x" + scientific.format(getAlphaUpgradeEffect("B", 1, 0),2,2) + "<br>"
	if (error.alphaUpgrades.includes("B1")) desc += "B1 time bonus: x" + scientific.format(getAlphaUpgradeEffect("B", 1, 1),2,2) + "<br>"
	if (error.alphaUpgrades.includes("B3")) desc += "B3 bonus: x" + scientific.format(getAlphaUpgradeEffect("B", 3, 0),2,2)+"<br>";
	desc += "Total exchange rate: "+scientific.format(game.rocket.exchangeRate,2,2);
	ge("exchangeBreakdown").innerHTML = desc;
}
//Init Height Exponent
function initMaxHeight() {
	game.rocket.heightMax = Decimal.add(0.5, Decimal.mul(0.1, game.rocket.upgrade[3]));
}
//Get the fuel consumption rate
function getConsumption() {
	return Decimal.mul(0.1, Decimal.pow(0.95, game.alpha.repeatUps[2]));
}
//Init any other vars 
function initOthers() {
	game.alpha.launchMult = new Decimal(1);
	if (error.alphaUpgrades.includes("B2")) game.alpha.launchMult = game.alpha.launchMult.plus(1);
	if (error.alphaUpgrades.includes("B3")) game.alpha.launchMult = game.alpha.launchMult.plus(3);
	if (error.alphaUpgrades.includes("B1")) game.alpha.launchMult = game.alpha.launchMult.times(2);
	
}

//Saving, loading, and exporting. I stole some code from Superspruce for this.
function objectToDecimal(object) {
    for (let i in object) {
        if (typeof(object[i]) == "string" && new Decimal(object[i]) instanceof Decimal && !(new Decimal(object[i]).sign == 0 && object[i] != "0")) {
          object[i] = new Decimal(object[i]);
        }
        if (typeof(object[i]) == "object") {
            objectToDecimal(object[i]);
        }
    }
}
function merge(base, source) {
    for (let i in base) {
        if (source[i] != undefined) {
            if (typeof(base[i]) == "object" && typeof(source[i]) == "object" && !isDecimal(base[i]) && !isDecimal(source[i])) {
                merge(base[i], source[i]);
            } else {
                if (isDecimal(base[i]) && !isDecimal(source[i])) {
                    base[i] = new Decimal(source[i]);
                } else if (!isDecimal(base[i]) && isDecimal(source[i])) {
                    base[i] = source[i].toNumber();
                } else {
                    base[i] = source[i];
                }
            }
        }
    }
}
function isDecimal(x) {
    if (x.array != undefined && x.plus != undefined) {
        return true;
    } else {
        return false;
    }
}
var savegame;
function save() {
  localStorage.setItem("cosmicI", JSON.stringify(game));
  localStorage.cosmicError = btoa(JSON.stringify(error));
}
function load() {
	if (localStorage.getItem("cosmicI")) {
    savegame = JSON.parse(localStorage.getItem("cosmicI"));
    objectToDecimal(savegame);
    merge(game, savegame);

  }
  if (!localStorage.cosmicError) return;
  error = JSON.parse(atob(localStorage.cosmicError));
}
function wipeSave() {
  hardReset();
  save();
  load();
}
function hardReset() {
game = {
	money: new Decimal(0),
	rocket:{
		active:false,
		fuel: new Decimal(25),
		maxFuel: new Decimal(25),
		speed: new Decimal(0.001),
		exchangeRate: new Decimal(1000),
		coolDown: new Decimal(4),
		cdActive: false,
		upgrade: [0,0,0,0],
		cost: [new Decimal(50),new Decimal(50),new Decimal(50),new Decimal(50)],
		costMult: [1.35, 1.2, 1.3, 1.2],
		costMultInc: [0.05, 0.05, 0.1, 0.05],
		heightMax: new Decimal(1),
		launched: new Decimal(0),
		time: new Decimal(0),
	},
	alpha:{
		resets:0,
		shards: new Decimal(0),
		alphonium: new Decimal(0),
		totalAlphonium: new Decimal(0),
		upgrades:[],
		repeatUps:[0, 0, 0, 0],
		cost:[new Decimal(10), new Decimal(10), new Decimal(10), new Decimal(10)],
		costMult:[3, 3, 5, 10],
		launchMult: new Decimal(1),
		time: new Decimal(0),
		boostMac:{
			
		},
		challenges: {
			
			
		},
		assistants: {
			
			
			
		},
	},
	totalMoney:new Decimal(0),
	
}
}
function xport() {
	var tempInput = document.createElement("input");
	tempInput.style = "position: absolute; left: -1000px; top: -1000px";
	tempInput.value = btoa(JSON.stringify(game));
	document.body.appendChild(tempInput);
	tempInput.select();
	document.execCommand("copy"); 
	document.body.removeChild(tempInput); 
	alert("Save copied to clipboard. Your Alpha upgrades will not utilize this save without breaking the game, so use the other buttons for that."); 
}
function xportAlpha() {
	var tempInput = document.createElement("input");
	tempInput.style = "position: absolute; left: -1000px; top: -1000px";
	tempInput.value = btoa(JSON.stringify(error));
	document.body.appendChild(tempInput);
	tempInput.select();
	document.execCommand("copy"); 
	document.body.removeChild(tempInput); 
	alert("Alpha preset copied to clipboard. Store this alongside your main save.");
}
function mport() {
	hardReset();
	var imp = prompt("Enter save file here");
	if(imp==null) alert("That's not a valid save file.");
	savegame = JSON.parse(atob(imp));
	objectToDecimal(savegame)
	merge(game, savegame);
	save();
}
function mportAlpha() {
	error = {
		alphaUpgrades:[]
	}
	var imp = prompt("Enter Alpha preset here");
	if(imp==null) alert("That's not a valid preset.");
	savegame = JSON.parse(atob(imp));
	error = savegame;
}
load();
window.setInterval(function() {save()}, 10000);
//The main game loop
window.setInterval(function() {
	//Altways initialize, every tick, just because of Alpha upgrade changes
	initUpgrades();
	//We increase money only when the rocket is active, and refuel only when the rocket is not.
	if (game.rocket.active == true) incMoney();
	if (game.rocket.cdActive == true) refuel();
	//The upgrade code
	for (var i = 0; i < 4; i++) {
		//Displaying availability of upgrade
		if (game.money.gte(getUpgradeCost(i)) && game.rocket.active == false) ge("upgrade" + i).className = "upgradeYes";
		else ge("upgrade"+i).className = "upgradeNo";
		//Updating costs
		game.rocket.cost[i] = getUpgradeCost(i);
		ge("upgrade"+i+"Cost").innerHTML = scientific.format(getUpgradeCost(i),2,2);
		//Amount of upgrades bought
		ge("upgrade"+i+"Count").innerHTML = game.rocket.upgrade[i];
	}
	for (var i = 4; i < 8; i++) {
		if (game.alpha.shards.gte(getUpgradeCost(i)) && game.rocket.active == false) ge("upgrade" + i).className = "alphaUpYes";
		else ge("upgrade"+i).className = "upgradeNo";
		game.alpha.cost[i-4] = getUpgradeCost(i);
		ge("upgrade"+i+"Cost").innerHTML = scientific.format(game.alpha.cost[i-4],2,2);
		
		
	}
	updateCostMults();
	//Displaying current money.
	ge("money").innerHTML = scientific.format(game.money, 3, 3);
	//Stats for the rocket.
	ge("fuel").innerHTML = scientific.format(game.rocket.fuel, 3, 3);
	ge("maxFuel").innerHTML = scientific.format(game.rocket.maxFuel, 3, 3);
	ge("height").innerHTML = scientific.format(getHeight(), 3, 3);
	ge("maxHeight").innerHTML = scientific.format(game.rocket.heightMax, 3, 3);
	ge("speed").innerHTML = "Base Speed: "+scientific.format(game.rocket.speed, 3, 3)+" km/s.<br>"
	ge("exchangeRate").innerHTML = "Exchange rate: "+scientific.format(game.rocket.exchangeRate, 3, 3)+" ƞ/s/km.<br>"
	if(game.rocket.fuel.gte(game.rocket.maxFuel)) game.rocket.fuel = game.rocket.maxFuel;
	//Stat breakdowns, inspired by 4G
	breakdnExchangeRate();
	//Time increases over time, obviously.
	game.rocket.time = game.rocket.time.plus(1/30);
	
	//Showing stuff post- and during Alphatic resets.
	if (game.money.lt(Decimal.max(1e10, game.alpha.shards.pow(10)))) {
		ge("alphaResetButton").innerHTML = "Get to " + scientific.format(Decimal.max(1e10, game.alpha.shards.pow(10)),2,2)+" ƞeta to perform an αlpha reset."
	} else ge("alphaResetButton").innerHTML = "Reset your ƞeta, level, and rocket and gain " + scientific.format(getAlphaGain(),2 ,2) + " αlphonium shards";
	if (game.alpha.resets > 0) {
		ge("alphaDisplay").style.display = "";
		ge("alphaShards").innerHTML = scientific.format(game.alpha.shards, 2, 2)
		ge("alphonium").innerHTML = scientific.format(game.alpha.alphonium, 2, 2)
				ge("alphoniumConversion").style.display = "";
		if (game.alpha.shards.gte(getSmeltingCost())) {
			ge("alphoniumConversion").className = "alphaUpYes";
		} else ge("alphoniumConversion").className = "upgradeNo";
		ge("alphoniumCost").innerHTML = scientific.format(getSmeltingCost(), 2, 2);
	}
	for (var i = 4; i < 7; i++) {
		alphaUpgradeView("A", i)
	}
	for (var i = 1; i < 8; i++) {
		alphaUpgradeView("B", i)
	}
	for (var i = 4; i < 7; i++) {
		alphaUpgradeView("C", i)
	}
	for (var i = 4; i < 7; i++) {
		alphaUpgradeView("D", i)
	}
	for (var i = 1; i < 9; i++) {
		alphaUpgradeView("E", i)
	}
	for (var i = 4; i < 7; i++) {
		alphaUpgradeView("F", i)
	}
	for (var i = 4; i < 7; i++) {
		alphaUpgradeView("G", i)
	}
	for (var i = 1; i < 8; i++) {
		alphaUpgradeView("H", i)
	}
	for (var i = 4; i < 7; i++) {
		alphaUpgradeView("I", i)
	}
	
}, 33);
