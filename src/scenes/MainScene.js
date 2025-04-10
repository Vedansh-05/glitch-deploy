import { Scene } from "phaser";
import GAME_CONSTANTS from "../assets";
import Phaser from "phaser";

class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");

    // Initialize class properties
    this.player = null;
    this.platforms = null;
    this.platformExtensions = null;
    this.spikes = null;
    this.spotlights = null;
    this.cursors = null;
    this.wasd = null;
    this.scoreText = null;
    this.distanceText = null;
    this.controlsText = null;
    this.floorDetector = null;

    // Game state variables
    this.score = 0;
    this.jumpCount = 0;
    this.maxJumps = 2;
    this.isHiding = false;
  }

  create() {
    // Set the background color (grey).
    this.cameras.main.setBackgroundColor("#808080");

    // Initialize game variables
    this.score = 0;
    this.movementSpeed = GAME_CONSTANTS.PLAYER_MOVEMENT_SPEED;

    // Set up UI elements
    this.createUIElements();

    // Define constants for sizing and positioning
    this.CUBE_SIZE = GAME_CONSTANTS.CUBE_SIZE;
    this.PLATFORM_WIDTH = GAME_CONSTANTS.PLATFORM_WIDTH;
    this.PLATFORM_HEIGHT = GAME_CONSTANTS.PLATFORM_HEIGHT;
    this.BASE_PLATFORM_Y = GAME_CONSTANTS.BASE_PLATFORM_Y;

    // Create a container for the platform extensions (visual only, no physics)
    this.platformExtensions = this.add.group();

    // Create the platforms as a static group.
    this.platforms = this.physics.add.staticGroup();

    // Call our spawn method to create initial platforms
    this.spawnPlatforms();

    // Create the player and set up physics
    this.createPlayer();

    // Set up controls
    this.setupControls();

    // Create groups for obstacles.
    this.setupObstacles();

    // Set up camera and world bounds
    this.setupCameraAndWorld();
    this.setupTrailEffect();

    // Set up a floor collision detector at the bottom of the screen
    this.setupFloorDetector();

    this.physics.add.collider(this.player, this.spikes, (player, spike) => {
      if (spike.active) {
        // Only if the spike is active (risen)
        this.gameOver(); // This will now include the blast effect
      }
    });
  }

  createUIElements() {
    //Add UI elements here
    this.controlsText = this.add
      .text(400, 10, "Controls: WASD or Arrow Keys", {
        fontSize: "16px",
        fill: "#fff",
      })
      .setOrigin(0.5, 0);

    // Add distance counter in top right
    this.distanceText = this.add
      .text(770, 50, "DISTANCE\n0.0m", {
        fontSize: "20px",
        fill: "#fff",
        align: "right",
      })
      .setOrigin(1, 0);
  }
  setupCameraAndWorld() {
    //Add the camera and world bounds
    const WORLD_WIDTH = 1000000; // 10,000 meters (1 million pixels)
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, 600);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, 600);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setFollowOffset(-200, 0);
  }

  createPlayer() {
    // Create the player cube
    // Get the first platform to position the player
    let firstPlatform = this.platforms.getChildren()[0];

    // Create the player cube with proper physics body
    this.player = this.physics.add.sprite(
      400, // Position player in the middle of the screen
      firstPlatform.y - this.PLATFORM_HEIGHT / 2 - this.CUBE_SIZE / 2,
      "playerCube"
    );

    // Set up player physics
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(GAME_CONSTANTS.GRAVITY);
    this.player.body.setSize(this.CUBE_SIZE, this.CUBE_SIZE);
    this.player.body.setOffset(0, 0);

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
  }

  setupControls() {
    //Add the controls logic here
    // Set up keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Set up jump variables.
    this.jumpCount = 0;
    this.maxJumps = 1;

    // Input for jump: UP, W, or SPACE
    this.input.keyboard.on("keydown-SPACE", this.handleJump, this);
  }

  handlePlayerControls() {
    // Add the logic for handling player controls
    // Handle player movement with WASD or arrow keys
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.player.setVelocityX(-this.movementSpeed);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.player.setVelocityX(this.movementSpeed);
    } else {
      this.player.setVelocityX(0);
    }

    // Jump with up arrow or W key
    if (
      (this.cursors.up.isDown || this.wasd.up.isDown) &&
      this.jumpCount < this.maxJumps
    ) {
      if (
        Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
        Phaser.Input.Keyboard.JustDown(this.wasd.up)
      ) {
        this.handleJump();
      }
    }
  }

  setupObstacles() {
    //Add the logic for obstacle setup here
    // Create groups for obstacles.
    this.spikes = this.physics.add.group();
    this.spotlights = this.physics.add.group();

    // Collision: player vs spikes.
    this.physics.add.overlap(
      this.player,
      this.spikes,
      this.gameOver,
      null,
      this
    );

    // Collision: player vs spotlights (only game over if not hiding).
    this.physics.add.overlap(
      this.player,
      this.spotlights,
      (player, spotlight) => {
        if (!this.isHiding) {
          this.gameOver();
        }
      },
      null,
      this
    );

    // Spawn spikes periodically
    this.time.addEvent({
      delay: 5000,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    });

    // Spawn spotlight periodically
    this.time.addEvent({
      delay: 7500,
      callback: this.spawnSpotlight,
      callbackScope: this,
      loop: true,
    });
  }

  setupFloorDetector() {
    //Add the floor detector logic here
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
  }

  update(time, delta) {
    // Calculate distance in meters
    var disp = 0;
    const displacementInMeters = (this.player.x / 100).toFixed(1);
    if (disp < displacementInMeters) {
      disp = displacementInMeters;
    }
    // Increase score based on displacement
    this.score = Math.floor(disp * 2);

    // Update UI elements (change "DISTANCE" to "DISPLACEMENT" for clarity)
    // this.scoreText.setText("Score: " + this.score);
    this.distanceText.setText(`DISPLACEMENT\n${disp}m`);
    this.distanceText.x = this.cameras.main.scrollX + 770;

    // Handle player controls
    this.handlePlayerControls();

    // Remove off-screen objects
    this.cleanupOffscreenObjects();

    // Check if the player is "hiding" on a platform.
    this.checkPlayerHiding();

    // If the player is in the air, roll the cube.
    this.applyPlayerRoll(delta);

    // Keep the controls text with the camera
    this.controlsText.x = this.cameras.main.scrollX + 400;

    // Generate more platforms as the player moves right
    this.generateMorePlatforms();

    // Update floor detector position to follow camera
    this.floorDetector.x = this.cameras.main.scrollX;
    // Add this to your update function to detect falls
    if (this.player.y > this.game.config.height + 100) {
      // 100px buffer below screen
      this.gameOver();
    }
  }

  cleanupOffscreenObjects() {
    // Add the logic for cleaning up off-screen objects here
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
  }

  checkPlayerHiding() {
    //Add the logic for hiding of the player from the spotlight here
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
      playerWidth: playerWidth,
    });

    // Clean up sensors
    leftEdgeSensor.destroy();
    rightEdgeSensor.destroy();
  }

  applyPlayerRoll(delta) {
    if (!this.player.body.touching.down && !this.player.body.blocked.down) {
      this.player.angle += (2.5 * delta) / 16; // Adjust roll speed as needed.
    }
  }

  handleJump() {
    if (this.jumpCount < this.maxJumps) {
      this.player.setVelocityY(GAME_CONSTANTS.JUMP_VELOCITY);
      this.jumpCount++;
    }
  }

  //ADD GeneratePlatforms.js functions here after handleJump()
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

  spawnPlatforms() {
    //Add the spawning platforms part here
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

      if (i > 3) {
        currentY = this.getNextPlatformY(currentY);
      }
    }
  }

  spawnObstacle() {
    //Add the logic for spawning spotlight ahead of the player here
    // Spawn obstacles ahead of the player
    const aheadX = this.player.x + 800;

    // Randomly decide whether to spawn a spike or not
    if (Phaser.Math.Between(0, 1) === 0) {
      // Find a platform in the area ahead to place a spike on
      let targetPlatform = null;
      this.platforms.getChildren().forEach((platform) => {
        if (Math.abs(platform.x - aheadX) < 200) {
          targetPlatform = platform;
        }
      });

      if (targetPlatform) {
        this.spawnSpikeAt(
          targetPlatform.x,
          targetPlatform.y - this.PLATFORM_HEIGHT / 2 - this.CUBE_SIZE / 2
        );
      }
    }
  }

  spawnSpotlight() {
    //Add the logic for spawning spotlight ahead of the player here
    // Randomly decide whether to spawn a spotlight or not
    const aheadX = this.player.x + 800;
    // Randomly decide whether to spawn a spotlight or not
    if (Phaser.Math.Between(0, 1) === 0) {
      this.spawnSpotlightAt(aheadX, Phaser.Math.Between(100, 500));
    }
  }

  spawnSpikeAt(x, y) {
    // Add the logic for spawning spikes here
    // Position spike below the platform initially
    let spike = this.spikes.create(x, y + this.CUBE_SIZE, "spike");
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
        ease: "Linear",
        onComplete: () => {
          spike.setActive(true); // Enable collision when fully emerged
          this.time.delayedCall(5000, () => {
            // Stay for 5 seconds
            this.tweens.add({
              targets: spike,
              y: y + this.CUBE_SIZE, // Retract below platform
              duration: 500, // 0.5 seconds to retract
              ease: "Linear",
              onComplete: () => {
                spike.setActive(false); // Disable collision when retracted
                this.time.delayedCall(2000, animateSpike); // Wait 2 seconds, then repeat
              },
            });
          });
        },
      });
    };

    // Start the animation
    animateSpike();
  }

  spawnSpotlightAt(x, y) {
    //Add the logic for spawning spotlight here
    // Set a fixed height for all spotlights
    const spotlightY = 200;

    const spotlight = this.add.rectangle(x, spotlightY, 50, 50, 0x000000);
    this.physics.add.existing(spotlight, false);
    spotlight.body.setAllowGravity(false);
    spotlight.body.setVelocityX(-125);
    spotlight.body.setCollideWorldBounds(false);
    const aheadX = this.player.x + 800;
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
        spotlight.x,
        spotlightY + 25, // Top
        spotlight.x - 350,
        spotlightY + 400, // Bottom-left
        spotlight.x + 150,
        spotlightY + 400 // Bottom-right
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
  }

  createBlastEffect(x, y, color = 0xffffff) {
    // Create the particle emitter directly at position (x, y)
    const emitter = this.add.particles(x, y, "pixel", {
      speed: { min: 100, max: 200 }, // Particle speed range
      angle: { min: 0, max: 360 }, // Emit in all directions
      scale: { start: 0.5, end: 0 }, // Shrink particles over time
      blendMode: "ADD", // Additive blending for a glowing effect
      lifespan: 800, // Particle lifetime in milliseconds
      gravityY: 300, // Downward gravity
      frequency: 20, // Emit every 20ms
      tint: color, // Apply the specified color
      maxParticles: 40, // Limit the number of particles
    });

    // Start the emitter immediately
    emitter.start();

    // Create small square fragments
    for (let i = 0; i < 12; i++) {
      const fragment = this.add.rectangle(
        x + Phaser.Math.Between(-5, 5), // Random offset from center
        y + Phaser.Math.Between(-5, 5),
        Phaser.Math.Between(5, 10), // Random width
        Phaser.Math.Between(5, 10), // Random height
        color // Match particle color
      );

      // Add physics to the fragment
      this.physics.add.existing(fragment);
      fragment.body.setVelocity(
        Phaser.Math.Between(-200, 200), // Random horizontal velocity
        Phaser.Math.Between(-300, -100) // Upward velocity with variation
      );

      // Rotate the fragment
      this.tweens.add({
        targets: fragment,
        angle: Phaser.Math.Between(-360, 360),
        duration: Phaser.Math.Between(800, 1500),
        ease: "Power1",
      });

      // Fade out and destroy the fragment
      this.tweens.add({
        targets: fragment,
        alpha: 0,
        delay: Phaser.Math.Between(300, 600),
        duration: 300,
        onComplete: () => {
          fragment.destroy();
        },
      });
    }

    // Stop the emitter after 200ms
    this.time.delayedCall(200, () => {
      emitter.stop();
    });

    // Destroy the emitter after 1000ms
    this.time.delayedCall(1000, () => {
      emitter.destroy();
    });
  }
  // Add all these methods to your game class (the class that extends Phaser.Scene)

  // STEP 1: Add to your create() method
  setupTrailEffect() {
    // Create a group to hold all trail elements
    this.trailGroup = this.add.group();

    // Configure the trail parameters
    this.trailConfig = {
      enabled: true,
      frequency: 3, // Create a trail element every X frames
      fadeTime: 300, // How long it takes for trail elements to fade (ms)
      maxTrailLength: 10, // Maximum number of trail elements
      alpha: 0.7, // Starting alpha for trail elements
      tint: this.player.tintTopLeft || 0xffffff, // Match player color
      frameCounter: 0, // Counter to manage creation frequency
    };

    // Set up the trail update to run on each frame
    this.events.on("update", this.updateTrail, this);
  }

  // STEP 2: Add this method to your game class
  updateTrail() {
    // Only create trail when player is moving and in the air
    if (
      !this.trailConfig.enabled ||
      !this.player ||
      !this.player.visible ||
      this.player.body.velocity.y === 0
    ) {
      // Only when in the air (jumping)
      return;
    }

    // Control creation frequency
    this.trailConfig.frameCounter++;
    if (this.trailConfig.frameCounter < this.trailConfig.frequency) {
      return;
    }
    this.trailConfig.frameCounter = 0;

    // Create a stylized trail element instead of a simple rectangle
    const trailElement = this.createStylizedTrailElement();

    // Add to the trail group
    this.trailGroup.add(trailElement);

    // Limit the trail length

    // Fade out the trail element
    this.tweens.add({
      targets: trailElement,
      alpha: 0,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: this.trailConfig.fadeTime,
      onComplete: () => {
        trailElement.destroy();
      },
    });
  }

  // STEP 3: Add this method for creating stylized trail elements
  createStylizedTrailElement() {
    // Get player properties
    const x = this.player.x;
    const y = this.player.y;
    const width = this.player.width;
    const height = this.player.height;

    // Create a gradient or patterned trail instead of a solid one
    const trailElement = this.add.graphics();

    // Choose between different styles
    const style = Phaser.Math.Between(1, 3);

    if (style === 1) {
      // Style 1: Glowing outline
      trailElement.lineStyle(2, this.trailConfig.tint, this.trailConfig.alpha);
      trailElement.strokeRect(-width / 2, -height / 2, width, height);
    } else if (style === 2) {
      // Style 2: Fade from inside to outside
      trailElement.fillGradientStyle(
        this.trailConfig.tint,
        this.trailConfig.tint,
        this.trailConfig.tint,
        this.trailConfig.tint,
        this.trailConfig.alpha,
        this.trailConfig.alpha,
        0,
        0
      );
      trailElement.fillRect(-width / 2, -height / 2, width, height);
    } else {
      // Style 3: Simple filled rectangle (similar to original)
      trailElement.fillStyle(this.trailConfig.tint, this.trailConfig.alpha);
      trailElement.fillRect(-width / 2, -height / 2, width, height);
    }

    // Position the graphic
    trailElement.x = x;
    trailElement.y = y;
    trailElement.rotation = this.player.rotation;

    return trailElement;
  }

  // STEP 4: Add this method to toggle the trail effect
  toggleTrailEffect(enabled = true) {
    this.trailConfig.enabled = enabled;

    // Clear existing trail elements if disabled
    if (!enabled) {
      this.trailGroup.clear(true, true);
    }
  }
  gameOver() {
    //add gameover code
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
        .on("pointerout", () =>
          button.setStyle({ backgroundColor: "#ffffff" })
        );
    });
  }
}

export default MainScene;
