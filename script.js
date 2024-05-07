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
    const gridItems = document.querySelectorAll('.grid > div')
    const guideText = document.querySelector('.guide-text > p')
    const resetButton = document.querySelector('.reset-button')
    const XScore = document.querySelector('#x-score')
    const OScore = document.querySelector('#o-score')

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
            guideText.textContent = `X WINS!`
        } else if (tile == "O") {
            guideText.textContent = `O WINS!`
        } else if (tile == "!") {
            guideText.textContent = "TIE!"
        } else {
            guideText.textContent = `${GameControl.getCurrentTile()}'s Turn`
        }
    }

    const clearTiles = () => {
        for (let i = 0; i < 9; i++) {
            GameBoard.setTile(i, "")
        }
        displayTiles()
        guideTextControl("")
        GameControl.setGameStatus(false)
    }

    const updateScores = () => {
        XScore.textContent = GameControl.getScore("X")
        OScore.textContent = GameControl.getScore("O")
    }

    resetButton.addEventListener('click', clearTiles)

    return {displayTiles, guideTextControl, updateScores}
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
                break
            } else if (check(currentO, winningCombos[i])) {
                gameOver = true
                DisplayControl.guideTextControl("O")
                playerO.playerWin()
                DisplayControl.updateScores()
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

    return {getCurrentTile, tileSwitch, setGameStatus,getScore, inputTile, isGameOver}
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