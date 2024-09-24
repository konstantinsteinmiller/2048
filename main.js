import './style.css'
import Confetti from 'canvas-confetti'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="info">
      <h1>2048</h1>
      <div class="score-container">
        <h2 class="score-title">score <span class="score">0</span></h2>
      </div>
    </div>
    <p id="result">Join the number to get the <b>2048</b> tile!</p>
    <div class="grid"></div>
  </div>
`

document.addEventListener('DOMContentLoaded', () => {
  const gridDisplay= document.querySelector('.grid')
  const scoreDisplay= document.querySelector('.score')
  const resultDisplay= document.querySelector('#result')

  let score = 0

  const width = 4
  const squaresList = []
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div')
      square.innerHTML = '0'
      gridDisplay.appendChild(square)
      squaresList.push(square)
    }
  }
  createBoard()

  function generate() {
    const randomNumber = Math.floor(Math.random() * squaresList.length)
    if (squaresList[randomNumber].innerHTML === '0') {
      squaresList[randomNumber].innerHTML = '2'
      checkForGameOver()
      checkForWin()
    } else generate()
  }

  generate()
  generate()
  function moveRight() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = +squaresList[i].innerHTML
        let totalTwo = +squaresList[i+1].innerHTML
        let totalThree = +squaresList[i+2].innerHTML
        let totalFour = +squaresList[i+3].innerHTML
        let row = [totalOne, totalTwo, totalThree, totalFour]

        let filteredRow = row.filter((num) => num)
        const missing = 4 - filteredRow.length
        const zeroes = Array(missing).fill(0)
        let newRow = zeroes.concat(filteredRow)

        newRow.forEach((tile, index) => {
          squaresList[i + index].innerHTML = tile
        })
      }
    }
  }

  function moveLeft() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = +squaresList[i].innerHTML
        let totalTwo = +squaresList[i+1].innerHTML
        let totalThree = +squaresList[i+2].innerHTML
        let totalFour = +squaresList[i+3].innerHTML
        let row = [totalOne, totalTwo, totalThree, totalFour]

        let filteredRow = row.filter((num) => num)
        const missing = 4 - filteredRow.length
        const zeroes = Array(missing).fill(0)
        let newRow = filteredRow.concat(zeroes)
        newRow.forEach((tile, index) => {
          squaresList[i + index].innerHTML = tile
        })
      }
    }
  }
  function moveUp() {
    for (let i = 0; i < 4; i++) {
      let totalOne = +squaresList[i].innerHTML
      let totalTwo = +squaresList[i+width].innerHTML
      let totalThree = +squaresList[i+ width*2].innerHTML
      let totalFour = +squaresList[i+ width*3].innerHTML
      let column = [totalOne, totalTwo, totalThree, totalFour]

      let filteredColumn = column.filter((num) => num)
      const missing = 4 - filteredColumn.length
      const zeroes = Array(missing).fill(0)
      let newColumn = filteredColumn.concat(zeroes)

      newColumn.forEach((tile, index) => {
        squaresList[i + width * index].innerHTML = tile
      })
    }
  }
  function moveDown() {
    for (let i = 0; i < 4; i++) {
      let totalOne = +squaresList[i].innerHTML
      let totalTwo = +squaresList[i+width].innerHTML
      let totalThree = +squaresList[i+ width*2].innerHTML
      let totalFour = +squaresList[i+ width*3].innerHTML
      let column = [totalOne, totalTwo, totalThree, totalFour]
      let filteredColumn = column.filter((num) => num)
      const missing = 4 - filteredColumn.length
      const zeroes = Array(missing).fill(0)
      let newColumn = zeroes.concat(filteredColumn)
      newColumn.forEach((tile, index) => {
        squaresList[i + width * index].innerHTML = tile
      })
    }
  }

  // assign functions to keys
  function control(e) {
    switch (e.key) {
      case 'ArrowLeft': onKey(moveLeft); break
      case 'ArrowRight': onKey(moveRight); break
      case 'ArrowUp': onKey(moveUp); break
      case 'ArrowDown': onKey(moveDown); break
      default: break
    }
  }
  document.addEventListener('keydown', control)

  function onKey(callback) {
    callback()
    callback === moveLeft || callback === moveRight
      ? /*combine('row')*/combineRow('row')
      :/* combine('column')*/combineColumn()
    callback()
    generate()
  }

  function combineRow(/*type*/) {
    for (let i = 0; i < squaresList.length - 1; i++) {
      const nextTileIndex = /*type === 'row' ? */1/* : width*/
      if (squaresList[i].innerHTML === squaresList[i+nextTileIndex].innerHTML) {
        let combinedTotal = +squaresList[i].innerHTML + +squaresList[i+nextTileIndex].innerHTML
        squaresList[i].innerHTML = combinedTotal
        squaresList[i+nextTileIndex].innerHTML = '0'

        score += combinedTotal
        scoreDisplay.innerHTML = score
      }
    }
  }
  function combineColumn() {
    for (let i = 0; i < 12; i++) {
      const nextTileIndex = width
      if (squaresList[i].innerHTML === squaresList[i+nextTileIndex].innerHTML) {
        let combinedTotal = +squaresList[i].innerHTML + +squaresList[i+nextTileIndex].innerHTML
        squaresList[i].innerHTML = combinedTotal
        squaresList[i+nextTileIndex].innerHTML = '0'

        score += combinedTotal
        scoreDisplay.innerHTML = score
      }
    }
  }

  function checkForWin() {
    if (squaresList.some((square) => square.innerHTML === '2048')) {
      resultDisplay.innerHTML = 'You Win!'
      document.removeEventListener('keydown', control)
      Confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } })

      clearInterval(myTimer)
      setTimeout(() => {
        Confetti.reset()
      }, 4000)
    }
  }

  function checkForGameOver() {
    if (squaresList.every((square) => square.innerHTML !== '0')) {
      resultDisplay.innerHTML = 'You Lost!'
      document.removeEventListener('keydown', control)
      Confetti({ particleCount: 5, spread: 70, origin: { y: 0.8 } })

      clearInterval(myTimer)
      setTimeout(() => {
        Confetti.reset()
      }, 4000)
    }
  }

  function addColours() {
    squaresList.forEach((square) => {
      let color
      switch (square.innerHTML) {
        case '0': color = '#afa192'; break;
        case '2': color = '#eee4da'; break;
        case '4': color = '#ede0c8'; break;
        case '8': color = '#f2b179'; break;
        case '16': color = '#ffcea4'; break;
        case '32': color = '#e8c064'; break;
        case '64': color = '#ffab6e'; break;
        case '128': color = '#fd9982'; break;
        case '256': color = '#ead79c'; break;
        case '512': color = '#76daff'; break;
        case '1024': color = '#beeaa5'; break;
        case '2048': color = '#d7d4f0'; break;
      }
      square.style.backgroundColor = color
    })
  }
  addColours()

  let myTimer = setInterval(addColours, 10)
})