const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const rows = 60;
const cols = 60;
const cellSize = 20;
let grid = createGrid(rows, cols);
let intervalId = null;

// Создание начальной сетки
function createGrid(rows, cols) {
    const grid = new Array(rows).fill(null).map(() => new Array(cols).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = Math.random() < 0.5 ? 1 : 0; // Случайное заполнение
        }
    }
    return grid;
}

// Сетка
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            ctx.fillStyle = grid[i][j] === 1 ? 'black' : 'white';
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }
}

// Подсчет соседей
function countNeighbors(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // Пропускаем саму клетку
            const ni = (x + i + rows) % rows; // Обертывание по вертикали
            const nj = (y + j + cols) % cols; // Обертывание по горизонтали
            count += grid[ni][nj];
        }
    }
    return count;
}

// Обновление сетки по правилам
function updateGrid() {
    const newGrid = createGrid(rows, cols);
    let stable = true;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const neighbors = countNeighbors(i, j);
            if (grid[i][j] === 1) {
                // Живая клетка
                newGrid[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
            } else {
                // Мертвая клетка
                newGrid[i][j] = (neighbors === 3) ? 1 : 0;
            }

            if (newGrid[i][j] !== grid[i][j]) {
                stable = false;
            }
        }
    }

    grid = newGrid;

    // Проверка на отсутствие живых клеток
    if (grid.flat().every(cell => cell === 0)) {
        clearInterval(intervalId);
        alert("Игра окончена: нет живых клеток.");
    }

    if (stable) {
        clearInterval(intervalId);
        alert("Игра окончена: конфигурация стабильна.");
    }

    drawGrid();
}

// Начало игры
document.getElementById('startButton').addEventListener('click', () => {
    if (!intervalId) {
        intervalId = setInterval(updateGrid, 100); // Обновление каждые 100 мс
    }
});

// Остановка игры
document.getElementById('stopButton').addEventListener('click', () => {
    clearInterval(intervalId);
    intervalId = null;
});

// Обработка кликов по клеткам
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);

    grid[y][x] = grid[y][x] === 1 ? 0 : 1; // Переключение состояния клетки
    drawGrid();
});

// Инициализация
drawGrid();
