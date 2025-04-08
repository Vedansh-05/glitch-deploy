const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#808080',
  title: "squbeproj",
  physics: {
    default: 'arcade',
    arcade: { 
      gravity: { y: 0 }, 
      debug: false
    }
  },
  scene: [StartScene,MainScene,GameOverScene]
};

const game = new Phaser.Game(config);