this.physics.add.collider(
      this.player,
      this.platforms,
      () => {
        this.jumpCount = 0;
        this.player.angle = 0; // Reset roll when landed.
      },
      null,
      this
    );