const menuButtons = document.querySelectorAll('.menu-btn')
const board = document.querySelector('.game-board');
const winText = document.querySelector('.win-text');
const restart = document.querySelector('.restart');




function GameBoard() {
    this.initialChoice = 'X';

    this.boardState = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]

    this.gameSquares = [

        [],
        [],
        []
    ];

    this.playerOneChoices = [];
    this.playerTwoChoices = [];

    this.toggleChoice = function() {
        if (this.initialChoice == 'X') {
            this.initialChoice = 'O'
        } else {
            this.initialChoice = 'X'
        };
    }



    this.checkWin = function() {
        const winPatterns = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];
    
        const hasWinningPattern = (choices) => 
            winPatterns.some(pattern => 
                pattern.every(([row, col]) => 
                    choices.some(([r, c]) => r === row && c === col)
                )
            );
    
        return hasWinningPattern(this.playerOneChoices) || 
               hasWinningPattern(this.playerTwoChoices);
    }

    this.checkPotentialWin = function(boardState, player) {
        const winPatterns = [
            [
                [0, 0],
                [0, 1],
                [0, 2]
            ],
            [
                [1, 0],
                [1, 1],
                [1, 2]
            ],
            [
                [2, 0],
                [2, 1],
                [2, 2]
            ],
            [
                [0, 0],
                [1, 0],
                [2, 0]
            ],
            [
                [0, 1],
                [1, 1],
                [2, 1]
            ],
            [
                [0, 2],
                [1, 2],
                [2, 2]
            ],
            [
                [0, 0],
                [1, 1],
                [2, 2]
            ],
            [
                [0, 2],
                [1, 1],
                [2, 0]
            ]
        ];

        for (const pattern of winPatterns) {
            let playerCount = 0;
            let emptyCount = 0;
            let emptyIndex = -1;

            for (let i = 0; i < pattern.length; i++) {
                let [row, col] = pattern[i];
                if (boardState[row][col] === player) {
                    playerCount++;
                } else if (boardState[row][col] === "") {
                    emptyCount++;
                    emptyIndex = i;
                }
            }

            // If player has two in a row and one empty space, block the empty space
            if (playerCount === 2 && emptyCount === 1) {
                return pattern[emptyIndex];
            }
        }
        return null;
    };


    this.createSquares = function() {
        for (let i = 0; i < 9; i++) {
            square = document.createElement('div');
            square.classList.add('game-square');
            board.appendChild(square);
            if (i <= 2) {
                this.gameSquares[0].push(square);
            } else if (i > 2 && i <= 5) {
                this.gameSquares[1].push(square);
            } else {
                this.gameSquares[2].push(square);
            }
        }
    }

    this.deleteSquares = function() {
        board.innerHTML = '';
    }



}


restart.addEventListener('click', () => {
    window.location.reload()
});

