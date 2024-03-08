const GameBoard = (() => {
    let gameBoardArray = Array(9).fill('')

    const setTile = (index, tile) => {
        gameBoardArray[index] = tile
        console.log(gameBoardArray)
    }

    const getTile = (index) => {
        return gameBoardArray[index]
    }

    return {setTile, getTile}
})()

const DisplayControl = (() => {
    const gridItems = document.querySelectorAll('.grid > div')
    const guideText = document.querySelector('.guide-text')
    const resetButton = document.querySelector('.reset-button')

    gridItems.forEach((item) => item.addEventListener('click', (e) => {
        GameControl.inputTile(e.target.dataset.index)
    }))

    const displayTiles = () => {
        for (let i = 0; i <9; i++) {
            let targetDiv = gridItems[i]
            targetDiv.textContent = GameBoard.getTile(i)
        }
    }

    return {displayTiles}
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

    const inputTile = (index) => {
        GameBoard.setTile(index, currentTile)
        DisplayControl.displayTiles()
        tileSwitch()
    }

    return {tileSwitch, currentTile, inputTile}
})()

function Player(tile) {
    const playerTile = tile
    let playerScore = 0

    const playerWin = () => {playerScore += 1}

    return {playerTile, playerScore, playerWin}
}