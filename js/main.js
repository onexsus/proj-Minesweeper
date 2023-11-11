'use strict'
const gBeginner={
  SIZE:4,
  MINES:2
}
const Medium={
  SIZE:8,
  MINES:14
}
const Expert={
  SIZE:12,
  MINES:32
}
const MINE_IMG= '<img class="img-size" src="img/mine.png">'
const FLAG_IMG= '<img class="img-size" src="img/flag.png">'

const effectStartGame=new Audio('sounds/start.mp3')
const effectBoom=new Audio('sounds/boom.mp3')
const effectLose=new Audio('sounds/lose.mp3')
const effectWin=new Audio('sounds/win3.mp3')
const effectFlag=new Audio('sounds/flag.mp3')
const effectClick=new Audio('sounds/click.mp3')

var gBoard
var gGame
var gLevel=gBeginner
var gStartTime
var gTimeInterval
var firstClick
var showCells
var gameStatus
var min
var LIVES
var usedLives


function onInit() {
  stopTimer()
  document.querySelector('.sec').innerText ='00'
  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
   }
   LIVES=3
   usedLives=0
   gameStatus='😊'
   showCells=(gLevel.SIZE*gLevel.SIZE)-gLevel.MINES
   gBoard=createBoard( gLevel.SIZE,gLevel.SIZE)
   firstClick=true
   // console.table(gBoard)
   renderBoard(gBoard)
   
   
  }
  function play(){
  effectStartGame.play()
  buildBoard()
  renderBoard(gBoard)
}

function btnGameLevel(level){
  if(level===1) gLevel=gBeginner 
  if(level===2) gLevel=Medium
  if(level===3) gLevel=Expert
  stopTimer() 
  onInit()
}

function renderBoard(board){
  var strHTML=''

  for(let i=0;i<board.length;i++){
    strHTML += "<tr>\n";
    for(let j=0;j<board[i].length;j++){
      const currCell= board[i][j]
      var cellClass='cell'
      var num=''
      if(currCell.minesAroundCount!==0 && currCell.isShown!==false){
        num=currCell.minesAroundCount
        cellClass+=addColor(num)
      }
      if(currCell.isShown===false) cellClass+=' show'
      strHTML += `\t<td 
      data-i="${i}" data-j="${j}" 
      class="${cellClass}" onclick="onCellClicked(this, ${i}, ${j}) "">${num} `;
      if(currCell.isMine===true && currCell.isShown ===true ){
        strHTML+= MINE_IMG
      } 
      if(currCell.isMarked===true && currCell.isShown===false ) strHTML+=FLAG_IMG
      strHTML += "</td>\n";
    }
    strHTML += "</tr>\n";
  }
  // console.log(strHTML)
  const elBoard= document.querySelector('.board')
  // console.log(elBoard)
  elBoard.innerHTML = strHTML
  const elCells=document.querySelectorAll('td')
  // console.log(elCells.length)
  for(let i=0;i<elCells.length;i++){
    elCells[i].addEventListener('contextmenu', event => {
      event.preventDefault() ,onCellMarked(elCells[i])});
  }
  const elMarked=document.querySelector('.marked')
  elMarked.innerText=gGame.markedCount

  const elScore= document.querySelector('.score')
  elScore.innerText=gGame.shownCount
  const elBtnGame=document.querySelector('.btn-game')
  elBtnGame.innerHTML=gameStatus
  const elLives=document.querySelector('.lives')
  elLives.innerHTML=`${LIVES} LIVES LEFT`
  // console.log(elBoard)
  addColor(gBoard)

}

function addColor(num){
  var str=' '
  switch (num) {
    case 1: str=' num-1'
      
      break;
    case 2: str=' num-2'
      
      break; 
    case 3: str=' num-3'
      
      break;
    case 4: str=' num-4'
      
      break;
    case 5: str=' num-5'
      
      break;
    case 6: str=' num-6'
      
      break;
    case 7: str=' num-7'
      
      break;
    case 8: str=' num-8'
      
      break;
 }
 return str
}

function expandShown(board,idxI,idxJ){
  for(let i=idxI-1;i<=idxI+1;i++){
    if (i < 0 || i > board.length - 1) continue
    for (let j = idxJ - 1; j <= idxJ + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue
      if (i === idxI && j === idxJ) continue
      const currCell=board[i][j]
      if(currCell.isMarked===true || currCell.isMine===true) continue
      if(currCell.isShown===false){
        board[i][j].isShown=true
        gGame.shownCount++
      }else continue
      if(currCell.minesAroundCount===0){
        const negCells=nearbyCells(board,i,j)
        for(let c=0;c<negCells.length;c++){
          expandShown(board,negCells[c].i,negCells[c].j)
        }
      } 
        }
  }
return
}

