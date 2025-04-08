// Set a fixed height for all spotlights
const spotlightY = 200;

  
const spotlight = this.add.rectangle(x, spotlightY, 50, 50, 0x000000);
this.physics.add.existing(spotlight, false);
spotlight.body.setAllowGravity(false);
spotlight.body.setVelocityX(-125);
spotlight.body.setCollideWorldBounds(false);
const aheadX=this.player.x+800
// Create the diverging beam of light (triangle)
const beam = this.add.graphics();
beam.fillStyle(0xffff00, 0.2); // Yellow light with 20% opacity

// Define the beam's triangular collision area
const beamTriangle = new Phaser.Geom.Triangle();

// Function to update beam graphics and triangle points
const updateBeam = () => {
  beam.clear();
  beam.fillStyle(0xffff00, 0.2);
  beam.beginPath();
  beam.moveTo(spotlight.x, spotlightY + 25);
  beam.lineTo(spotlight.x - 350, spotlightY + 400);
  beam.lineTo(spotlight.x + 150, spotlightY + 400);
  beam.closePath();
  beam.fill();

  beamTriangle.setTo(
    spotlight.x, spotlightY + 25,           // Top
    spotlight.x - 350, spotlightY + 400,   // Bottom-left
    spotlight.x + 150, spotlightY + 400    // Bottom-right
  );
};

updateBeam(); // Initial draw

// Store beam and triangle references
spotlight.beam = beam;
spotlight.beamTriangle = beamTriangle;

// Check for overlap and update beam position every frame
const overlapTimer = this.time.addEvent({
  delay: 16,
  callback: () => {
    updateBeam(); // Update beam and triangle to follow spotlight
    if (
      Phaser.Geom.Triangle.ContainsPoint(
        beamTriangle,
        new Phaser.Geom.Point(this.player.x, this.player.y)
      )
    ) {
      if (!this.isHiding) {
        this.gameOver();
      }
    }
  },
  loop: true,
});

spotlight.overlapTimer = overlapTimer;

// Destroy the spotlight and beam when they move off-screen
this.time.addEvent({
  delay: 10000,
  callback: () => {
    if (spotlight.overlapTimer) {
      spotlight.overlapTimer.remove();
    }
    spotlight.destroy();
    beam.destroy();
  },
});