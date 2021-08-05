let canvas = document.getElementById('snake');
let context = canvas.getContext('2d');
let box = 16, snake = [{x: 16 * box,y: 16 * box}], direction = 'right';
let jogo, foods = [], score = 0, food = 5, highscore = 0, blocks = [], block = 2, bombs =[], bomb = 5;

function createBG(){
    context.fillStyle = 'lightgreen';
    context.fillRect(0, 0, 32*box, 32*box);
}

function createSnake (){
  for(i = 0; i < snake.length; i++){
    context.fillStyle = 'green';
    context.fillRect(snake[i].x, snake[i].y, box, box);
  }
}

document.addEventListener('keydown', move);

function move(event) {
  if(event.keyCode == 37 && direction != 'right') direction = 'left';
  if(event.keyCode == 38 && direction != 'down') direction = 'up';
  if(event.keyCode == 39 && direction != 'left') direction = 'right';
  if(event.keyCode == 40 && direction != 'up') direction = 'down';
}

function generateFoods(locale = 'all') {
  if (locale == 'all') {
    foods = [];
    for (var i = 0; i < food; i++) {
      var coordenadas = {
        x: Math.floor(Math.random() * (31 - 1) + 1) * box,
        y: Math.floor(Math.random() * (31 - 1) + 1) * box
      };
      foods.push(coordenadas);
    }
  }else{
    foods[locale].x = Math.floor(Math.random() * (31 - 1)  + 1) * box;
    foods[locale].y = Math.floor(Math.random() * (31 - 1) + 1) * box;
  }
}

function generateBlocks() {
  blocks = [];
  for (var i = 0; i < block; i++) {
    var coordenadas = {
      x: Math.floor(Math.random() * (31 - 1) + 1) * box,
      y: Math.floor(Math.random() * (31 - 1) + 1) * box
    };
    blocks.push(coordenadas);
  }
}

function generateBombs(locale = 'all') {
  if (locale == 'all') {
    bombs = [];
    for (var i = 0; i < bomb; i++) {
      var coordenadas = {
        x: Math.floor(Math.random() * (31 - 1) + 1) * box,
        y: Math.floor(Math.random() * (31 - 1) + 1) * box
      };
      bombs.push(coordenadas);
    }
  }else{
    bombs[locale].x = Math.floor(Math.random() * (31 - 1)  + 1) * box;
    bombs[locale].y = Math.floor(Math.random() * (31 - 1) + 1) * box;
  }
}

function pointMinus() {
  if (score === 0) {
    return false;
  }else{
    score--;
    snake.pop();
    if (score >= highscore) {
      highscore = score;
      localStorage.setItem('highscore', highscore);
    }
    document.getElementById('scorenow').innerHTML = score;
    document.getElementById('highscore').innerHTML = highscore;
    return true;
  }
}

function pointPlus() {
  score++;
  if (score >= highscore) {
    highscore = score;
    localStorage.setItem('highscore', highscore);
  }
  document.getElementById('scorenow').innerHTML = score;
  document.getElementById('highscore').innerHTML = highscore;
}

function update() {
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  
  if (snakeX>30*box && direction == 'right') {snakeX = 0;}
  else if (snakeX<1*box && direction == 'left') {snakeX = 31*box;}
  else if (snakeY>30*box && direction == 'down') {snakeY = 0;}
  else if (snakeY<1*box && direction == 'up') {snakeY = 31*box;}
  
  else if (direction == 'right') snakeX += box;
  else if (direction == 'left') snakeX -= box;
  else if (direction == 'up') snakeY -= box;
  else if (direction == 'down') snakeY += box;

  for(i = 1; i < snake.length; i++){
    if(snakeX == snake[i].x && snakeY == snake[i].y){
      gameOver();
      return false;
    }
  }
  
  for(i = 0; i < blocks.length; i++){
    if(snakeX == blocks[i].x && snakeY == blocks[i].y){
      gameOver();
      return false;
    }
  }
  
  for(i = 0; i < bombs.length; i++){
    if(snakeX == bombs[i].x && snakeY == bombs[i].y){
      generateBombs(i);
      if (!pointMinus()){
        return gameOver();;
      }
    }
  }
  
  var eat = false, position;
  
  for (var i=0;i<foods.length; i++) {
    if(snakeX == foods[i].x && snakeY == foods[i].y){
      eat = true;
      position = i;
    }
  }
  
  if(!eat){
    snake.pop();
  }else{
    pointPlus();
    generateFoods(position);
  }
  
  let newhead = {
    x: snakeX,
    y: snakeY
  }
  
  snake.unshift(newhead);
  
  createBG();
  createSnake();
  drawFoods();
  drawBombs();
  drawBlocks();
}

function movemobile(element) {
  let action = {
    keyCode: element.getAttribute('data-direction')
  };
  move(action);
}

function drawFoods(){
  foods.forEach(function(food){
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, box, box);
  });
}

function drawBlocks(){
  blocks.forEach(function(block){
    context.fillStyle = 'black';
    context.fillRect(block.x, block.y, box, box);
  });
}

function drawBombs(){
  bombs.forEach(function(bomb){
    context.fillStyle = 'grey';
    context.fillRect(bomb.x, bomb.y, box, box);
  });
}

function start(){
  highscore = Math.round(localStorage.getItem('highscore'));
  document.getElementById('highscore').innerHTML = highscore;
  generateFoods();
  generateBombs();
  generateBlocks();
  createBG();
  createSnake();
}

function pausar(){
  document.getElementById('pause').style.display = 'none';
  document.getElementById('play').style.display = 'block';
  clearInterval(jogo);
}

function iniciar(){
  document.getElementById('play').style.display = 'none';
  document.getElementById('pause').style.display = 'block';
  jogo = setInterval(update, 200);
}

function gameOver() {
  alert('Você perdeu!');
  pausar();
  snake = [{x: 16 * box,y: 16 * box}];
  score = 0;
  document.getElementById('scorenow').innerHTML = 0;
  generateFoods();
  generateBlocks();
  generateBombs();
  createBG();
  createSnake();
}

start();

document.getElementById('help').addEventListener('click', function(){
  document.getElementById('helper').style.display = 'block';
});

function closeHelp(){
  document.getElementById('helper').style.display = 'none';
}