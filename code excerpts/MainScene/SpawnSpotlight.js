const aheadX = this.player.x + 800;
// Randomly decide whether to spawn a spotlight or not
      if (Phaser.Math.Between(0, 1) === 0) {
      this.spawnSpotlightAt(aheadX, Phaser.Math.Between(100, 500));
    } 