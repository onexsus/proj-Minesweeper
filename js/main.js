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
const MINE_IMG= '<img src="img/mine.png">'
const FLAG_IMG= '<img src="img/flag.png">'

var gBoard


function onInit() {
  buildBoard()
  console.table(gBoard)
  renderBoard(gBoard)
  
}

function renderBoard(board){
  var strHTML=''

  for(let i=0;i<board.length;i++){
    strHTML += "<tr>\n";
    for(let j=0;j<board[i].length;j++){
      const currCell= board[i][j]
      var cellClass='cell '
      if(currCell.isShown===false) cellClass+=' hide'
      strHTML += `\t<td 
      data-i="${i}" data-j="${j}" 
      class="${cellClass}" onclick="onCellClicked(this, ${i}, ${j}) ">`;
      if(currCell.isMine===true) strHTML+= MINE_IMG
      if(currCell.isMarked===true) strHTML+=FLAG_IMG
      strHTML += "</td>\n";
    }
    strHTML += "</tr>\n";
  }
  console.log(strHTML)
  const elBoard= document.querySelector('board')
  console.log(elBoard)
  elBoard.innerHTML = strHTML

}

function buildBoard() {
  gBoard=createBoard(gBeginner.SIZE,gBeginner.SIZE)
  setMines(gBeginner)
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