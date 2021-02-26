document.addEventListener('DOMContentLoaded', () => {
    const allBtn = document.querySelectorAll('button')
    // const startBtn = document.querySelector('button')
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.querySelector('.score-display')
    const lineDisplay = document.querySelector('.lines-display')
    const displaySquares = document.querySelectorAll('.previous-grid div')
    let squares = Array.from(grid.querySelectorAll('div'))   
    const width = 10
    const height = 20
    let currentPosition = 4
    let timerId 
    let score = 0
    let lines = 0
    let currentIndex = 0

    // assign functions to keycodes
    function control(event) {
        if (event.keyCode === 39) {
            // console.log('right')
            moveRight();
        }  else if (event.keyCode === 38) {
            rotate();
        }  else if (event.keyCode === 37) {
            moveLeft();
        }  else if (event.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keydown', control)
    // The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    
    // Randomly select Tetromino
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let currentRotation = 0
    let current = theTetrominoes[random][currentRotation]

    // draw the shape
    function draw() {
        current.forEach( index => {
            squares[currentPosition + index].classList.add('block')
        })
    }
    // undraw the shape
    function undraw() {
        current.forEach( index => (
            squares[currentPosition + index].classList.remove('block')
        ))
    }

    // move down shape
    function moveDown() {
        undraw()
        currentPosition = currentPosition += width
        draw()
        freeze()
    }

    // move left and prevent collistions with shapes moving left
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        if(!isAtRightEdge) currentPosition += 1
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition -= 1
        }
        draw()
    }
    
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge) currentPosition -= 1
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition += 1
        }
        draw()
    }

    function rotate() {
        undraw()
        currentRotation ++
        if (currentRotation === current.length){
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }
    
    // show previous tetromino is displaySquares
    const displayWidth = 4
    const displayIndex = 0
    let nextRandom = 0
    const smallTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], /* lTetromino */
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], /* zTetromino */
        [1, displayWidth, displayWidth + 1, displayWidth + 2], /* tTetromino */
        [0, 1, displayWidth, displayWidth + 1], /* oTetromino */
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] /* iTetromino */
    ]
    function displayShape() {
        displaySquares.forEach(square => {
        square.classList.remove('block')
        })
        smallTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('block')
        })
    }

    function freeze() {
        // if block has settled
        if (current.some(index => squares[currentPosition + index + width].classList.contains('block3') 
        || squares[currentPosition + index + width].classList.contains('block2'))) {
          // make it block2
          current.forEach(index => squares[index + currentPosition].classList.add('block2'))
          // start a new tetromino falling
          random = nextRandom
          nextRandom = Math.floor(Math.random() * theTetrominoes.length)
          current = theTetrominoes[random][currentRotation]
          currentPosition = 4
          draw()
          displayShape()
          
          addScore()
          gameOver()
        }
    }

    // startBtn.addEventListener('click', () => {
    allBtn[0].addEventListener('click', () => {
        if(timerId){
            clearInterval(timerId)
            timerId = null
        } else {
            draw()            
            timerId = setInterval(moveDown, 300)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })
    // Reset game
    allBtn[1].addEventListener('click', () => {
        location.reload()
    })
    
    // game over
    function gameOver() {
        if(current.some(index => squares[currentPosition +index].classList.contains('block2'))) {
            clearInterval(timerId)
        }
    }

    // add score
    function addScore() {
        for (currentIndex = 0; currentIndex < 199; currentIndex += width) {
            const row = [currentIndex, currentIndex+1, currentIndex+2, currentIndex+3, currentIndex+4, currentIndex+5,
                currentIndex+6, currentIndex+7, currentIndex+8, currentIndex+9]
            
            if (row.every(index => squares[index].classList.contains('block2'))) {
                score += 10
                lines += 1
                scoreDisplay.innerHTML = score
                lineDisplay.innerHTML = lines
                row.forEach(index => {
                    squares[index].classList.remove('block2') || squares[index].classList.remove('block')
                })
                //splice Array
                const squaresRemoved = squares.splice(currentIndex, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }
})