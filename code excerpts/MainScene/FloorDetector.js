this.floorDetector = this.add.zone(0, 590, 1000000, 10);
    this.physics.world.enable(
      this.floorDetector,
      Phaser.Physics.Arcade.STATIC_BODY
    );
    this.physics.add.overlap(
      this.player,
      this.floorDetector,
      this.gameOver,
      null,
      this
    );