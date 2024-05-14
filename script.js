const GameBoard = (() => {
    let gameBoardArray = Array(9).fill('')

    const setTile = (index, tile) => {
        gameBoardArray[index] = tile
    }

    const getTile = (index) => {
        return gameBoardArray[index]
    }

    const condenseTiles = (tile) => {
        let condensedArray = []
        for (let i = 0; i < 9; i++) {
            if (getTile(i) === tile) {
                condensedArray.push(i)
            }
        }
        return condensedArray
    }

    return {setTile, getTile, condenseTiles}
})()

const DisplayControl = (() => {
    const gridFull = document.querySelector('.grid')
    const gridItems = document.querySelectorAll('.grid > div')
    const guideText = document.querySelector('.guide-text > p')
    const resetButton = document.querySelector('.reset-button')
    const XScore = document.querySelector('#x-score')
    const OScore = document.querySelector('#o-score')

    gridFull.classList.add('grid-blue')
    gridItems.forEach((item) => item.classList.add('grid-blue'))

    gridItems.forEach((item) => item.addEventListener('click', (e) => {
        if (e.target.textContent !== "" || GameControl.isGameOver()) return
        GameControl.inputTile(e.target.dataset.index)
    }))

    const displayTiles = () => {
        for (let i = 0; i <9; i++) {
            let targetDiv = gridItems[i]
            targetDiv.textContent = GameBoard.getTile(i)
        }
    }

    const guideTextControl = (tile) => {
        if (tile == "X") {
            gridColorSwitch("X")
            guideText.textContent = `X WINS!`
        } else if (tile == "O") {
            gridColorSwitch("O")
            guideText.textContent = `O WINS!`
        } else if (tile == "!") {
            gridColorSwitch("!")
            guideText.textContent = "TIE!"
        } else {
            gridColorSwitch()
            guideText.textContent = `${GameControl.getCurrentTile()}'s Turn`
        }
    }

    const clearTiles = () => {
        for (let i = 0; i < 9; i++) {
            GameBoard.setTile(i, "")
        }
        gridItems.forEach((item) => {
            item.classList.remove('background-blue')
            item.classList.remove('background-pink')
        })
        displayTiles()
        guideTextControl("")
        GameControl.setGameStatus(false)
    }

    const updateScores = () => {
        XScore.textContent = GameControl.getScore("X")
        OScore.textContent = GameControl.getScore("O")
    }

    const blueGrid = () => {
        gridFull.classList.add('grid-blue')
        gridFull.classList.remove('grid-pink')
        gridFull.classList.remove('grid-white')
        gridItems.forEach((item) => {
            item.classList.add('grid-blue')
            item.classList.remove('grid-pink')
            item.classList.remove('grid-white')
        })
    }

    const pinkGrid = () => {
        gridFull.classList.add('grid-pink')
        gridFull.classList.remove('grid-blue')
        gridFull.classList.remove('grid-white')
        gridItems.forEach((item) => {
            item.classList.add('grid-pink')
            item.classList.remove('grid-blue')
            item.classList.remove('grid-white')
        })
    }

    const whiteGrid = () => {
        gridFull.classList.remove('grid-blue')
        gridFull.classList.remove('grid-pink')
        gridFull.classList.add('grid-white')
        gridItems.forEach((item) => {
            item.classList.add('grid-white')
            item.classList.remove('grid-blue')
            item.classList.remove('grid-pink')
        })
    }

    const gridColorSwitch = (color) => {
        if ((color == undefined && GameControl.getCurrentTile() == "O") || color == "O") {
            pinkGrid()
        } else if ((color == undefined && GameControl.getCurrentTile() == "X") || color == "X"){
            blueGrid()
        } else if (color == "!") {
            whiteGrid()
        }
    }

    const winBackground = (array, color) => {
        if (color == 'blue') {
            for (let i = 0; i < 3; i++) {
                gridItems[array[i]].classList.add('background-blue')
            }
        } else {
            for (let i = 0; i < 3; i++) {
                gridItems[array[i]].classList.add('background-pink')
            }
        }
    }

    resetButton.addEventListener('click', clearTiles)

    return {displayTiles, guideTextControl, updateScores, winBackground}
})()

const GameControl = (() => {
    const playerX = Player("X")
    const playerO = Player("O")

    let currentTile = playerX.playerTile
    let gameOver = false

    let winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const getCurrentTile = () => {
        return currentTile
    }

    const isGameOver = () => {
        return gameOver
    }

    const setGameStatus = (status) => {
        gameOver = status
    }

    const getScore = (tile) => {
        if (tile == "X") {
            return playerX.getPlayerScore()
        } else {
            return playerO.getPlayerScore()
        }
    }

    const winCheck = () => {
        let currentX = GameBoard.condenseTiles('X')
        let currentO = GameBoard.condenseTiles('O')
        let check = (a, t) => {return t.every(e => a.includes(e))}
        for (let i = 0; i < 8; i++) {
            DisplayControl.guideTextControl("!")
            if (check(currentX, winningCombos[i])) {
                gameOver = true
                DisplayControl.guideTextControl("X")
                playerX.playerWin()
                DisplayControl.updateScores()
                DisplayControl.winBackground(winningCombos[i], 'blue')
                break
            } else if (check(currentO, winningCombos[i])) {
                gameOver = true
                DisplayControl.guideTextControl("O")
                playerO.playerWin()
                DisplayControl.updateScores()
                DisplayControl.winBackground(winningCombos[i], 'pink')
                break
            } else if ((currentX.length + currentO.length == 9) && (!check(currentX, winningCombos[i])) && (!check(currentO, winningCombos[i]))) {
                gameOver = true
                DisplayControl.guideTextControl("!")
            } else {
                DisplayControl.guideTextControl("")
            }
        }
    }

    const tileSwitch = () => {
        if (currentTile === "X") {
            currentTile = playerO.playerTile
        } else {
            currentTile = playerX.playerTile
        }
    }

    const inputTile = (index) => {
        GameBoard.setTile(index, currentTile)
        DisplayControl.displayTiles()
        tileSwitch()
        winCheck()
    }

    return {getCurrentTile, tileSwitch, setGameStatus, getScore, inputTile, isGameOver}
})()

function Player(tile) {
    const playerTile = tile
    let playerScore = 0

    const playerWin = () => {playerScore += 1}

    const getPlayerScore = () => {
        return playerScore
    }

    return {playerTile, getPlayerScore, playerWin}
}