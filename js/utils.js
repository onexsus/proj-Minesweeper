'use strict'

function createMat(ROWS, COLS) {
    const mat = []

    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}


function getRandomEmptyCellPosition(board) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            // console.log(cell)
            if (cell.isMine=== false) {
                emptyCells.push({ i, j })
              }
            }
          }
          // console.log(emptyCells)

    if(!emptyCells.length) return null

    const randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]
}





function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

// function makeId(length = 6) {
// 	var txt = ''
// 	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

// 	for (var i = 0; i < length; i++) {
// 		txt += possible.charAt(Math.floor(Math.random() * possible.length))
// 	}

// 	return txt
// }