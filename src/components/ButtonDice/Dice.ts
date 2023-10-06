import DiceBox from "@3d-dice/dice-box";

const Dice = new DiceBox("#diceContainer", {
		id: "canvas-dice",
		assetPath: "/assets/dice-box/",
		themeColor: "#336699",
    offscreen: false,
	});

export { Dice }
