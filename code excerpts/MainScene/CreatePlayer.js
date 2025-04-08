// Get the first platform to position the player
let firstPlatform = this.platforms.getChildren()[0];

// Create the player cube with proper physics body
this.player = this.physics.add.sprite(
  400, // Position player in the middle of the screen
  firstPlatform.y - this.PLATFORM_HEIGHT / 2 - this.CUBE_SIZE / 2,
  "playerCube"
);