menuButtons.forEach((button) => button.addEventListener('click', (e) => {
    menuButtons.forEach((button) => button.classList.remove('selected'));
    e.target.classList.add('selected');

    const gameBoard = new GameBoard();

    winText.textContent = '';
    gameBoard.deleteSquares();
    gameBoard.createSquares();

    if (e.target.textContent == 'Human') {
        // Remove existing listeners to prevent duplicates
        gameBoard.gameSquares.forEach((square) => {
            square.forEach((elem) => {
                const clone = elem.cloneNode(true);
                elem.parentNode.replaceChild(clone, elem);
            });
        });
    
        // Re-get the squares after cloning
        gameBoard.gameSquares = [[], [], []];
        const newSquares = document.querySelectorAll('.game-square');
        newSquares.forEach((square, index) => {
            if (index <= 2) {
                gameBoard.gameSquares[0].push(square);
            } else if (index > 2 && index <= 5) {
                gameBoard.gameSquares[1].push(square);
            } else {
                gameBoard.gameSquares[2].push(square);
            }
        });
    
        // Add click handlers to each square
        gameBoard.gameSquares.forEach((square) => {
            square.forEach((elem) => {
                elem.addEventListener('click', () => {
                    // Prevent moves if game is over or square is filled
                    if (winText.textContent !== '' || elem.textContent !== '') {
                        return;
                    }
    
                    const row = gameBoard.gameSquares.indexOf(square);
                    const col = square.indexOf(elem);
    
                    // Update visual and game state
                    elem.textContent = gameBoard.initialChoice;
                    gameBoard.boardState[row][col] = gameBoard.initialChoice;
    
                    // Track player choices
                    if (gameBoard.initialChoice === 'X') {
                        gameBoard.playerOneChoices.push([row, col]);
                    } else {
                        gameBoard.playerTwoChoices.push([row, col]);
                    }
    
                    // Check for win
                    if (gameBoard.checkWin()) {
                        winText.textContent = `${gameBoard.initialChoice} won!`;
                        gameBoard.gameSquares.forEach((square) => {
                            square.forEach((sq) => sq.style.pointerEvents = 'none');
                        });
                        return;
                    }
    
                    // Check for draw
                    if (gameBoard.boardState.flat().every(cell => cell !== '')) {
                        winText.textContent = 'Draw!';
                        return;
                    }
    
                    // Switch turns if game continues
                    gameBoard.toggleChoice();
                });
            });
        });
    } else if (e.target.textContent == 'Ai') {
        // Function to check if a position is available
        const isAvailable = (row, col) => gameBoard.boardState[row][col] === '';

        // Function to make AI move
        const makeAiMove = () => {
            // First, check if AI can win
            const aiWinMove = gameBoard.checkPotentialWin(gameBoard.boardState, 'O');
            if (aiWinMove) {
                return aiWinMove;
            }

            // Second, block player's potential win
            const blockMove = gameBoard.checkPotentialWin(gameBoard.boardState, 'X');
            if (blockMove) {
                return blockMove;
            }

            // Try to take center if available
            if (isAvailable(1, 1)) {
                return [1, 1];
            }

            // Try to take corners
            const corners = [
                [0, 0],
                [0, 2],
                [2, 0],
                [2, 2]
            ];
            const availableCorners = corners.filter(([row, col]) => isAvailable(row, col));
            if (availableCorners.length > 0) {
                return availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }

            // Take any available edge
            const edges = [
                [0, 1],
                [1, 0],
                [1, 2],
                [2, 1]
            ];
            const availableEdges = edges.filter(([row, col]) => isAvailable(row, col));
            if (availableEdges.length > 0) {
                return availableEdges[Math.floor(Math.random() * availableEdges.length)];
            }

            // If nothing else is available, find any empty space
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (isAvailable(row, col)) {
                        return [row, col];
                    }
                }
            }
        };

        // Add click event listeners for player moves
        gameBoard.gameSquares.forEach((square) => {
            square.forEach((elem) => {
                elem.addEventListener('click', () => {
                    if (elem.textContent === '') {
                        // Player's move
                        elem.textContent = gameBoard.initialChoice;
                        const row = gameBoard.gameSquares.indexOf(square);
                        const col = square.indexOf(elem);
                        gameBoard.playerOneChoices.push([row, col]);
                        gameBoard.boardState[row][col] = gameBoard.initialChoice;
                        gameBoard.toggleChoice();

                        // Check if player won
                        if (gameBoard.checkWin()) {
                            winText.textContent = 'X won!';
                            gameBoard.gameSquares.forEach(square =>
                                square.forEach(sq => sq.style.pointerEvents = 'none')
                            );
                            return;
                        }

                        // Check for draw
                        if (gameBoard.boardState.flat().every(cell => cell !== '')) {
                            winText.textContent = 'Draw!';
                            return;
                        }

                        // AI's move
                        const [aiRow, aiCol] = makeAiMove();
                        gameBoard.gameSquares[aiRow][aiCol].textContent = gameBoard.initialChoice;
                        gameBoard.playerTwoChoices.push([aiRow, aiCol]);
                        gameBoard.boardState[aiRow][aiCol] = gameBoard.initialChoice;
                        gameBoard.toggleChoice();

                        // Check if AI won
                        if (gameBoard.checkWin()) {
                            winText.textContent = 'O won!';
                            gameBoard.gameSquares.forEach(square =>
                                square.forEach(sq => sq.style.pointerEvents = 'none')
                            );
                            return;
                        }

                        // Check for draw after AI move
                        if (gameBoard.boardState.flat().every(cell => cell !== '')) {
                            winText.textContent = 'Draw!';
                        }
                    }
                });
            });
        });
    }

}))