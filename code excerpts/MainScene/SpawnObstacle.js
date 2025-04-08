// Spawn obstacles ahead of the player
const aheadX = this.player.x + 800;

// Randomly decide whether to spawn a spike or not
if (Phaser.Math.Between(0, 1) === 0) {
  // Find a platform in the area ahead to place a spike on
  let targetPlatform = null;
  this.platforms.getChildren().forEach((platform) => {
    if (Math.abs(platform.x - aheadX) < 200) {
      targetPlatform = platform;
    }
  });

  if (targetPlatform) {
    this.spawnSpikeAt(
      targetPlatform.x,
      targetPlatform.y - this.PLATFORM_HEIGHT / 2 - this.CUBE_SIZE / 2
    );
  }
} 