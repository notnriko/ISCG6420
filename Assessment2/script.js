// Game Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TOY_RADIUS = 30;
const TOY_STAGE2_DURATION = 5000; // 5 seconds in ms
const TOY_STAGE3_DURATION = 5000; // 5 seconds in ms

// Game Variables
let canvas, ctx;
let gameActive = false;
let score = 0;
let timeLeft = 0;
let gameInterval;
let toys = [];
let lastToyTime = 0;
let toyInterval = 2000; // New toy every 2 seconds

// Character Variables
let character = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    width: 60,
    height: 60,
    speed: 5,
    direction: 'right', // 'left', 'right', 'up', 'down'
    isMoving: false
};

// Key States
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
    ' ': false // spacebar
};

// Sound Effects
const sounds = {
    start: new Audio('assets/sounds/countdown.wav'),
    collect: new Audio('assets/sounds/point.wav'),
    fail: new Audio('assets/sounds/lose.flac'),
    end: new Audio('assets/sounds/gameover.wav')
};

// Global variables
let assetsToLoad = 0;
let assetsLoaded = 0;
let characterImg, backgroundImg;

// New improved asset loader
function loadAssets() {
    // List of all assets to load
    const assets = [
        { type: 'image', path: 'assets/images/swimmer.png', var: 'characterImg' },
        { type: 'image', path: 'assets/images/water.jpg', var: 'backgroundImg' },
        { type: 'audio', path: 'assets/sounds/countdown.wav', var: 'sounds.start' },
        { type: 'audio', path: 'assets/sounds/point.wav', var: 'sounds.collect' },
        { type: 'audio', path: 'assets/sounds/lose.flac', var: 'sounds.fail' },
        { type: 'audio', path: 'assets/sounds/gameover.wav', var: 'sounds.end' }
    ];

    assetsToLoad = assets.length;
    
    assets.forEach(asset => {
        if (asset.type === 'image') {
            const img = new Image();
            img.onload = () => assetLoaded();
            img.onerror = () => assetError(asset.path);
            img.src = asset.path;
            window[asset.var] = img;
        } else if (asset.type === 'audio') {
            const audio = new Audio(asset.path);
            audio.oncanplaythrough = () => assetLoaded();
            audio.onerror = () => assetError(asset.path);
            window[asset.var.split('.')[0]][asset.var.split('.')[1]] = audio;
        }
    });
}

function assetLoaded() {
    assetsLoaded++;
    const progress = Math.floor((assetsLoaded / assetsToLoad) * 100);
    document.getElementById('loading-progress').textContent = `${progress}%`;
    
    if (assetsLoaded === assetsToLoad) {
        // All assets loaded
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('game-content').classList.remove('hidden');
            initGame();
        }, 500);
    }
}

function assetError(path) {
    console.error(`Failed to load asset: ${path}`);
    assetLoaded(); // Continue anyway
}

function initGame() {
    // Set initial volume
    const volume = document.getElementById('volume').value;
    Object.values(sounds).forEach(sound => {
        sound.volume = volume;
    });
    
    // Initialize game
    drawInitialScreen();
    
    // Enable start button
    document.getElementById('start-btn').disabled = false;
}

// Call this when the page loads
window.addEventListener('DOMContentLoaded', () => {
    loadAssets();
});

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get canvas and context
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Set up event listeners
    setupEventListeners();
    
    // Preload assets
    preloadAssets();
    
    // Draw initial screen
    drawInitialScreen();
});

function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Game controls
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('play-again').addEventListener('click', restartGame);
    
    // Volume control
    document.getElementById('volume').addEventListener('input', (e) => {
        const volume = e.target.value;
        Object.values(sounds).forEach(sound => {
            sound.volume = volume;
        });
    });
}