function nearbyCells(board,idxI,idxJ){
  var nearbyCells=[]
  if(board[idxI][idxJ].minesAroundCount!==0)return
  for (let i = idxI - 1; i <= idxI + 1; i++) {
    if (i < 0 || i > board.length - 1) continue
    for (let j = idxJ - 1; j <= idxJ + 1; j++) {
        if (j < 0 || j > board[0].length - 1) continue
        if (i === idxI && j === idxJ) continue
        const currCell=board[i][j]
        if(currCell.isMarked===false && currCell.isMine===false){
          const cords={i:i,j:j}
          nearbyCells.push(cords)
        }
        }
  }
  // console.log(nearbyCells)
  return nearbyCells
}


function onCellMarked(elCell) {
  // console.log(elCell)
  var i= +elCell.getAttribute('data-i')
  var j= +elCell.getAttribute('data-j')
  // console.log(i+j)
  if(gGame.isOn===false) return
  if(gBoard[i][j].isShown===true )return
  effectFlag.play()
  if(gBoard[i][j].isMarked===false){
    gBoard[i][j].isMarked=true
    gGame.markedCount++
  }else{
    gBoard[i][j].isMarked=false
    gGame.markedCount--
  }
  if(showCells===gGame.shownCount-usedLives && gGame.markedCount+usedLives===gLevel.MINES){
    gGame.isOn=false
    winGame()
  }
  renderBoard(gBoard)
  
}

function winGame(){
  gameStatus='🥇'
  effectWin.play()
  stopTimer()
  // alert('You Won good job...😇')
}
function loseGame(){
  gameStatus='💥'
  effectLose.play()
  stopTimer()
  // alert('You lose try again...😇')
  renderBoard(gBoard)
}

function onCellClicked(elCell, i, j) {
  // console.log(event.button)
  effectClick.play()
  if(firstClick===true){
    gBoard[i][j].isShown=true
    gGame.shownCount++
    firstClick=false
    play()
    startTimer()
  }
    var currCell=gBoard[i][j]
    if(gGame.isOn===false) return
    if(currCell.isMarked===true)return
    if(currCell.isShown===false){
      gBoard[i][j].isShown=true
      gGame.shownCount++
    }
    if(currCell.isMine===true){
      effectBoom.play()
      LIVES--
      usedLives++
      if(usedLives===3||gLevel.MINES===usedLives ){
        gBoard[i][j].isShown=true
        gGame.isOn=false
        loseGame()
        return
      }
    }
    if(showCells===gGame.shownCount-usedLives &&
       gGame.markedCount+usedLives===gLevel.MINES){
      gGame.isOn=false
      winGame()
    }
    expandShown(gBoard,i,j)
    renderBoard(gBoard) 
  
}

function buildBoard() {
  // gBoard=createBoard(gBeginner.SIZE,gBeginner.SIZE)
  setMines(gLevel)
  setMinesNegsCount(gBoard)
  return gBoard
}

function setMines(gLevel){
  for(let i=0;i<gLevel.MINES;i++){ 
    var ranMineIdx=getRandomEmptyCellPosition(gBoard)
    console.log(ranMineIdx)
    gBoard[ranMineIdx.i][ranMineIdx.j].isMine=true
    console.log(gBoard[ranMineIdx.i][ranMineIdx.j])
  }
  return
}

function getRandomEmptyCellPosition(board) {
  var emptyCells = []
  for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
          const cell = board[i][j]
          // console.log(cell)
          if (cell.isMine=== false && 
            cell.isShown===false) {
              emptyCells.push({ i, j })
            }
          }
        }
        // console.log(emptyCells)

  if(!emptyCells.length) return null

  const randIdx = getRandomInt(0, emptyCells.length)
  return emptyCells[randIdx]
}

function setMinesNegsCount(board){
  for(let i=0;i<board.length;i++){
    for(let j=0;j<board[i].length;j++){
      var cell=board[i][j]
      if(cell.isMine !== true ){
        cell.minesAroundCount=getMinesNegsCount(board,i,j)
      }
    }
  }
  
}

function getMinesNegsCount(board,idxI,idxJ){
  var countMinesNegs=0
  for (let i = idxI - 1; i <= idxI + 1; i++) {
    if (i < 0 || i > board.length - 1) continue
    for (let j = idxJ - 1; j <= idxJ + 1; j++) {
      
      if (j < 0 || j > board[0].length - 1) continue
      if (i === idxI && j === idxJ) continue
      if (board[i][j].isMine === true) countMinesNegs++
    }
  }
  
  return countMinesNegs;
  
}

function createBoard(ROWS, COLS) {
  const board = []
  
  
  for (var i = 0; i < ROWS; i++) {
    const row = []
    for (var j = 0; j < COLS; j++) {
      var cell= {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
      }
      row.push(cell)
    }
    board.push(row)
  }
  return board
}

function updateTimer() {
  const currentTime = new Date().getTime()
  var elapsedTime = (currentTime - gStartTime) / 1000
  document.querySelector('.sec').innerText = elapsedTime.toFixed(2)
}

function startTimer() {
  gStartTime = new Date().getTime()
  min=0
  gTimeInterval = setInterval(updateTimer, 37)
}

function stopTimer() {
  clearInterval(gTimeInterval)
}
