// Position spike below the platform initially
let spike = this.spikes.create(x, y + this.CUBE_SIZE, 'spike');
spike.setTint(0x000000);
spike.body.allowGravity = false;
spike.setImmovable(true);
spike.setActive(false); // Inactive (no collision) when below platform

// Define the animation loop function
const animateSpike = () => {
  this.tweens.add({
    targets: spike,
    y: y, // Emerge to the surface
    duration: 500, // 0.5 seconds to rise
    ease: 'Linear',
    onComplete: () => {
      spike.setActive(true); // Enable collision when fully emerged
      this.time.delayedCall(5000, () => { // Stay for 5 seconds
        this.tweens.add({
          targets: spike,
          y: y + this.CUBE_SIZE, // Retract below platform
          duration: 500, // 0.5 seconds to retract
          ease: 'Linear',
          onComplete: () => {
            spike.setActive(false); // Disable collision when retracted
            this.time.delayedCall(2000, animateSpike); // Wait 2 seconds, then repeat
          }
        });
      });
    }
  });
};

// Start the animation
animateSpike();