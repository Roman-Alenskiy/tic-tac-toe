// Player factory
const Player = function(name, symbol) {
    const getName = () => name
    const getSymbol = () => symbol
    return {
        getName,
        getSymbol
    }
}
const player1 = Player('Player1 (X)', 'X')
const player2 = Player('Player2 (O)', 'O')

// Game board module
const gameBoard = (function() {
    let board = ['','','','','','','','','']
    const get = () => board
    const addSymbol = function(index) {
        board[index] = gameController.getActivePlayer().getSymbol()
    }
    const clear = () => {board = ['','','','','','','','','']}
    return {
        get,
        addSymbol,
        clear
    }
})()

// Content display controller module
const displayController = (function() {
    const drawBoard = function() {
        gameBoard.get().forEach(function(value, index) {
            let currentCell = document.querySelector(`.cell[data-cellindex="${index}"`)
            currentCell.innerHTML = value
        })
    }
    const inputHandler = function(cell) {
        if (cell.target.innerHTML !== '') return
        if (!gameController.gameIsOn()) return
        gameBoard.addSymbol(cell.target.getAttribute('data-cellindex'))
        drawBoard()
        gameController.winCheck()
        gameController.changeActivePlayer()
    }
    return {
        drawBoard,
        inputHandler
    }
})()

// Game controller module
const gameController = (function() {
    let activePlayer = player1
    let gameOn = true
    const getActivePlayer = () => activePlayer
    const gameIsOn = () => gameOn
    const gameStop = () => {gameOn = false}
    const gameStart = () => {gameOn = true}
    const changeActivePlayer = function() {
        if (activePlayer === player1) {
            activePlayer = player2
        } else {
            activePlayer = player1
        }
    }
    const winCheck = function() {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7 ,8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        winConditions.forEach(function(condition) {
            if (gameBoard.get()[condition[0]] === activePlayer.getSymbol() && 
                gameBoard.get()[condition[1]] === activePlayer.getSymbol() && 
                gameBoard.get()[condition[2]] === activePlayer.getSymbol()
            ) {
                gameStop()
                alert(activePlayer.getName() + ' win!')
            }
        })
    }
    const restart = function() {
        gameBoard.clear()
        displayController.drawBoard()
        gameStart()
    }
    return {
        getActivePlayer,
        changeActivePlayer,
        winCheck,
        gameIsOn,
        restart
    }
})()

// Event listeners
const cells = document.querySelectorAll('.board-cell')
cells.forEach(function(cell) {
    cell.addEventListener('mousedown', displayController.inputHandler)
})

const restartButton = document.querySelector('#restart')
restartButton.addEventListener('mousedown', gameController.restart)