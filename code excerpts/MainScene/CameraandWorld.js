const WORLD_WIDTH = 1000000; // 10,000 meters (1 million pixels)
this.physics.world.setBounds(0, 0, WORLD_WIDTH, 600);
this.cameras.main.setBounds(0, 0, WORLD_WIDTH, 600);
this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
this.cameras.main.setFollowOffset(-200, 0);