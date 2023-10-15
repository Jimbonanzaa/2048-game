// Declaring our variable
let board;
let score = 0;
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;
let startX = 0;
let startY = 0;

// Create function to set the gameboard
function setGame() {
    // Initialize the 4x4 game board with all tiles set to 0
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Create the game board tile on the HTML document
    // outer loop is for rows, inner loop for the columns
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // creating a div element representing a tile.
            let tile = document.createElement("div");

            // Setting a unique identifier tile
            // r0c0 -> 0 - 0
            tile.id = r.toString() + "-" + c.toString();

            // board is currently set to 0
            let num = board[r][c];

            // Update the tile's apperance based on the num value.
            updateTile(tile, num);

            // Append the tile to the gameboard container.
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();

}

// Function to update the appearance of a tile based on its number.
function updateTile(tile, num) {
    // clear the tile content
    tile.innerText = "";

    // clear the classList to avoid multiple classes
    tile.classList.value = "";

    // add a class named "tile"
    tile.classList.add("tile");

    // This will check for the "num" parameter and will apply specific styling based on the number value.
    // If num is positive, the number is converted to a string and placed inside the tile as text.
    if (num > 0) {
        // Set the tile's text to the number based on the num value.
        tile.innerText = num.toString();
        // if num is less than or equal to 4096, a class based on the number is added to the tile's classlist. 
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            // if num is greater than 4096, a special  class "x8192" is added.
            tile.classList.add("x8192");
        }
    }
}

// event that triggers when web page finishes loading.
window.onload = function () {
    // to execute or invoke the setGame();
    setGame();
}

// Create function for event listeners for your keys sliding  (left, right, up, and down)
// "e" represents an event, which contains information about the action occured.
function handleSlide(e) {
    // console.log(e.code);

    // Check if the pressed key is one of the arrow keys.
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {

        // prevent default behavior (scrolling on keydown)
        e.preventDefault();

        // this invoke/call a function based on the arrow pressed.
        if (e.code == "ArrowLeft") {
            slideLeft();
            setTwo();
        }
        else if (e.code == "ArrowRight") {
            slideRight();
            setTwo();

        }
        else if (e.code == "ArrowUp") {
            slideUp();
            setTwo();

        }
        else if (e.code == "ArrowDown") {
            slideDown();
            setTwo();

        }
    }

    document.getElementById("score").innerText = score;

    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
            // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed

    }
}

document.addEventListener("keydown", handleSlide);

function filterZero(row) {
    // removing of empty tiles
    return row.filter(num => num != 0);
}

// Core function for sliding and merging tiles (adjacent tile) in a row.
function slide(row) {

    //sample: [0,2,2,2]
    row = filterZero(row); //get rid of zero tiles

    // sample: [2,2,2]
    // check for adjacent equal numbers.
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            // double the first element
            row[i] *= 2;
            // and setting the second one to zero
            row[i + 1] = 0;

            score += row[i];
        } //[2,2,2] -> [4,0,2]
    }

    // [4,2]
    row = filterZero(row);

    //[4,2] -> [4,2,0,0]
    // add zeroes back
    while (row.length < columns) {
        row.push(0);
    }

    return row;

}

