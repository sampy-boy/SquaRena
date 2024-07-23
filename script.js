const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


const colorconver = {'5': '#46caf2', '2': '#eb8f34', '3': '#ffb700', '4': '#7bff00', '1': '#f25a46', '6': '#8800ff', '7': '#ffffff'}
const lowcolor = {'#46caf2': '#3eadcf', '#eb8f34': '#bf742a', '#ffb700': '#db9d00', '#7bff00': '#5bbd00', '#f25a46': '#ba4434', '#8800ff': '#6500bd', '#ffffff': '#d1d1d1'}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let started = false;

let style = 1;

let initspeed = 5;

let initsize = 100;

let sound = 1;
let spawnrate = 1;

let powerups = {inv: true, heal: true, speed: true, slow: true};

let square1 = { x: canvas.width / 3.5, y: canvas.height / 2.85, color: '#46caf2', size: initsize, health: 1, xvel: 1, yvel: -1, inv: false, border: 10};
let square2 = { x: canvas.width / 1.525, y: canvas.height / 2.5, color: '#f25a46', size: initsize, health: 1, xvel: -1, yvel: 1, inv: false, border: 10};

let borderSquare = { x: canvas.width / 4, y: 5, size: canvas.width / 2, border: 5 };

let chaosMin = -0.1;
let chaosMax = 0.1;

let speed1 = initspeed;
let speed2 = initspeed;

let healthsize = 20;
let healthcolor = '#41f067';
let healthonscreen = false;

let invsize = 15;
let invcolor = '#f0b541';
let invonscreen = false;

let health = {x: 0, y: 0, size: healthsize};
let inv = {x: 0, y: 0, size: invsize};

let invframe1 = 0;
let invframe2 = 0;

let speedsize = 13;
let speedcolor = '#41f0b2';
let speedonscreen = false;
let speed = {x: 0, y: 0, size: speedsize};

let slowsize = 15;
let slowcolor = '#8b9e9a';
let slowonscreen = false;
let slow = {x: 0, y: 0, size: slowsize};

function isSquareCollision(square1, square2) {
    const buffer = 5;   
    return !(
      square1.x + square1.size - buffer < square2.x ||
      square1.x + buffer > square2.x + square2.size ||
      square1.y + square1.size - buffer < square2.y ||
      square1.y + buffer > square2.y + square2.size
    );
}

function detectBorderCollision(squareWithBorder, otherSquare) {
    const borderThickness = squareWithBorder.border;
    const borderLeft = squareWithBorder.x - borderThickness;
    const borderRight = squareWithBorder.x + squareWithBorder.size + borderThickness;
    const borderTop = squareWithBorder.y - borderThickness;
    const borderBottom = (squareWithBorder.y + squareWithBorder.size + borderThickness) - 60;
      
    const squareLeft = otherSquare.x;
    const squareRight = otherSquare.x + otherSquare.size;
    const squareTop = otherSquare.y;
    const squareBottom = otherSquare.y + otherSquare.size;
      
    if (squareRight > borderLeft && squareLeft < borderRight) {
        if (squareTop < borderTop) {
        return 3; 
        } else if (squareBottom > borderBottom) {
        return 4;
        }
    }
      
    if (squareTop < borderBottom && squareBottom > borderTop) {
        if (squareLeft < borderLeft) {
        return 1;
        } else if (squareRight > borderRight) {
        return 2; 
        }
    }
      
return 0;
}

function playSound() {
    if (sound == 1){
        const audio = new Audio('assets/hit1.wav');
        audio.play();
    } else if (sound == 2){
        const audio = new Audio('assets/hit2.mp3');
        audio.play();
    }
}

function drawBorder(x, y, width, height, borderColor, color, borderWidth) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(x, y, width, height);
}

function drawText(x, y, color, text) {
    ctx.fillStyle = color;
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
}

function drawSquares() {
    if (square1.health > 0){
        if (square1.inv){
            ctx.fillStyle = invcolor;
            ctx.strokeStyle = "#c99938"
        } else {
            ctx.fillStyle = square1.color;
            ctx.strokeStyle = lowcolor[square1.color];
        }
        ctx.lineWidth = square1.border;
        ctx.fillRect(square1.x, square1.y, square1.size, square1.size);
        ctx.strokeRect(square1.x, square1.y, square1.size, square1.size);
    }

    if (square2.health > 0){
        if (square2.inv){
            ctx.fillStyle = invcolor;
            ctx.strokeStyle = "#c99938"
        } else {
            ctx.fillStyle = square2.color;
            ctx.strokeStyle = lowcolor[square2.color];
        }
        ctx.lineWidth = square2.border;
        ctx.fillRect(square2.x, square2.y, square2.size, square2.size);
        ctx.strokeRect(square2.x, square2.y, square2.size, square2.size);
    }
}

