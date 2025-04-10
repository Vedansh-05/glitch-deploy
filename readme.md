# Glitch-and-Go

Welcome to **Glitch-and-Go**, a hands-on workshop repository designed to teach Phaser game development. This project includes both complete source files and modular code excerpts to help you understand and experiment with different parts of the game.

## Project Overview

This repository contains the source code for a Phaser-based game where players navigate obstacles, avoid spotlights, and score points by progressing through the level. The project is structured to facilitate learning, with key game logic split into modular code excerpts for easy reference.

---

## Directory Structure

Here’s a quick overview of the key directories and files:

- **`src/`**  
  Contains the main source files for the game. This is where the complete game logic resides.  
  - **`scenes/`**: Includes the main game scenes like `MainScene` and `StartScene`.  
  - **`assets.js`**: Defines game constants like gravity, platform dimensions, and player speed.  
  - **`main.js`**: The entry point for the game, where the Phaser game configuration is defined.

- **`src/code excerpts/`**  
  Contains modular snippets of code for specific game features. These are useful for understanding individual mechanics like spawning obstacles, handling player physics, or setting up controls.

- **`index.html`**  
  The main HTML file that loads the game into the browser.

- **`vite.config.js`**  
  Configuration file for the Vite development server.

- **`readme.md`**  
  This file, which provides instructions and details about the project.

---

## Setup Instructions

Follow these steps to set up and run the project:

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/your-username/glitch-and-go.git
   cd glitch-and-go
   ```

2. **Install Dependencies**  
   Make sure you have Node.js installed, then run:  
   ```bash
   npm install
   ```

3. **Run the Development Server**  
   Start the Vite development server:  
   ```bash
   npm run dev
   ```

4. **Open the Game**  
   Open your browser and navigate to `http://localhost:5173`.

---

## Deploying with Docker

To deploy the game using Docker, follow these steps:

1. **Build the Docker Image**  
   Run the following command to build the Docker image:  
   ```bash
   docker build -t glitch-go-game .
   ```

2. **Run the Docker Container**  
   Start the container and expose it on port 3000:  
   ```bash
   docker run -p 3000:3000 glitch-go-game
   ```

3. **Access the Game**  
   Open your browser and navigate to `http://localhost:3000` to play the game.

4. **Using Docker Compose (Optional)**  
   If you have a `docker-compose.yml` file, you can start the container with:  
   ```bash
   docker-compose up --build
   ```