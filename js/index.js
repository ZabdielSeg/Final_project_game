window.onload = () => {
    document.getElementById("start-button").onclick = () =>  {
        if (gameStarted === false){
            startGame();
            gameStarted = true;
        }
    };
    document.getElementById('yesButton').onclick = () => {
        buttonYes.style.visibility = 'hidden';
        buttonNo.style.visibility = 'hidden';
        gameStarted = false;
        restart();
    };

    document.getElementById('restart').onclick = () => {
        restartButton.style.visibility = 'hidden';
        gameStarted = false;
        restart();
    }

    function startGame(){
        gameArea.start();
    }
};


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const buttonYes = document.getElementById('yesButton');
const buttonNo = document.getElementById('noButton');
const restartButton = document.getElementById('restart');
const arrowUp = document.querySelector('.box-1');
const arrowDown = document.querySelector('.box-2');
const spaceBar = document.querySelector('.space-bar');

let gameStarted = false;
let gameOver = false;
let win = false;
let time = 0;
let score1 = 0;
let enemyLife = 200;

let gameArea = {
    start: function(){
        this.interval = setInterval(updateCanvas, 20);
    },

    stop: function(){
        clearInterval(this.interval);
    }
};

// images

let principalSpaceship = new Image();
principalSpaceship.src = 'images/spaceship-2.png';

let enemySpaceship = new Image();
enemySpaceship.src = 'images/enemy-3.png';

let ovniMaster = new Image();
ovniMaster.src = 'images/enemyOvni.png';

class Integer {
    constructor(x, y, width, height, img){
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.life = 100;
    } 

    moveUp(){
        this.y -= 5;
    }

    moveDown(){
        this.y += 5;
    }

    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    left(){
        return this.y;
    }

    right(){
        return this.y + this.height;
    }

    top(){
        return this.x;
    }

    bottom(){
        return this.x + this.width;
    }
    crashWith(obstacle) {
        return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right());
    }

    crashed(){
        this.life -= 25;
    }

    hit(){
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }

    checkLimit(){
        if(this.y <= 2){
            this.y = 5;
        } 
        if((this.y + this.height) >= 350){
            this.y -= 5;
        }
    }
}
class Bullet1 extends Integer {
    constructor(x, y, width, height, color){
        super(x, y, width, height);
        this.color = color;
    }

