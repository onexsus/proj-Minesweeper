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

var gBoard
var gGame
 var marked


function onInit() {
  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
   }
   marked=0
  gBoard=createBoard(gBeginner.SIZE,gBeginner.SIZE)
  console.table(gBoard)
  renderBoard(gBoard)
  buildBoard()
  renderBoard(gBoard)
  
}

function renderBoard(board){
  var strHTML=''

  for(let i=0;i<board.length;i++){
    strHTML += "<tr>\n";
    for(let j=0;j<board[i].length;j++){
      const currCell= board[i][j]
      var num=''
      if(currCell.minesAroundCount!==0 && currCell.isShown!==false){
        num=currCell.minesAroundCount
      }
      var cellClass='cell'
      if(currCell.isShown===false) cellClass+=' show'
      strHTML += `\t<td 
      data-i="${i}" data-j="${j}" 
      class="${cellClass}" onclick="onCellClicked(this, ${i}, ${j}) "">${num} `;
      if(currCell.isMine===true && currCell.isShown ===true ){
        strHTML+= MINE_IMG
      } 
      if(currCell.isMarked===true && currCell.isMine===false) strHTML+=FLAG_IMG
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
  elMarked.innerText=marked
  
  // console.log(elBoard)

}
function onCellMarked(elCell) {
  // console.log(elCell)
  var i= +elCell.getAttribute('data-i')
  var j= +elCell.getAttribute('data-j')
  // console.log(i+j)
  if(gBoard[i][j].isMarked===false){
    gBoard[i][j].isMarked=true
    marked++
  }else{
    gBoard[i][j].isMarked=false
    marked--
  }
  renderBoard(gBoard)

}

function onCellClicked(elCell, i, j) {
  // console.log(event.button)
  var currCell=gBoard[i][j]
  if(gGame.isOn===false) return
  if(currCell.isShown===false){
    gBoard[i][j].isShown=true
  }
  if(currCell.isMine===true){
    gGame.isOn=false
  }
  renderBoard(gBoard)
  console.log(gBoard)
  console.log(elCell,i,j)
}

function buildBoard() {
  // gBoard=createBoard(gBeginner.SIZE,gBeginner.SIZE)
  setMines(gBeginner)
  setMinesNegsCount(gBoard)
  return gBoard
}

function setMines(gLevel){
  for(let i=0;i<gLevel.MINES;i++){ 
    var ranMineIdx=getRandomEmptyCellPosition(gBoard)
    // console.log(ranMineIdx)
    gBoard[ranMineIdx.i][ranMineIdx.j].isMine=true
    // console.log(gBoard[ranMineIdx.i][ranMineIdx.j])
  }
  return
}

function setMinesNegsCount(board){
  for(let i=0;i<board.length;i++){
    for(let j=0;j<board[i].length;j++){
      var cell=board[i][j]
      if(cell.isMine !== true){
        cell.minesAroundCount=getMinesNegsCount(board,i,j)
      }
    }
  }

}

function getMinesNegsCount(board,idxI,idxJ){
  var countMinesNegs=0
  for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {

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