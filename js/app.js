// Player factory
const Player = function(name, symbol) {
    let score = 0
    const isAI = () => false
    const getName = () => name
    const getSymbol = () => symbol
    const getScore = () => score
    const increaseScore = () => {++score}
    const resetScore = () => {score = 0}
    return {
        isAI,
        getName,
        getSymbol,
        getScore,
        increaseScore,
        resetScore
    }
}

// AI factory
const AI = function(name, symbol) {
    const isAI = () => true
    const move = function() {
       setTimeout(() => {
            let emptyCells = []
            gameBoard.get().forEach(function(cell, index) {
                if (cell === '') {emptyCells.push(index)}
            })
            gameBoard.addSymbol(emptyCells[Math.floor(Math.random() * emptyCells.length)])
            gameController.inputHandler()
       }, 300) 
    }
    return Object.assign(
        {},
        Player(name, symbol),
        {
            isAI,
            move
        }
    )
}

//Player creation
let player1 = Player('Player1 (X)', 'X')
let player2 = AI('PlayerAI (O)', 'O')

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
    const displayScore = function() {
        if (gameController.getActivePlayer().getName() === player1.getName()) {
            document.querySelector('#player1-score').innerHTML = gameController.getActivePlayer().getScore()
        } else {
            document.querySelector('#player2-score').innerHTML = gameController.getActivePlayer().getScore()
        }
    }
    const resetScore = function() {
        document.querySelector('#player1-score').innerHTML = document.querySelector('#player2-score').innerHTML = '0'
    }
    return {
        drawBoard,
        displayScore,
        resetScore,
    }
})()

// Game controller module
const gameController = (function() {
    let activePlayer = player1
    let stepCounter = 0
    const inputHandler = function(cell) {
        if (!activePlayer.isAI()) {
            if (cell.target.innerHTML !== '') return
            gameBoard.addSymbol(cell.target.getAttribute('data-cellindex'))
        }
        displayController.drawBoard()
        if (isWin()) {
            activePlayer.increaseScore()
            displayController.displayScore()
            alert(activePlayer.getName() + ' win!')
            newRound()
            return
        }
        if (isDraw()) {
            alert('Draw!')
            newRound()
            return
        }
        changeActivePlayer()
    }
    const getActivePlayer = () => activePlayer
    const changeActivePlayer = function() {
        if (activePlayer === player1) {
            activePlayer = player2
        } else {
            activePlayer = player1
        }
        if (activePlayer.isAI()) {
            activePlayer.move()
        }
    }
    const changeGameMode = function() {
        if (gameMode.value === 'PvP') {
            player2 = Player('Player2 (O)', 'O')
        } else {
            player2 = AI('PlayerAI (O)', 'O')
        }
        document.querySelector('#player2-header').innerHTML = player2.getName()
        restart()
    }
    const newRound = function() {
        stepCounter = 0
        gameBoard.clear()
        displayController.drawBoard()
        activePlayer = player1
    }
    const isWin = function() {
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
        let win = false
        winConditions.forEach(function(condition) {
            if (gameBoard.get()[condition[0]] === activePlayer.getSymbol() && 
                gameBoard.get()[condition[1]] === activePlayer.getSymbol() && 
                gameBoard.get()[condition[2]] === activePlayer.getSymbol()
            ) {
                win = true
            }
        })
        return win
    }
    const isDraw = function() {
        ++stepCounter
        if (stepCounter === 9) {
            return true
        }
        return false
    }
    const restart = function() {
        newRound()
        displayController.resetScore()
        player1.resetScore()
        player2.resetScore()
    }
    return {
        inputHandler,
        getActivePlayer,
        changeGameMode,
        restart
    }
})()

// Event listeners
const cells = document.querySelectorAll('.board-cell')
cells.forEach(function(cell) {
    cell.addEventListener('mousedown', gameController.inputHandler)
})

const restartButton = document.querySelector('#restart')
restartButton.addEventListener('mousedown', gameController.restart)

const gameMode = document.querySelector('#game-mode')
gameMode.addEventListener('change', gameController.changeGameMode)  