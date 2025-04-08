// Handle player movement with WASD or arrow keys
if (this.cursors.left.isDown || this.wasd.left.isDown) {
    this.player.setVelocityX(-this.movementSpeed);
  } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
    this.player.setVelocityX(this.movementSpeed);
  } else {
    this.player.setVelocityX(0);
  }

  // Jump with up arrow or W key
  if (
    (this.cursors.up.isDown || this.wasd.up.isDown) &&
    this.jumpCount < this.maxJumps
  ) {
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.up)
    ) {
      this.handleJump();
    }
  }