const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;

let player1 = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

let player2 = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 5
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5,
    dy: 5,
    radius: ballSize,
    speed: 5
};

let score = {
    player1: 0,
    player2: 0
};

let keys = {};
let mouseY = canvas.height / 2;

// Event Listeners
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update Functions
function updatePlayer1() {
    // Mouse control
    if (mouseY - paddleHeight / 2 !== player1.y) {
        player1.y = mouseY - paddleHeight / 2;
    }

    // Arrow keys control (also works)
    if (keys['ArrowUp'] && player1.y > 0) {
        player1.y -= player1.speed;
    }
    if (keys['ArrowDown'] && player1.y < canvas.height - paddleHeight) {
        player1.y += player1.speed;
    }

    // Keep paddle in bounds
    if (player1.y < 0) player1.y = 0;
    if (player1.y + paddleHeight > canvas.height) player1.y = canvas.height - paddleHeight;
}

function updatePlayer2() {
    // Simple AI: track the ball
    const paddleCenter = player2.y + paddleHeight / 2;
    const ballCenter = ball.y;

    if (ballCenter < paddleCenter - 35) {
        if (player2.y > 0) {
            player2.y -= player2.speed;
        }
    } else if (ballCenter > paddleCenter + 35) {
        if (player2.y < canvas.height - paddleHeight) {
            player2.y += player2.speed;
        }
    }

    // Keep paddle in bounds
    if (player2.y < 0) player2.y = 0;
    if (player2.y + paddleHeight > canvas.height) player2.y = canvas.height - paddleHeight;
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom wall collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }

    // Paddle collision - Player 1
    if (
        ball.x - ball.radius < player1.x + player1.width &&
        ball.y > player1.y &&
        ball.y < player1.y + player1.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player1.x + player1.width + ball.radius;
        
        // Add spin based on paddle position
        const deltaY = ball.y - (player1.y + player1.height / 2);
        ball.dy = (deltaY / (player1.height / 2)) * ball.speed;
        
        // Increase ball speed slightly
        if (Math.abs(ball.dx) < 8) {
            ball.dx *= 1.05;
        }
        if (Math.abs(ball.dy) < 8) {
            ball.dy *= 1.05;
        }
    }

    // Paddle collision - Player 2
    if (
        ball.x + ball.radius > player2.x &&
        ball.y > player2.y &&
        ball.y < player2.y + player2.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player2.x - ball.radius;
        
        // Add spin based on paddle position
        const deltaY = ball.y - (player2.y + player2.height / 2);
        ball.dy = (deltaY / (player2.height / 2)) * ball.speed;
        
        // Increase ball speed slightly
        if (Math.abs(ball.dx) < 8) {
            ball.dx *= 1.05;
        }
        if (Math.abs(ball.dy) < 8) {
            ball.dy *= 1.05;
        }
    }

    // Score and reset
    if (ball.x - ball.radius < 0) {
        score.player2++;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        score.player1++;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 6;
    
    // Update scoreboard
    document.getElementById('player1-score').textContent = score.player1;
    document.getElementById('player2-score').textContent = score.player2;
}

// Draw Functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    drawCenterLine();
    drawPaddle(player1);
    drawPaddle(player2);
    drawBall();
}

// Game Loop
function gameLoop() {
    updatePlayer1();
    updatePlayer2();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();