    drawBullet(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

let realSpaceship = new Integer(0, 160, 70, 50, principalSpaceship);
let bar1 = new Bullet1(950, 60, 10, 250, 'black');

let enemiesArr23 = [];

function updateEnemies (){
    for(let i = 0; i < enemiesArr23.length; i++){
        enemiesArr23[i].x -= 4;
        enemiesArr23[i].draw();
    }
    if(time % 60 === 0){
        let x = 1100;
        let y = 5;
        let yThird = 117;
        let yFirstQRandom = Math.floor(Math.random() * (yThird - y) + y);
        let ySecondQRandom = Math.floor(Math.random() * ((yThird * 2) - yThird) + yThird);
        let yThirdQRandom = Math.floor(Math.random() * ((yThird * 3) - (yThird * 2)) + (yThird * 2));
        enemiesArr23.push(new Integer(x - 70, yFirstQRandom, 40, 40, enemySpaceship));
        enemiesArr23.push(new Integer(x, ySecondQRandom - 40, 40, 40, enemySpaceship));
        enemiesArr23.push(new Integer(x - 40 , yThirdQRandom - 40, 40, 40, enemySpaceship));
    }
}

let bulletsArr23 = [];

function createBullets(){
    bulletsArr23.push(new Bullet1(realSpaceship.x + 20, realSpaceship.y +2 , 20, 5, 'blue'));
    bulletsArr23.push(new Bullet1(realSpaceship.x + 20, realSpaceship.y +40 , 20, 5, 'blue'));
}
function updateBullets(){
    for(let i = 0; i < bulletsArr23.length; i++){
        bulletsArr23[i].x += 5;
        bulletsArr23[i].drawBullet();
    }
}

function checkCrash(){
    for(let enemy of enemiesArr23){
        if(enemy.crashWith(realSpaceship)){
            enemy.hit();
            realSpaceship.crashed();
        }
    }
}

function checkCrashBullets(){
    for(let i = 0; i < bulletsArr23.length; i++){
        if(bulletsArr23[i].crashWith(bar1)){
            score1 += 100;
            bulletsArr23[i].hit();
            enemyLife -= 5;
        }
        for(let j = 0; j < enemiesArr23.length; j++){
            if(enemiesArr23[j].crashWith(bulletsArr23[i])){
                bulletsArr23[i].hit();
                enemiesArr23[j].hit();
                score1 += 60;
            }
        }
    }
}

let enemyBullets = [];

function updateEnemyBullets() {
    for(let i = 0; i < enemyBullets.length; i++){
        enemyBullets[i].x -= 7 ;
        enemyBullets[i].drawBullet();
    }
    if(time % 50 === 0){
    let x = 1000;
    let effectTimeSeparation = 100;
    let y = 5;
    let yThird = 117;
    let yFirstQRandom = Math.floor(Math.random() * (yThird - y) + y);
    let ySecondQRandom = Math.floor(Math.random() * ((yThird * 2) - yThird) + yThird);
    let yThirdQRandom = Math.floor(Math.random() * ((yThird * 3) - (yThird * 2)) + (yThird * 2));
    enemyBullets.push(new Bullet1(x, yFirstQRandom, 20, 3, 'orange'));
    enemyBullets.push(new Bullet1(x + effectTimeSeparation, ySecondQRandom, 20, 3, 'orange'));
    enemyBullets.push(new Bullet1(x, yThirdQRandom, 20, 3, 'orange'));
    }
}

function checkCrashEnemyBullets() {
    for(let bullet of enemyBullets){
        if(bullet.crashWith(realSpaceship)){
            bullet.hit();
            realSpaceship.life -= 10;
        }
    }
}

function drawOvni(){
    ctx.drawImage(ovniMaster, 900, -10, 380, 380);
        ctx.beginPath();
        ctx.arc(1095, 180, 190, 0, Math.PI * 2, true);
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();
}

function checkWinning() {
    if(enemyLife <= 0){
        enemyLife = 0;
        ctx.font = '70px serif';
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillText(`Congrats, you won`, 150, 130);
        ctx.fillText(`Would you like to play level 2?`, 150, 220);
        buttonYes.style.visibility = 'visible';
        buttonNo.style.visibility = 'visible';
        gameArea.stop();
        win = true;
    }
}


function checkGameOver(){
    if(realSpaceship.life <= 0){
        gameArea.stop();
        realSpaceship.life = 0;
        ctx.font = '70px serif';
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillText(`I think you lost`, 150, 130);
        ctx.fillText(`Click the button to play again`, 60, 220);
        restartButton.style.visibility = 'visible';
    }
}


function showLife(){
    let spaceshipLife = realSpaceship.life;
    ctx.font = '30px serif';
    ctx.fillStyle = 'rgba(255, 255, 255, .8)';
    ctx.fillText(`Health: ${spaceshipLife}`, 30, 30);

    let points = Math.floor(score1 / 20);
    ctx.font = '30px serif';
    ctx.fillStyle = 'rgba(255, 255, 255, .8)';
    ctx.fillText(`Score: ${points}`, 500, 30);

    let enemyLife1 = enemyLife;
    ctx.font = '30px serif';
    ctx.fillStyle = 'rgba(255, 255, 255, .8)';
    ctx.fillText(`Enemy's Life: ${enemyLife1}`, 850, 30);

}

function restart(){
    ctx.clearRect(0, 0, 1150, 350);
    time = 0;
    score1 = 0;
    enemyLife = 200;
    realSpaceship.life = 100;
    enemiesArr23 = [];
    bulletsArr23 = [];
    enemyBullets = [];
    realSpaceship.x = 30;
    realSpaceship.y = 160;
}

function updateCanvas(){
    time += 1;
    score1 += 1;
    ctx.clearRect(0, 0, 1150, 350);
    realSpaceship.draw();
    bar1.drawBullet();
    realSpaceship.checkLimit();
    updateEnemies();
    updateBullets();
    updateEnemyBullets(); 
    drawOvni();
    checkCrashBullets();
    checkCrash();
    checkCrashEnemyBullets();
    checkWinning();
    checkGameOver();
    showLife();
}



document.addEventListener('keydown', e => {
    switch(e.which){
        case 38:
            realSpaceship.moveUp();
            arrowUp.style.backgroundColor = 'white';
            break;
        case 40:
            realSpaceship.moveDown();
            arrowDown.style.backgroundColor = 'white';
            break;
        case 32:
            createBullets();
            spaceBar.style.backgroundColor = 'white';
            break;
    }
})

document.addEventListener('keyup', e => {
    switch(e.which){
        case 38:
            arrowUp.style.backgroundColor = 'rgb(228, 227, 227)';
            break;
        case 40:
            arrowDown.style.backgroundColor = 'rgb(228, 227, 227)';
            break;
        case 32:
            spaceBar.style.backgroundColor = 'rgb(228, 227, 227)';
    }
})