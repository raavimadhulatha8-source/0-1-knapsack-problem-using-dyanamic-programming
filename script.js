
const board = document.getElementById("board");
const message = document.getElementById("message");
const solveBtn = document.getElementById("solveBtn");
const resetBtn = document.getElementById("resetBtn");

let queens = Array(8).fill(-1);

function createBoard() {
    board.innerHTML = "";

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement("div");

            cell.className =
                (row + col) % 2 === 0
                    ? "cell white"
                    : "cell black";

            if (queens[row] === col) {
                cell.textContent = "♛";
            }

            board.appendChild(cell);
        }
    }
}

function isSafe(row, col) {
    for (let i = 0; i < row; i++) {
        if (queens[i] === col) {
            return false;
        }

        if (Math.abs(queens[i] - col) === row - i) {
            return false;
        }
    }

    return true;
}

function solveQueens(row) {
    if (row === 8) {
        return true;
    }

    for (let col = 0; col < 8; col++) {
        if (isSafe(row, col)) {
            queens[row] = col;

            if (solveQueens(row + 1)) {
                return true;
            }

            queens[row] = -1;
        }
    }

    return false;
}

solveBtn.addEventListener("click", function () {
    queens = Array(8).fill(-1);

    if (solveQueens(0)) {
        createBoard();
        message.textContent = "Solution found! All 8 queens are safe.";
        message.style.color = "green";
    } else {
        message.textContent = "No solution found.";
        message.style.color = "red";
    }
});

resetBtn.addEventListener("click", function () {
    queens = Array(8).fill(-1);
    createBoard();
    message.textContent = "Board reset. Click Solve to find a solution.";
    message.style.color = "green";
});

createBoard();
