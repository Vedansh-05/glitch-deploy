let numSegments = Math.ceil(800 / this.PLATFORM_WIDTH) + 10; // Initial segments
  let currentX = 0;
  let currentY = this.BASE_PLATFORM_Y;

  for (let i = 0; i < numSegments; i++) {
    // Only allow gaps after 10 meters (1000 pixels)
    if (currentX > 1000 && Phaser.Math.Between(0, 10) < 2) {
      currentX += this.PLATFORM_WIDTH; // Skip this segment to create a gap
      continue;
    }

    let platform = this.platforms.create(
      currentX + (this.PLATFORM_WIDTH / 2),
      currentY + (this.PLATFORM_HEIGHT / 2),
      'platform'
    );
    platform.body.setSize(this.PLATFORM_WIDTH, this.PLATFORM_HEIGHT);
    platform.body.setOffset(0, 0);
    platform.refreshBody();

    this.createPlatformExtension(currentX + (this.PLATFORM_WIDTH / 2), currentY + (this.PLATFORM_HEIGHT / 2));

    currentX += this.PLATFORM_WIDTH;

    if (i > 3) {
      currentY = this.getNextPlatformY(currentY);
    }
  }