function generateHeal() {
    if (Math.floor(Math.random() * 20 * spawnrate) == 1 && !healthonscreen && powerups.heal){
        if (square1.health < 1 || square2.health < 1){
            healthonscreen = true;
            const borderX = borderSquare.x;
            const borderY = borderSquare.y;
            const borderWidth = borderSquare.size;
            const borderHeight = borderSquare.size;
        
            health.x = (Math.random() * borderWidth) + borderX;
            health.y = Math.max((Math.random() * borderHeight) + borderY - 75, 0);
        }
    }
}

function generateInv() {
    if (Math.floor(Math.random() * 100 * spawnrate) == 1 && !invonscreen && powerups.inv){
        if (square1.health < 1 || square2.health < 1){
            invonscreen = true;
            const borderX = borderSquare.x;
            const borderY = borderSquare.y;
            const borderWidth = borderSquare.size;
            const borderHeight = borderSquare.size;
        
            inv.x = (Math.random() * borderWidth) + borderX;
            inv.y = Math.max((Math.random() * borderHeight) + borderY - 75, 0);
        }
    }
}

function generateSpeed() {
    if (Math.floor(Math.random() * 400 * spawnrate) == 1 && !speedonscreen && powerups.speed){

        speedonscreen = true;
        const borderX = borderSquare.x;
        const borderY = borderSquare.y;
        const borderWidth = borderSquare.size;
        const borderHeight = borderSquare.size;
        
        speed.x = (Math.random() * borderWidth) + borderX;
        speed.y = Math.max((Math.random() * borderHeight) + borderY - 75, 0);
    }
}

function generateSlow() {
    if (Math.floor(Math.random() * 400 * spawnrate) == 1 && !slowonscreen && powerups.slow){

        slowonscreen = true;
        const borderX = borderSquare.x;
        const borderY = borderSquare.y;
        const borderWidth = borderSquare.size;
        const borderHeight = borderSquare.size;
        
        slow.x = (Math.random() * borderWidth) + borderX;
        slow.y = Math.max((Math.random() * borderHeight) + borderY - 75, 0);
    }
}

