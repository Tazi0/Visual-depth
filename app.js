function make2DArray(x, y) {
    var arr = new Array(x)
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(y)
    }
    return arr
}

var resolution = 10
var colms = 40
var rows = 40
var grid = make2DArray(colms, rows)
var gridLimit = {
    min: 90,
    max: 120
}

var maxHeight = 50
var minHeight = -50

var frames = 0

var docWidth = window.innerWidth
var docHeight = window.innerHeight

function setup() {
    createCanvas(docWidth, docHeight, WEBGL)

    for (let i = 0; i < colms; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = {
                p: getRndInteger(minHeight, maxHeight)
            }
        }
    }
}

function draw() {
    background(255)

    orbitControl();

    var y = 0
    var x = -(resolution * (colms / 2))
    var z = rows * resolution / 2

    for (let i = 0; i < colms; i++) {
        for (let j = 0; j < rows; j++) {
            var item = grid[i][j]

            // ERROR CATCHING
            if (item && item.p) {
                p = item.p
            } else {
                var p = getRndInteger(minHeight, maxHeight)
                if(!item) item = {}
                item.p = p
                grid[i][j] = {
                    p
                }
            }
            // ----------------



            // TRUST
            if (frames >= 100) {
                p = neighbours(grid, i, j)
                grid[i][j].p = p
            }

            var finalColor = 255
            var Rgb = (finalColor / 100 * (p / gridLimit.max * 100))
            var rgB = (finalColor / 100 * (-p / gridLimit.max * 100))

            push();
            fill(Rgb, 0, rgB)
            var posY = yPOS(y, -p)
            translate(x + resolution * j, posY, z)
            box(resolution, p, resolution)
            pop();
        }
        z -= 10
    }

    if (frames >= 100) {
        frames = 0
    }
    frames++
    // console.log(frames);

    function yPOS(z, size) {
        // Thanks Eva voor zo goed zorgen voor me en te helpen hoe het allemaal werkt met mn domme kop
        // Z = positie vanaf de camera
        // Size = hoogte van de balk
        return z + size/2
    }
}

function neighbours(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (x + i + colms) % colms;
            let row = (y + j + rows) % rows;
            sum += grid[col][row].p / 4.3;
        }
    }

    if (grid[x][y].p >= getRndInteger(gridLimit.min, gridLimit.max)) {
        sum -= getRndInteger(20, 40)
    } else if (grid[x][y].p <= -getRndInteger(gridLimit.min, gridLimit.max)) {
        sum += getRndInteger(20, 40)
    }

    sum -= grid[x][y].p;
    return sum;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}