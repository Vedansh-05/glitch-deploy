this.isHiding = false; // Reset hiding state by default

  // Ensure the player is touching a platform (bottom contact)
  if (!this.player.body.touching.down && !this.player.body.blocked.down) {
    return; // No hiding if not on a platform
  }

  // Use player's actual width instead of assuming CUBE_SIZE
  const playerWidth = this.player.width || this.CUBE_SIZE; // Fallback to CUBE_SIZE if width isn't set
  const edgeWidth = 40; // Small width for edge detection
  const edgeHeight = this.CUBE_SIZE;

  // Left edge sensor (aligned to the leftmost edge of the player)
  const leftEdgeSensor = this.physics.add
    .sprite(
      this.player.x - playerWidth / 2, // Left edge of player
      this.player.y,
      null // No visible sprite
    )
    .setSize(edgeWidth, edgeHeight)
    .setVisible(false);

  // Right edge sensor (aligned to the rightmost edge of the player)
  const rightEdgeSensor = this.physics.add
    .sprite(
      this.player.x + playerWidth / 2, // Right edge of player
      this.player.y,
      null // No visible sprite
    )
    .setSize(edgeWidth, edgeHeight)
    .setVisible(false);

  // Check collisions with platforms
  let leftEdgeContact = false;
  let rightEdgeContact = false;

  this.physics.world.overlap(
    leftEdgeSensor,
    this.platforms,
    () => {
      leftEdgeContact = true;
    },
    null,
    this
  );

  this.physics.world.overlap(
    rightEdgeSensor,
    this.platforms,
    () => {
      rightEdgeContact = true;
    },
    null,
    this
  );

  // Set hiding state if either edge is in contact
  if (leftEdgeContact || rightEdgeContact) {
    this.isHiding = true;
  }

  // Debug log to verify sensor positions and contact
  console.log({
    isHiding: this.isHiding,
    leftEdgeX: leftEdgeSensor.x,
    rightEdgeX: rightEdgeSensor.x,
    leftContact: leftEdgeContact,
    rightContact: rightEdgeContact,
    playerX: this.player.x,
    playerWidth: playerWidth
  });

  // Clean up sensors
  leftEdgeSensor.destroy();
  rightEdgeSensor.destroy();