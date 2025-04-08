// Create groups for obstacles.
this.spikes = this.physics.add.group();
this.spotlights = this.physics.add.group();

// Collision: player vs spikes.
this.physics.add.overlap(
  this.player,
  this.spikes,
  this.gameOver,
  null,
  this
);

// Collision: player vs spotlights (only game over if not hiding).
this.physics.add.overlap(
  this.player,
  this.spotlights,
  (player, spotlight) => {
    if (!this.isHiding) {
      this.gameOver();
    }
  },
  null,
  this
);

// Spawn spikes periodically
this.time.addEvent({
  delay: 5000,
  callback: this.spawnObstacle,
  callbackScope: this,
  loop: true,
});

// Spawn spotlight periodically
this.time.addEvent({
  delay: 7500,
  callback: this.spawnSpotlight,
  callbackScope: this,
  loop: true,
});