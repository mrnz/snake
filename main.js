const gridHTML = document.getElementById('grid');
let gameInstance

class Grid {
    
    constructor(handler, size, speed) {
        this.SNAKE_CLASS = 'snakeClass'
        this.FOOD_CLASS = 'foodClass'

        this.currentSnake = [[0,2],[0,1],[0,0]]
        this.direction = 'R'
        this.interval = null
        this.dirChanged = false
        this.points = 0

        this.size = size
        this.handler = handler
        this.speed = speed

        this.foodPosition = []
        this.grid = Array(size).fill().map(row=>row = Array(size).fill().map((col, i)=>false))
    }

    delegateEvnts() {
        document.addEventListener("keydown", (event) => {
            if(this.dirChanged) return
            if(['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'].includes(event.key) ) {
                const newKey = event.key.replace(/Arrow/g, '')[0]

                if(['R', 'L'].includes(this.direction) && ['U', 'D'].includes(newKey)) {
                    this.direction = newKey
                    this.dirChanged = true
                }

                else if(['U', 'D'].includes(this.direction) && ['R', 'L'].includes(newKey)) {
                    this.direction = newKey
                    this.dirChanged = true
                }   
            }
            if(event.key === ' ') {
                location.reload()
            }
        });
    }

    printGrid() {
        gridHTML.innerHTML = ''
        this.grid.forEach((row, yI) => {
            const rowHTML = document.createElement('div')
            rowHTML.style.gridTemplateColumns = '1fr '.repeat(this.size)
            
            row.forEach((col, xI) => {
                const colHTML = document.createElement('div')
                colHTML.setAttribute('id', `id_${yI}_${xI}`)
                rowHTML.appendChild(colHTML)
            })
            
            this.handler.appendChild(rowHTML)
        })
    }

    eraseSnake() {
        Array.from(document.getElementsByClassName(this.SNAKE_CLASS)).forEach((elem) => {
            elem.classList.remove(this.SNAKE_CLASS)
        })        
    }

    printSnake() {
        this.currentSnake.forEach((segment) => {
            document.getElementById(`id_${segment[0]}_${segment[1]}`).classList.add(this.SNAKE_CLASS)
        })

        if(this.isFood({
            x: this.currentSnake[0][1],
            y: this.currentSnake[0][0]
        })) {
            document.getElementById(`id_${this.foodPosition[0]}_${this.foodPosition[1]}`).classList.remove(this.FOOD_CLASS)
            this.foodPosition =[]
            this.points += 1
            document.getElementById('points').value = this.points
        }

    }

    isFood(coords) {
        if(coords.x === this.foodPosition[1] && coords.y === this.foodPosition[0]) {
            return true
        }
        return false
    }

    move() {
        this.dirChanged = false
        const a = this.getCoordinate()
        this.currentSnake.unshift([this.currentSnake[0][0]+a.y, this.currentSnake[0][1]+a.x])
        if(!this.isFood({
            x: this.currentSnake[0][1],
            y: this.currentSnake[0][0]
        })) {
            this.currentSnake.pop()
        }        
    } 

    checkGameEnd() {
        const p = this.currentSnake[0]
        if(p[0] > this.size -1 || p[0] < 0 || p[1] > this.size -1 || p[1] < 0)  {
            return true
        }

        if(document.getElementById(`id_${p[0]}_${p[1]}`).classList.contains(this.SNAKE_CLASS)) {
            return true
        }
        return false
    }
    
    getCoordinate() {
        switch (this.direction) {
            case 'R':
                return {y:0, x:1}
            case 'L':
                return {y:0, x:-1}
            case 'U':
                return {y:-1, x:0}
            case 'D':
                return {y:1, x:0}
        }
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    addFood() {
        this.foodPosition = [this.getRandomInt(this.size), this.getRandomInt(this.size)]
        document.getElementById(`id_${this.foodPosition[0]}_${this.foodPosition[1]}`).classList.add(this.FOOD_CLASS)    
    }

    stop() {
        clearInterval(this.interval)
        document.getElementById('result').classList.add('show')
        this.foodPosition = []  
    }
    
    play() {
        this.interval = setInterval(() => {
            if(!this.foodPosition.length) {
                this.addFood()
            }
            this.move()
            if(this.checkGameEnd()) {
                this.stop()
            } else {
                this.eraseSnake()
                this.printSnake()
            }
            
        }, this.speed)
    }

    start() {
        this.stop()
        document.getElementById('points').value = this.points
        removeEventListener('click', this.start)
        document.getElementById('result').classList.remove('show')
        this.printGrid()
        this.delegateEvnts()
        this.printSnake()
        this.play()
    }
}

gameInstance = new Grid(gridHTML, 15)
gameInstance.printGrid()

document.getElementById('startButton').addEventListener('click', () => {
    if(gameInstance) gameInstance.stop()
    gameInstance = new Grid(gridHTML, 15, 200)
    gameInstance.start()
})