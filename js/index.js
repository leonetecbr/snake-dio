let canvas = document.getElementById('snake')
let context = canvas.getContext('2d')
let box = 16, snake = [{x: 16 * box,y: 16 * box}], direction = 'right', game = 'pause'
let jogo, foods = [], score = 0, food = 5, highscore = 0, blocks = [], block = 2, bombs = [], bomb = 5, time, dpd = 0

function createBG(){
    context.fillStyle = 'lightgreen'
    context.fillRect(0, 0, 32*box, 32*box)
}

function createSnake (){
  for(let snk of snake){
    context.fillStyle = 'green'
    context.fillRect(snk.x, snk.y, box, box)
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', {scope: './'})
}

document.addEventListener('keydown', move)

function move(event) {
  if((event.keyCode == 37  || event.keyCode == 65) && direction != 'right') direction = 'left'
  else if((event.keyCode == 38 || event.keyCode == 87) && direction != 'down') direction = 'up'
  else if((event.keyCode == 39 || event.keyCode == 68) && direction != 'left') direction = 'right'
  else if((event.keyCode == 40  || event.keyCode == 83) && direction != 'up') direction = 'down'
  else if(event.keyCode == 13 || event.keyCode == 0 || event.keyCode == 32){
    if (game == 'pause') {
      iniciar()
    }else{
      pausar()
    }
  }
}

function generateFoods(locale = 'all') {
  if (locale == 'all') {
    foods = []
    for (let i = 0; i < food; i++) {
      let coordenadas = {
        x: Math.floor(Math.random() * (31 - 1) + 1) * box,
        y: Math.floor(Math.random() * (31 - 1) + 1) * box
      }
      
      for(let a = 0; a < block.length; a++){
        while((coordenadas.x == bombs[a].x && coordenadas.y == bombs[a].y) || (coordenadas.x == blocks[a].x && coordenadas.y == blocks[a].y)){
          coordenadas = {
            x: Math.floor(Math.random() * (31 - 1) + 1) * box,
            y: Math.floor(Math.random() * (31 - 1) + 1) * box
          }
        }
      }

      foods.push(coordenadas)
    }
  }else{
    foods[locale].x = Math.floor(Math.random() * (31 - 1)  + 1) * box
    foods[locale].y = Math.floor(Math.random() * (31 - 1) + 1) * box
  }
}

function generateBlocks() {
  blocks = []
  for (let i = 0; i < block; i++) {
    let coordenadas = {
      x: Math.floor(Math.random() * (31 - 1) + 1) * box,
      y: Math.floor(Math.random() * (31 - 1) + 1) * box
    }

    for(let bomb of bombs){
      while(coordenadas.x == bomb.x && coordenadas.y == bomb.y){
        coordenadas = {
          x: Math.floor(Math.random() * (31 - 1) + 1) * box,
          y: Math.floor(Math.random() * (31 - 1) + 1) * box
        }
      }
    }

    blocks.push(coordenadas)
  }
}

function generateBombs(locale = 'all') {
  if (locale == 'all') {
    bombs = []
    for (let i = 0; i < bomb; i++) {
      let coordenadas = {
        x: Math.floor(Math.random() * (31 - 1) + 1) * box,
        y: Math.floor(Math.random() * (31 - 1) + 1) * box
      }
      bombs.push(coordenadas)
    }
  }else{
    bombs[locale].x = Math.floor(Math.random() * (31 - 1)  + 1) * box
    bombs[locale].y = Math.floor(Math.random() * (31 - 1) + 1) * box
  }
}

function pointMinus() {
  if (score === 0) {
    return false
  }else{
    score--
    snake.pop()
    if (score >= highscore) {
      highscore = score
      localStorage.setItem('highscore', highscore)
    }
    document.getElementById('scorenow').innerHTML = score
    document.getElementById('highscore').innerHTML = highscore
    return true
  }
}

function pointPlus() {
  score++
  if (score >= highscore) {
    highscore = score
    localStorage.setItem('highscore', highscore)
  }
  document.getElementById('scorenow').innerHTML = score
  document.getElementById('highscore').innerHTML = highscore
}

function update() {
  let eat = false, position

  let snakeX = snake[0].x
  let snakeY = snake[0].y
  
  if (snakeX>30*box && direction == 'right') snakeX = 0
  else if (snakeX<1*box && direction == 'left') snakeX = 31*box
  else if (snakeY>30*box && direction == 'down') snakeY = 0
  else if (snakeY<1*box && direction == 'up') snakeY = 31*box
  
  else if (direction == 'right') snakeX += box
  else if (direction == 'left') snakeX -= box
  else if (direction == 'up') snakeY -= box
  else if (direction == 'down') snakeY += box

  for(let snk of snake){
    if(snakeX == snk.x && snakeY == snk.y){
      gameOver()
      return false
    }
  }
  
  for(let block of blocks){
    if(snakeX == block.x && snakeY == block.y){
      gameOver()
      return false
    }
  }
  
  for(let i = 0; i < bombs.length; i++){
    if(snakeX == bombs[i].x && snakeY == bombs[i].y){
      generateBombs(i)
      if (!pointMinus()){
        return gameOver()
      }
    }
  }
  
  for (let i=0; i<foods.length; i++) {
    if(snakeX == foods[i].x && snakeY == foods[i].y){
      eat = true
      position = i
    }
  }
  
  if(!eat){
    snake.pop()
  }else{
    pointPlus()
    generateFoods(position)
  }
  
  let newhead = {
    x: snakeX,
    y: snakeY
  }
  
  snake.unshift(newhead)
  
  createBG()
  createSnake()
  drawFoods()
  drawBombs()
  drawBlocks()
}

function movemobile(e) {
  let action = {
    keyCode: e.getAttribute('data-direction')
  }
  move(action)
}

function drawFoods(){
  foods.forEach(function(food){
    context.fillStyle = 'red'
    context.fillRect(food.x, food.y, box, box)
  })
}

function drawBlocks(){
  blocks.forEach(function(block){
    context.fillStyle = 'black'
    context.fillRect(block.x, block.y, box, box)
  })
}

function drawBombs(){
  bombs.forEach(function(bomb){
    context.fillStyle = 'grey'
    context.fillRect(bomb.x, bomb.y, box, box)
  })
}

function start(){
  highscore = Math.round(localStorage.getItem('highscore'))
  document.getElementById('highscore').innerHTML = highscore
  generateFoods()
  generateBombs()
  generateBlocks()
  createBG()
  createSnake()
}

function pausar(){
  document.getElementById('pause').style.display = 'none'
  document.getElementById('play').style.display = 'block'
  game = 'pause'
  clearInterval(jogo)
}

function iniciar(){
  document.getElementById('play').style.display = 'none'
  document.getElementById('pause').style.display = 'block'
  game = 'play'
  jogo = setInterval(update, time)
}

function gameOver() {
  alert('Você perdeu!')
  pausar()
  snake = [{x: 16 * box,y: 16 * box}]
  score = 0
  document.getElementById('scorenow').innerHTML = 0
  generateFoods()
  generateBlocks()
  generateBombs()
  createBG()
  createSnake()
}

function clearActives(){
  let menu = document.querySelectorAll('.diff')
  for (let item of menu){
    item.classList.remove('active')
  }
}

function setDifficulty(interval){
  switch (interval) {
    case 50:
      clearActives()
      document.querySelector('#diff-md').classList.add('active')
      break
    case 100:
      clearActives()
      document.querySelector('#diff-d').classList.add('active')
      break
    case 150:
      clearActives()
      document.querySelector('#diff-m').classList.add('active')
      break
    case 200:
      clearActives()
      document.querySelector('#diff-f').classList.add('active')
      break
    case 300:
      clearActives()
      document.querySelector('#diff-mf').classList.add('active')
      break
    default:
      return false
  }
  time = interval
  localStorage.setItem('difficulty', interval)
  if (game === 'play'){
    clearInterval(jogo)
    jogo = setInterval(update, time)
  }
  dpd++
  hideDropdown()
}

function showDropdown(click = false){
  let dropdown = document.querySelector('.dropdown-child')
  if (dropdown.style.display === 'block' && click && ((dpd % 2 === 0 && dpd > 3 ) || dpd === 3)) {
    dropdown.style.display = 'none'
  }else {
    dropdown.style.display = 'block'
    dpd++
  }
}

function hideDropdown(){
  let dropdown = document.querySelector('.dropdown-child')
  dropdown.style.display = 'none'
}

(
  function (){
    let difficulty = parseInt(localStorage.getItem('difficulty'))
    if(!difficulty) difficulty = 200
    setDifficulty(difficulty)
  }
)();

start()

document.getElementById('help').addEventListener('click', function(){
  document.getElementById('helper').style.display = 'block'
})

function closeHelp(){
  document.getElementById('helper').style.display = 'none'
}