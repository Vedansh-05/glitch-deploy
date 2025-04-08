import { Game } from "phaser";
import MainScene  from "./scenes/MainScene";
import StartScene from "./scenes/StartScene";

// More information about config: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  width: 1280,
  height: 740,
  backgroundColor: "#808080",
  title: "squbeproj",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [ StartScene, MainScene],
};

new Game(config);
