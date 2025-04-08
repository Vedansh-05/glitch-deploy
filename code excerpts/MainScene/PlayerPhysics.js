// Set up player physics
this.player.setCollideWorldBounds(true);
this.player.body.setGravityY(GAME_CONSTANTS.GRAVITY);
this.player.body.setSize(this.CUBE_SIZE, this.CUBE_SIZE);
this.player.body.setOffset(0, 0);