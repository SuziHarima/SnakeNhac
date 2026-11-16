
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d')
const gameOverScreen = document.querySelector(".menu-screen")
const score = document.querySelector(".score-value")
const finalScore = document.querySelector(".final-score > span")
const buttonPlay = document.querySelector(".btn-play")


const eatAudio = new Audio("../assets/greetings-emote-animal-crossing.mp3")
const gameOverAudio = new Audio("../assets/fah-clean.mp3")

const size = 30;
const initialPosition = {x:270, y:270}
let snake = [initialPosition]

let direction, loopId, isDead = false

const incremetScore = () => {
    score.innerText = +score.innerText+1 
}

const drawSnake = () => {
    ctx.fillStyle = "#1DB440"
    // ctx.fillRect(snake[0].x,snake[0].y, size, size)
    
    snake.forEach( (position, index) => {
        if(index == snake.length-1) {
            ctx.fillStyle = "green"
        }
        
        ctx.fillRect(position.x, position.y, size, size)
    })
    
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#0E3639"
    
    for (let i=size; i<canvas.width; i+=size) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)

        ctx.stroke()
        
        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        
        ctx.stroke()
    }
}

const randonNumber = (min, max) => {
    return min + Math.round(Math.random()*(max - min))
}

const randonPosition = () => {
    const number = randonNumber(0, canvas.width-size)
    return Math.round(number/30) *30
}

const randonColor = () => {
    const red = randonNumber(0, 255);
    const green = randonNumber(0, 255);
    const blue = randonNumber(0, 255);

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x:randonPosition(), y:randonPosition(), color: randonColor()
}

const drawFood = () => {

    const{x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}


const moveSnake = () => {
    const head = snake[snake.length-1]

    if (!direction) return
    snake.shift()

    if (direction == "right") {
        snake.push({x:head.x+size, y:head.y})
    }
    if (direction == "left") {
        snake.push({x:head.x-size, y:head.y})
    }
    if (direction == "up") {
        snake.push({x:head.x, y:head.y-size})
    }
    if (direction == "down") {
        snake.push({x:head.x, y:head.y+size})
    }
}

const checkEat = () => {
    const head = snake[snake.length-1]
    if ((head.x == food.x) && (head.y == food.y)){
       snake.push(head) 
       eatAudio.play()

       let x = randonPosition()
       let y = randonPosition()

       while (snake.find(
        (position) => 
            (position.x == x) && (position.y == y))){
            x = randonPosition()
            y = randonPosition()
        }

        food.x = x;
        food.y = y;
        food.color = randonColor();
        incremetScore()
    
    }
}

const checkCollision = () => {
    const head = snake[snake.length-1]
    const canvasLimit = canvas.width-size
    const neckIndex = snake.length-2

    const wallCollision = 
        head.x < 0 || head.x > canvasLimit ||
        head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, i) => {
        return i < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision){
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined
    gameOverScreen.style.display = "flex"
    finalScore.innerText = score.textContent
    canvas.style.filter = "blur(5px)"
    gameOverAudio.play()
    isDead = true
}

const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)
    
    drawGrid()
    moveSnake()
    drawSnake()
    drawFood()
    checkEat()
    checkCollision()

    if (!isDead) {
        loopId = setTimeout(()=>{gameLoop()}, 200)
    }
}

gameLoop()

document.addEventListener("keydown", ({ key }) => {
    if((key=="ArrowRight" || key=="d") && direction !="left"){
        direction="right"
    }
    if((key=="ArrowLeft" || key=="a") && direction !="right"){
        direction="left"
    }
    if((key=="ArrowUp" || key=="w") && direction !="down"){
        direction="up"
    }
    if((key=="ArrowDown" || key=="s")&& direction !="up"){
        direction="down"
    }
    // debugger;
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    gameOverScreen.style.display = "none"
    snake = [initialPosition]
    canvas.style.filter = "none"
    isDead = false
    gameLoop()
})
