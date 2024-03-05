const GameBoard = (() => {
    let gameBoardArray = Array(9).fill('')

    const setTile = (index, tile) => {
        gameBoardArray[index] = tile
    }

    const getTile = (index) => {
        return gameBoardArray[index]
    }
})()

const DisplayControl = (() => {
    const gridItems = document.querySelectorAll('.grid div')
    const guideText = document.querySelector('.guide-text')
    const resetButton = document.querySelector('.reset-button')
})()

const GameControl = (() => {
    const playerX = Player("X")
    const playerO = Player("O")

    let currentTile = playerX.playerTile

    const tileSwitch = () => {
        if (currentTile === "X") {
            currentTile = playerO.playerTile
        } else {
            currentTile = playerX.playerTile
        }
    }

    return {tileSwitch, currentTile}
})()

function Player(tile) {
    const playerTile = tile
    let playerScore = 0

    const playerWin = () => {playerScore += 1}

    return {playerTile, playerScore, playerWin}
}