class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.obtainedScore = data.score || 0;
  }

  create() {
    const { width, height } = this.scale;

    // 🔲 Background Box (UI)
    const box = this.add.graphics();
    box.fillStyle(0x222222, 1);
    box.fillRoundedRect(width / 2 - 200, height / 2 - 100, 400, 200, 10);

    // 🎮 "GAME OVER" Text
    this.add.text(width / 2, height / 2 - 70, "GAME OVER", {
      fontSize: "36px",
      fill: "#ffffff",
      fontFamily: "Arial Black"
    }).setOrigin(0.5);

    //  Display Obtained Score
    this.add.text(width / 2, height / 2 - 20, `Score: ${this.obtainedScore.toFixed(1)}m`, {
      fontSize: "24px",
      fill: "#ffff00",
      fontFamily: "Arial",
      stroke: "#000000",
      strokeThickness: 3
    }).setOrigin(0.5);

    //  "Play Again" Button (Centered)
    this.createButton(width / 2, height / 2 + 50, "Play Again", () => {
      this.scene.start("StartScene");
    });
  }

  createButton(x, y, label, callback) {
    const button = this.add.text(x, y, label, {
      fontSize: "22px",
      fill: "#ffffff",
      fontFamily: "Arial",
      backgroundColor: "#333333",
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);

    button.setInteractive({ useHandCursor: true })
      .on("pointerdown", callback)
      .on("pointerover", () => button.setBackgroundColor("#555555"))
      .on("pointerout", () => button.setBackgroundColor("#333333"));
  }
}