function slideLeft() {
    // iterate through each row
    // check each row
    for (let r = 0; r < rows; r++) {
        let row = board[r];

        let originalRow = row.slice();

        // call the slide function to merge similar tiles.
        row = slide(row);

        // updated value in the board.
        board[r] = row;

        // Update the id of tile as well as appearance.
        for (let c = 0; c < columns; c++) {

            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if (originalRow[c] !== num && num !== 0) {
                tile.style.animation = "slide-from-right 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }

            updateTile(tile, num);
        }
    }
}

function slideRight() {
    // iterate through each row
    // check each row
    for (let r = 0; r < rows; r++) {
        let row = board[r];

        let originalRow = row.slice();

        row.reverse();

        // call the slide function to merge similar tiles.
        row = slide(row);

        row.reverse();


        // updated value in the board.
        board[r] = row;

        // Update the id of tile as well as appearance.
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if (originalRow[c] !== num && num !== 0) {
                tile.style.animation = "slide-from-left 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }

            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        // In two dimensional array, the first number represents row, and second is column.
        // Create a temporary array called row that represents a column from top to bottom.
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]] // first column of the board =  [2, 0, 2, 0]

        let originalRow = row.slice();

        row = slide(row) // [2, 2] -> [4, 0] -> [4, 0, 0, 0]

        let changedIndices = [];

        for (let r = 0; r < rows; r++) {
            if (originalRow[r] !== row[r]) {
                changedIndices.push(r);
            }
        }

        // Update the id of the tile
        for (let r = 0; r < rows; r++) {
            // sets the values of the board array back to the values of the modified row, essentially updating the column in the game board.
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if (changedIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-bottom 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }

            updateTile(tile, num)
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        // In two dimensional array, the first number represents row, and second is column.
        // Create a temporary array called row that represents a column from top to bottom.
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]] // first column of the board =  [2, 0, 2, 0]

        let originalRow = row.slice();

        row.reverse();

        row = slide(row) // [2, 2] -> [4, 0] -> [4, 0, 0, 0]

        row.reverse();

        let changedIndices = [];

        for (let r = 0; r < rows; r++) {
            if (originalRow[r] !== row[r]) {
                changedIndices.push(r);
            }
        }

        // Update the id of the tile
        for (let r = 0; r < rows; r++) {
            // sets the values of the board array back to the values of the modified row, essentially updating the column in the game board.
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if (changedIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-top 0.3s";

                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }

            updateTile(tile, num)
        }
    }
}

function hasEmptyTile() {
    // Iterate through the board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // Check if current tile == 0, if yes return true
            if (board[r][c] == 0) {
                return true
            }
        }
    }
    // There is no tile with zero value;
    return false;
}

function setTwo() {
    // Check the hasEmptyTile boolean result, if hasEmptyTile == false, the setTwo will not proceed
    if (!hasEmptyTile()) {
        return;
    }

    // Declare a value found(tile)
    let found = false;

    while (!found) {
        // Math.random() - generates a number between 0 and 1, then multiplied by no. of columns or rows
        // Math.floor() - rounds down to the nearest integer 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        // Check if the position (r, c) on the game board is empty (i.e., has a value of 0).
        if (board[r][c] == 0) {
            // If the position value is 0, set the value to 2, representing the new "2" tile. 
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2")

            // Set the found variable to true to break the loop
            found = true;
        }
    }
}

function checkWin() {
    // iterate through the board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // check if current tile == 2048 and is2048Exist == false
            if (board[r][c] == 2048 && is2048Exist == false) {
                alert('You Win! You got the 2048');  // If true, alert and  
                is2048Exist = true;     // reassigned the value of is2048Exist to true to avoid continuous appearance of alert.
            } else if (board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;     // reassigned the value of is4096Exist to true to avoid continuous appearance of alert.
            } else if (board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory!: You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;    // reassigned the value of is8192Exist to true to avoid continuous appearance of alert.
            }
        }
    }
}

function hasLost() {
    // Check if the board is full
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                // Found an empty tile, user has not lost
                return false;
            }

            const currentTile = board[r][c];

            // Check adjacent cells (up, down, left, right) for possible merge
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }

    // No possible moves left or empty tiles, user has lost
    return true;
}

// RestartGame by replacing all values into zero.
function restartGame() {
    // Iterate in the board and 
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            board[r][c] = 0;    // change all values to 0
        }
    }
    score = 0;
    setTwo()    // new tile   
}

document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
})

document.addEventListener('touchmove', (e) => {
    if (!e.target.className.includes('tile')) {
        return
    }
    e.preventDefault();
}, { passive: false })

document.addEventListener("touchend", (e) => {
    if (!e.target.className.includes('tile')) {
        return
    }

    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            slideLeft();
            setTwo();
        }
        else {
            slideRight();
            setTwo();
        }
    }
    else {
        if (diffY > 0) {
            slideUp();
            setTwo();
        }
        else {
            slideDown();
            setTwo();
        }
    }
    document.getElementById("score").innerText = score;

    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
            // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed

    }
})