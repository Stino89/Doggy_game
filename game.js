// Configuration settings for Phaser game
const config = {
    type: Phaser.AUTO, // Automatically use WebGL if available, otherwise fallback to Canvas
    width: 800, // Width of the game screen
    height: 600, // Height of the game screen
    physics: {
        default: 'arcade', // Use arcade physics for simple collision and movement
        arcade: {
            gravity: { y: 500 }, // Set vertical gravity, for a platformer effect
            debug: false // Disable physics debugging visuals
        }
    },
    scene: { // Define the three main functions Phaser will call
        preload: preload, // Load assets here
        create: create, // Set up game world and objects here
        update: update // Main game loop logic goes here
    }
};

// Initialize Phaser game with the configuration settings above
const game = new Phaser.Game(config);

// Define a player variable that will hold the Shiba Inu sprite
let player;

/**
 * Preload function: Load assets before the game starts
 */
function preload() {
    // Load Shiba Inu sprite sheet with multiple frames for animation
    this.load.spritesheet('shiba', 'assets/images/shiba-sprite.png', { frameWidth: 32, frameHeight: 32 });
    
    // Load platform image for the ground and platforms the player will stand on
    this.load.image('platform', 'assets/images/platform.png');
    
    // Load background image to create the game environment backdrop
    this.load.image('background', 'assets/images/background.png');
}

/**
 * Create function: Initialize game objects and settings
 */
function create() {
    // Add background image centered on the screen
    this.add.image(400, 300, 'background');
    
    // Create a static group of platforms; these platforms will not move
    const platforms = this.physics.add.staticGroup();
    
    // Add platforms to the scene at specified coordinates
    platforms.create(400, 568, 'platform').setScale(2).refreshBody(); // Ground platform
    platforms.create(600, 400, 'platform'); // Floating platform
    platforms.create(50, 250, 'platform'); // Another floating platform
    platforms.create(750, 220, 'platform'); // Yet another platform

    // Add the Shiba Inu player character, starting at (100, 450)
    player = this.physics.add.sprite(100, 450, 'shiba');
    player.setBounce(0.2); // Set slight bounce when the player lands on platforms
    player.setCollideWorldBounds(true); // Prevent player from moving off-screen

    // Define animations for Shiba Inu's movements: left and right
    this.anims.create({
        key: 'left', // Left animation key
        frames: this.anims.generateFrameNumbers('shiba', { start: 0, end: 3 }), // Frames 0 to 3 for left movement
        frameRate: 10, // Play animation at 10 frames per second
        repeat: -1 // Loop animation indefinitely
    });
    
    this.anims.create({
        key: 'right', // Right animation key
        frames: this.anims.generateFrameNumbers('shiba', { start: 5, end: 8 }), // Frames 5 to 8 for right movement
        frameRate: 10, // Play animation at 10 frames per second
        repeat: -1 // Loop animation indefinitely
    });

    // Enable collision detection between the player and the platforms
    this.physics.add.collider(player, platforms);
}

/**
 * Update function: Main game loop; runs continuously to update game state
 */
function update() {
    // Capture input from keyboard arrow keys
    const cursors = this.input.keyboard.createCursorKeys();

    // Move the player left when the left arrow key is pressed
    if (cursors.left.isDown) {
        player.setVelocityX(-160); // Set horizontal velocity to move left
        player.anims.play('left', true); // Play left animation
    }
    // Move the player right when the right arrow key is pressed
    else if (cursors.right.isDown) {
        player.setVelocityX(160); // Set horizontal velocity to move right
        player.anims.play('right', true); // Play right animation
    } 
    // If neither left nor right keys are pressed, stop the player
    else {
        player.setVelocityX(0); // Stop horizontal movement
        player.anims.stop(); // Stop any animation
    }

    // Allow player to jump if they are touching the ground and the up arrow key is pressed
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330); // Set vertical velocity to jump
    }
}
