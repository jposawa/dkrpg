import DiceBox from "@3d-dice/dice-box";

// Doing this because this module doesn't have types and I'm still migrating it into this project
const Dice = new (DiceBox as any)("#diceContainer", {
		id: "canvas-dice",
		assetPath: "/assets/dice-box/",
		themeColor: "#336699",
    offscreen: false,
	});

export { Dice }
