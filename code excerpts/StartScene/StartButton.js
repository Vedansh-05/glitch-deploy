const startButton = this.add.text(400, 350, 'START GAME', { 
    fontSize: '32px', 
    fill: '#fff',
    backgroundColor: '#000000',
    padding: { x: 20, y: 10 }
  }).setOrigin(0.5)
  .setInteractive({ useHandCursor: true })
  .on('pointerdown', () => {
    this.scene.start('');
    // this.scene.start('MainScene');
  });