function drawHealth() {
    for (let i = 1; i < 11; i++) {
        if ((square1.health * 10) >= i) {
            ctx.fillStyle = square1.color;
            ctx.fillRect((canvas.width / 4) + (25 * i), (canvas.height * 0.85 + 20), 15, 10);
        }
    }
    for (let i = 1; i < 11; i++) {
        if ((square2.health * 10) >= i) {
            ctx.fillStyle = square2.color;
            ctx.fillRect((canvas.width / 4) + (25 * i), (canvas.height * 0.85 + 30), 15, 10);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const borderWidth = canvas.width / 2; 
    const borderHeight = canvas.height * 0.85;
    const borderX = canvas.width / 4; 
    const borderY = 5; 

    drawBorder(borderX, borderY, borderWidth, borderHeight, 'white', 'black', 5);

    if (!started) {
        const text = 'Space to start';
        const textX = borderX + borderWidth / 2;
        const textY = borderY + borderHeight / 2;
        drawText(textX, textY, 'white', text);
    } else {
        drawSquares();
        drawHealth();
        generateHeal();
        generateInv();
        generateSpeed();
        generateSlow();
        ctx.lineWidth = 3;
        if (healthonscreen) {
            ctx.fillStyle = healthcolor;
            ctx.strokeStyle = '#34c955'
            ctx.fillRect(health.x, health.y, healthsize, healthsize);
            ctx.strokeRect(health.x, health.y, healthsize, healthsize);
        } else {
            health.x = 0;
            health.y = 0;
        }
        if (invonscreen) {
            ctx.fillStyle = invcolor;
            ctx.strokeStyle = '#c79636'
            ctx.fillRect(inv.x, inv.y, invsize, invsize);
            ctx.strokeRect(inv.x, inv.y, invsize, invsize);
        } else {
            inv.x = 0;
            inv.y = 0;
        }
        if (speedonscreen) {
            ctx.fillStyle = speedcolor;
            ctx.strokeStyle = '#34c290'
            ctx.fillRect(speed.x, speed.y, speedsize, speedsize);
            ctx.strokeRect(speed.x, speed.y, speedsize, speedsize);
        } else {
            speed.x = 0;
            speed.y = 0;
        }
        if (slowonscreen) {
            ctx.fillStyle = slowcolor;
            ctx.strokeStyle = '#657370';
            ctx.fillRect(slow.x, slow.y, slowsize, slowsize);
            ctx.strokeRect(slow.x, slow.y, slowsize, slowsize);
        } else {
            slow.x = 0;
            slow.y = 0;
        }
    }
}

function returnRandomVector2(min, max, vel) {
    vel *= -1;
    if (vel < 0) {
        return Math.min(-0.1, vel + (Math.random() * (max - min) + min));
    } else {
        return Math.max(0.1, vel + (Math.random() * (max - min) + min));
    }
}

function keyHandler(event) {
    const key = event.key;
    if (key === ' ') {
        console.log("Space pressed");
        started = !started;
        controlledLoop();
    }
}

function updateSquares() {
    if (style === 1) {
        const bordercol1 = detectBorderCollision(borderSquare, square1);
        if (bordercol1 !== 0) {
            if (bordercol1 === 1 || bordercol1 === 2) {
                playSound();
                square1.xvel = returnRandomVector2(chaosMin, chaosMax, square1.xvel);
            } else {
                playSound();
                square1.yvel = returnRandomVector2(chaosMin, chaosMax, square1.yvel);
            }
        }
    }

        const bordercol2 = detectBorderCollision(borderSquare, square2);
        if (bordercol2 !== 0) {
            if (bordercol2 === 1 || bordercol2 === 2) {
                playSound();
                square2.xvel = returnRandomVector2(chaosMin, chaosMax, square2.xvel);
            } else {
                playSound();
                square2.yvel = returnRandomVector2(chaosMin, chaosMax, square2.yvel);
            }
        }

        if (isSquareCollision(square1, square2)){
            
            if (square1.x + square1.size >= square2.x && square1.x <= square2.x + square2.size) {
                playSound();
                square1.xvel = returnRandomVector2(chaosMin, chaosMax, square1.xvel);
                square2.xvel = returnRandomVector2(chaosMin, chaosMax, square2.xvel);
            }
            
            if (square1.y + square1.size >= square2.y && square1.y <= square2.y + square2.size) {
                playSound();
                square1.yvel = returnRandomVector2(chaosMin, chaosMax, square1.yvel);
                square2.yvel = returnRandomVector2(chaosMin, chaosMax, square2.yvel);
            }

            if (!square1.inv){
                square1.health -= 0.1;
            }
            
            if (!square2.inv){
                square2.health -= 0.1;
            }
            
        }

        if (isSquareCollision(health, square1)){
            square1.health = Math.min(10, square1.health + 0.1);
            healthonscreen = false;
        }

        if (isSquareCollision(health, square2)){
            square2.health = Math.min(10, square2.health + 0.1);
            healthonscreen = false;
        }

        if (isSquareCollision(inv, square1)){
            square1.inv = true;
            invframe1 = 140;
            invonscreen = false;
        }

        if (isSquareCollision(inv, square2)){
            square2.inv = true;
            invframe2 = 140;
            invonscreen = false;
        }

        if (isSquareCollision(speed, square1)){
            speed1 = Math.min(8, speed1 + 1);
            speedonscreen = false;
        }

        if (isSquareCollision(speed, square2)){
            speed2 = Math.min(8, speed2 + 1);
            speedonscreen = false;
        }

        if (isSquareCollision(slow, square1)){
            speed1 = Math.max(1, speed1 - 1);
            slowonscreen = false;
        }

        if (isSquareCollision(slow, square2)){
            speed2 = Math.max(1, speed2 - 1);
            slowonscreen = false;
        }

        square1.x += square1.xvel * speed1;
        square1.y += square1.yvel * speed1;
        square2.x += square2.xvel * speed2;
        square2.y += square2.yvel * speed2;


        square1.size = Math.min(initsize * (square1.health * 2), initsize);
        square2.size = Math.min(initsize * (square2.health * 2), initsize);

        square1.border = (10 * square1.health) * (initsize / 100);
        square2.border = (10 * square2.health) * (initsize / 100);
        
}
    

function controlledLoop() {
    if (started) {
        if (invframe1 == 0){
            square1.inv = false;
        }
        if (invframe2 == 0){
            square2.inv = false;
        }
        invframe1 -= 1;
        invframe2 -= 1;
        draw();
        updateSquares();
        requestAnimationFrame(controlledLoop);  
    }
}

draw();

document.getElementById('readValuesButton').addEventListener('click', function() {
    const col1 = document.getElementById('color').value;
    const col2 = document.getElementById('color2').value;
    sound = document.getElementById('sound').value;

    square1.color = colorconver[col1];
    square2.color = colorconver[col2];
    
    powerups.heal = document.getElementById('healon').checked;
    powerups.inv = document.getElementById('invon').checked;
    powerups.speed = document.getElementById('spdon').checked;
    powerups.slow = document.getElementById('slwon').checked;

    initsize = parseInt(document.getElementById('sizeSlider').value, 10);
    initspeed = parseFloat(document.getElementById('speedSlider').value);
    speed1 = parseFloat(document.getElementById('speedSlider').value);
    speed2 = parseFloat(document.getElementById('speedSlider').value);
    spawnrate = 2.1 - parseFloat(document.getElementById('spawnSlider').value)
    console.log(initspeed);

});

document.addEventListener("keydown", keyHandler);

controlledLoop(); 

