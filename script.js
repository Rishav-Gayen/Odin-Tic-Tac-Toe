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
        if(this.initialChoice == 'X') {this.initialChoice = 'O'} else {this.initialChoice = 'X'};
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

        const checkPattern = (pattern, choices) => {
            return pattern.some(pos =>
                pos.every(coord =>
                    choices.some(choice => choice[0] === coord[0] && choice[1] === coord[1])
                )
            );
        };

        if (checkPattern(winPatterns, this.playerOneChoices)) {
            return true;
        }
        if (checkPattern(winPatterns, this.playerTwoChoices)) {
            return true;
        }
        return false;
    }

    this.checkPotentialWin = function(boardState, player) {
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
        for(let i = 0; i < 9; i++) {
            square = document.createElement('div');
            square.classList.add('game-square');
            board.appendChild(square);
            if(i <= 2) {
                this.gameSquares[0].push(square);
            }
            else if (i > 2 && i <= 5) {
                this.gameSquares[1].push(square);
            }
            else {
                this.gameSquares[2].push(square);
            }
        }
    }

    this.deleteSquares = function() {
        board.innerHTML = '';
    }

    
    
}


restart.addEventListener('click', () => {window.location.reload()});

menuButtons.forEach((button) => button.addEventListener('click', (e) => {
    menuButtons.forEach((button) => button.classList.remove('selected'));
    e.target.classList.add('selected');

    const gameBoard = new GameBoard();

    winText.textContent = '';
    gameBoard.deleteSquares();
    gameBoard.createSquares();

    if(e.target.textContent == 'Human') {
        gameBoard.gameSquares.forEach((square) => {
            square.forEach((elem) => {
                elem.addEventListener('click', () => {

                    elem.textContent = gameBoard.initialChoice;
                    gameBoard.toggleChoice();

                    const row = gameBoard.gameSquares.indexOf(square);
                    const col = square.indexOf(elem);

                    if(gameBoard.initialChoice == 'X') {
                        gameBoard.playerOneChoices.push([row, col]);
                        gameBoard.boardState[row][col] = gameBoard.initialChoice;
                    }
                    else {
                        gameBoard.playerTwoChoices.push([row, col]);
                        gameBoard.boardState[row][col] = gameBoard.initialChoice;
                    }

                    if(gameBoard.checkWin()) {
                        gameBoard.toggleChoice();
                        winText.textContent = `${gameBoard.initialChoice} won!`
                        
                        gameBoard.gameSquares.forEach((square) => {
                            square.forEach((sq) => sq.style.pointerEvents = 'none');
                        })
                    }

                    if(gameBoard.boardState.flat().every(cell => cell !== '')) {
                        winText.textContent = 'Draw!'
                    }
                })
            })
        })

    }
    else if(e.target.textContent = 'Ai') {
        
    }

}))

