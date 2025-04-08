// Create the player's cube as a 30x30 black square.
this.add.graphics()
.fillStyle(0x000000, 1)
.fillRect(0, 0, 30, 30)
.generateTexture('playerCube', 30, 30);

// Create a spike obstacle (black triangle) for hazards.
let spikeGraphics = this.add.graphics();
spikeGraphics.fillStyle(0xff0000, 1);
spikeGraphics.beginPath();
spikeGraphics.moveTo(0, 30);
spikeGraphics.lineTo(15, 0);
spikeGraphics.lineTo(30, 30);
spikeGraphics.closePath();
spikeGraphics.fillPath();
spikeGraphics.generateTexture('spike', 30, 30);


// Create a platform texture as a black rectangle 80x30.
this.add.graphics()
.fillStyle(0x000000, 1)
.fillRect(0, 0, 80, 30)
.generateTexture('platform', 80, 30);

// Create a platform extension texture (black rectangle that extends down)
this.add.graphics()
.fillStyle(0x000000, 1)
.fillRect(0, 0, 80, 600)
.generateTexture('platformExtension', 80, 600);