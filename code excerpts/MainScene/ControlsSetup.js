// Set up keyboard controls
this.cursors = this.input.keyboard.createCursorKeys();
this.wasd = this.input.keyboard.addKeys({
  up: Phaser.Input.Keyboard.KeyCodes.W,
  down: Phaser.Input.Keyboard.KeyCodes.S,
  left: Phaser.Input.Keyboard.KeyCodes.A,
  right: Phaser.Input.Keyboard.KeyCodes.D,
});

// Set up jump variables.
this.jumpCount = 0;
this.maxJumps = 1;

// Input for jump: UP, W, or SPACE
this.input.keyboard.on("keydown-SPACE", this.handleJump, this);