// Remove off-screen obstacles.
this.spikes.getChildren().forEach((spike) => {
    if (spike.x < this.player.x - 800) spike.destroy();
  });
  this.spotlights.getChildren().forEach((light) => {
    if (light.x < this.player.x - 800) light.destroy();
  });

  // Clean up off-screen platform extensions
  this.platformExtensions.getChildren().forEach((extension) => {
    if (extension.x < this.player.x - 800) extension.destroy();
  });