function handleKeyDown(e) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
        keys[e.key] = true;
        e.preventDefault();
        
        // Update character direction
        if (e.key === 'ArrowRight' || e.key === 'd') character.direction = 'right';
        if (e.key === 'ArrowLeft' || e.key === 'a') character.direction = 'left';
        if (e.key === 'ArrowUp' || e.key === 'w') character.direction = 'up';
        if (e.key === 'ArrowDown' || e.key === 's') character.direction = 'down';
        
        character.isMoving = true;
    }
}

function handleKeyUp(e) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
        keys[e.key] = false;
        e.preventDefault();
        
        // Check if all movement keys are released
        const movementKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];
        character.isMoving = movementKeys.some(key => keys[key]);
    }
}

function preloadAssets() {
    // In a real implementation, you would preload images and sounds here
    // For this example, we'll just set the volume
    Object.values(sounds).forEach(sound => {
        sound.volume = document.getElementById('volume').value;
    });
}

function drawInitialScreen() {
    if (!assetsLoaded) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw background if loaded
    if (backgroundImg.complete) {
        ctx.drawImage(backgroundImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
        ctx.fillStyle = '#48cae4';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    
    // Draw initial message
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press START to begin the game!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
}

function drawCharacter() {
    if (!assetsLoaded) return;
    
    ctx.save();
    ctx.translate(character.x, character.y);
    
    // Flip character based on direction
    if (character.direction === 'left') {
        ctx.scale(-1, 1);
        ctx.drawImage(characterImg, -character.width, -character.height/2, character.width, character.height);
    } else {
        ctx.drawImage(characterImg, 0, -character.height/2, character.width, character.height);
    }
    
    ctx.restore();
}

function startGame() {
    if (!assetsLoaded) {
        console.warn("Assets not fully loaded yet!");
        return;
    }
    
    sounds.start.play();
    
    score = 0;
    document.getElementById('score').textContent = score;
    timeLeft = parseInt(document.getElementById('game-time').value);
    updateTimerDisplay();
    toys = [];
    
    document.getElementById('start-btn').disabled = true;
    document.getElementById('restart-btn').disabled = false;
    
    gameActive = true;
    lastToyTime = Date.now();
    gameInterval = setInterval(gameLoop, 1000 / 60);
    
    // Hide instructions when game starts
    document.querySelector('.instructions').classList.add('hidden');
}

function restartGame() {
    // Stop any running game
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    
    // Hide game over screen if visible
    document.getElementById('game-over').classList.add('hidden');
    
    // Reset game state
    gameActive = false;
    
    // Show instructions again
    document.querySelector('.instructions').classList.remove('hidden');
    
    // Enable start button
    document.getElementById('start-btn').disabled = false;
    
    // Redraw initial screen
    drawInitialScreen();
}

function gameLoop() {
    // Update game state
    update();
    
    // Render game
    render();
}

function update() {
    // Update time
    timeLeft -= 1/60; // Subtract 1/60 of a second (assuming 60 FPS)
    if (timeLeft <= 0) {
        endGame();
        return;
    }
    
    // Update timer display every second
    if (Math.floor(timeLeft) !== Math.floor(timeLeft + 1/60)) {
        updateTimerDisplay();
    }
    
    // Move character based on key presses
    if (keys.ArrowUp || keys.w) character.y = Math.max(0, character.y - character.speed);
    if (keys.ArrowDown || keys.s) character.y = Math.min(CANVAS_HEIGHT - character.height, character.y + character.speed);
    if (keys.ArrowLeft || keys.a) character.x = Math.max(0, character.x - character.speed);
    if (keys.ArrowRight || keys.d) character.x = Math.min(CANVAS_WIDTH - character.width, character.x + character.speed);
    
    // Check for collection attempt
    if (keys[' ']) {
        attemptCollection();
        keys[' '] = false; // Reset spacebar state
    }
    
    // Spawn new toys periodically
    const now = Date.now();
    if (now - lastToyTime > toyInterval) {
        spawnToy();
        lastToyTime = now;
    }
    
    // Update all toys
    updateToys();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = Math.floor(timeLeft % 60);
    document.getElementById('time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function spawnToy() {
    const toy = {
        x: Math.random() * (CANVAS_WIDTH - 100) + 50, // Random x position (avoid edges)
        y: 0, // Start at top
        targetY: Math.random() * (CANVAS_HEIGHT * 0.6) + 50, // Random y position in upper 60% of canvas
        radius: TOY_RADIUS,
        color: getRandomBrightColor(),
        stage: 1, // 1: falling, 2: floating, 3: sinking, 4: respawning
        stageStartTime: Date.now(),
        collected: false
    };
    
    toys.push(toy);
}

function getRandomBrightColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 50%)`;
}

function updateToys() {
    const now = Date.now();
    
    for (let i = toys.length - 1; i >= 0; i--) {
        const toy = toys[i];
        
        switch (toy.stage) {
            case 1: // Falling to target position
                toy.y += 2; // Fall speed
                if (toy.y >= toy.targetY) {
                    toy.stage = 2;
                    toy.stageStartTime = now;
                }
                break;
                
            case 2: // Floating
                if (now - toy.stageStartTime > TOY_STAGE2_DURATION) {
                    toy.stage = 3;
                    toy.stageStartTime = now;
                    toy.initialRadius = toy.radius;
                }
                break;
                
            case 3: // Sinking (shrinking and fading)
                const stage3Progress = (now - toy.stageStartTime) / TOY_STAGE3_DURATION;
                if (stage3Progress >= 1) {
                    toy.stage = 4;
                } else {
                    // Shrink and fade
                    toy.radius = toy.initialRadius * (1 - stage3Progress);
                    toy.opacity = 1 - stage3Progress;
                }
                break;
                
            case 4: // Respawn
                // Remove toy (it will be replaced by a new one)
                toys.splice(i, 1);
                break;
        }
    }
}

function attemptCollection() {
    if (!gameActive) return;
    
    let collectedAny = false;
    
    for (const toy of toys) {
        if (toy.stage !== 2 && toy.stage !== 3) continue; // Only collect during stages 2 and 3
        
        // Simple distance check for collection
        const distance = Math.sqrt(
            Math.pow(character.x - toy.x, 2) + 
            Math.pow(character.y - toy.y, 2)
        );
        
        if (distance < character.width / 2 + toy.radius) {
            // Successful collection
            if (toy.stage === 2) {
                score += 2; // Bonus for collecting during floating stage
            } else {
                score += 1;
            }
            
            toy.collected = true;
            collectedAny = true;
            
            // Remove the toy immediately
            const index = toys.indexOf(toy);
            if (index !== -1) {
                toys.splice(index, 1);
            }
        }
    }
    
    if (collectedAny) {
        sounds.collect.play();
        document.getElementById('score').textContent = score;
    } else {
        sounds.fail.play();
    }
}

function render() {
    if (!assetsLoaded) return;
    
    // Draw background image (scaled to canvas)
    ctx.drawImage(backgroundImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw all toys
    drawToys();
    
    // Draw character
    drawCharacter();
}

function drawToys() {
    for (const toy of toys) {
        if (toy.stage === 4) continue; // Don't draw respawning toys
        
        ctx.save();
        
        if (toy.stage === 3) {
            // Apply opacity for sinking stage
            ctx.globalAlpha = toy.opacity || 1;
        }
        
        // Create radial gradient for the toy (bonus feature)
        const gradient = ctx.createRadialGradient(
            toy.x, toy.y, 0,
            toy.x, toy.y, toy.radius
        );
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.7, toy.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(toy.x, toy.y, toy.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add highlight for more realistic look
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(
            toy.x - toy.radius * 0.3, 
            toy.y - toy.radius * 0.3, 
            toy.radius * 0.2, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
        
        ctx.restore();
    }
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    
    // Play end sound
    sounds.end.play();
    
    // Show game over screen
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over').classList.remove('hidden');
    
    // Enable start button
    document.getElementById('start-btn').disabled = false;
}