getNextPlatformY(prevY) {
    // Calculate height difference (at most one cube height up or down)
    let heightDiff = Phaser.Math.Between(-this.CUBE_SIZE, this.CUBE_SIZE);

    // Make sure platforms don't vary too wildly
    if (heightDiff > 0) heightDiff = this.CUBE_SIZE;
    if (heightDiff < 0) heightDiff = -this.CUBE_SIZE;

    // Make sure the new platform is within acceptable bounds
    let minY = this.BASE_PLATFORM_Y - this.CUBE_SIZE * 4; // Allow up to 4 cubes height from base
    let maxY = this.BASE_PLATFORM_Y;

    return Phaser.Math.Clamp(prevY + heightDiff, minY, maxY);
  }

  createPlatformExtension(x, y) {
    // Calculate the Y position for the extension (from platform bottom to screen bottom)
    const extensionHeight = 600 - y - this.PLATFORM_HEIGHT / 2;
    const extensionY = y + this.PLATFORM_HEIGHT / 2 + extensionHeight / 2;

    // Create an extension sprite with the correct height
    const extension = this.platformExtensions.create(
      x,
      extensionY,
      "platformExtension"
    );

    // Scale the extension to the correct height
    extension.setDisplaySize(this.PLATFORM_WIDTH, extensionHeight);

    // Set the depth to be behind the platforms but visible
    extension.setDepth(-1);

    return extension;
  }

  generateMorePlatforms() {
    let rightmostX = -Infinity;
    let rightmostPlatform = null;

    this.platforms.getChildren().forEach((platform) => {
      if (platform.x > rightmostX) {
        rightmostX = platform.x;
        rightmostPlatform = platform;
      }
    });

    if (this.player.x > rightmostX - 600) {
      // Changed from 800 to 600
      let currentX = rightmostX + this.PLATFORM_WIDTH;
      let currentY = rightmostPlatform
        ? rightmostPlatform.y
        : this.BASE_PLATFORM_Y;

      // Generate fewer platforms at a time but more frequently
      for (let i = 0; i < 3; i++) {
        // Changed from 5 to 3
        currentY = this.getNextPlatformY(currentY);

        let platform = this.platforms.create(
          currentX + this.PLATFORM_WIDTH / 2,
          currentY + this.PLATFORM_HEIGHT / 2,
          "platform"
        );

        platform.body.setSize(this.PLATFORM_WIDTH, this.PLATFORM_HEIGHT);
        platform.body.setOffset(0, 0);
        platform.refreshBody();

        this.createPlatformExtension(
          currentX + this.PLATFORM_WIDTH / 2,
          currentY + this.PLATFORM_HEIGHT / 2
        );

        currentX += this.PLATFORM_WIDTH;

        if (Phaser.Math.Between(0, 10) === 0) {
          this.spawnSpikeAt(
            platform.x,
            platform.y - this.PLATFORM_HEIGHT / 2 - this.CUBE_SIZE / 2
          );
        }
      }
    }
  }