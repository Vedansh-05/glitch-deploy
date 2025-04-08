// Get player color before we change it (for the blast effect)
const playerColor = this.player.tintTopLeft || 0xffffff;
  
// Create the blast effect at player position
this.createBlastEffect(this.player.x, this.player.y, playerColor);

// Hide the player immediately
this.player.setVisible(false);

// Stop all timers and events
this.time.removeAllEvents(); // Stops all active timers
this.physics.pause(); // Pause all physics bodies
this.input.keyboard.enabled = false; // Disable player controls

// Wait a short moment to see the blast before showing game over UI
this.time.delayedCall(500, () => {
  // Center elements
  const { width, height } = this.cameras.main;
  const centerX = this.cameras.main.scrollX + width / 2;
  const centerY = height / 2;

  // Box dimensions
  const boxWidth = 400; // Increased width
  const boxHeight = 220;
  const box = this.add.graphics();
  box.fillStyle(0x000000, 0.7); // Black box with 70% opacity
  box.fillRoundedRect(
    centerX - boxWidth / 2,
    centerY - boxHeight / 2,
    boxWidth,
    boxHeight,
    20
  );

  // Game Over Text
  this.add
    .text(centerX, centerY - 70, "Game Over", {
      fontSize: "42px",
      fill: "#ff0000",
      fontFamily: "Arial",
      fontWeight: "bold",
    })
    .setOrigin(0.5);

  // Score Text (truncated to integer)
  this.add
    .text(centerX, centerY - 20, `Your Score: ${Math.floor(this.score)}`, {
      fontSize: "30px",
      fill: "#ffffff",
      fontFamily: "Arial",
    })
    .setOrigin(0.5);

  // Restart Button
  const button = this.add
    .text(centerX, centerY + 40, "Restart", {
      fontSize: "26px",
      backgroundColor: "#ffffff",
      padding: { x: 20, y: 12 },
      color: "#000000",
      fontFamily: "Arial",
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => {
      // Reset input and physics before restarting
      this.input.keyboard.enabled = true;
      this.physics.resume();
      this.scene.start("StartScene"); // Restart the game properly
    })
    .on("pointerover", () => button.setStyle({ backgroundColor: "#ddd" }))
    .on("pointerout", () => button.setStyle({ backgroundColor: "#ffffff" }));
});