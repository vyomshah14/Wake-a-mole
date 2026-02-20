let holes = document.querySelectorAll('.hole')
let scoreDisplay = document.getElementById('score')

let score = 0
let gameInterval = null
let moleIndex = -1

// start game
function startGame() {

    score = 0
    scoreDisplay.innerText = score

    if (gameInterval) clearInterval(gameInterval)

    gameInterval = setInterval(showMole, 800)
}

// stop game
function stopGame() {

    clearInterval(gameInterval)
    holes.forEach(h => h.innerText = '')
    moleIndex = -1
}

// show mole
function showMole() {

    holes.forEach(h => h.innerText = '')

    moleIndex = Math.floor(Math.random() * 9)

    holes[moleIndex].innerText = '🥀'
}

// click events
holes.forEach((hole, index) => {

    hole.addEventListener('click', () => {

        if (index === moleIndex) {
            score++
            scoreDisplay.innerText = score

            hole.innerText = ''
            moleIndex = -1
        }
    })
})
