import {useEffect, useState} from 'react';
import ButtonSm from './Button/ButtonSm'
import ButtonSecondary from './Button/ButtonSecondary';

export default function TicTacToe() {
    const [firstRender, setFirstRedner] = useState(true)
    const [turn, setTurn] = useState("Player 1");
    const [board, setBoard] = useState(Array(9).fill(null));
    const [error, setError] = useState('');
    const [winner, setWinner] = useState(null);
    const [wins, setWins] = useState({
        p1: 0,
        p2: 0
    })

    const check = (num) => {
        const boardCopy = [...board]
        let checkMark = turn === "Player 1" ? 'x' : 'o';

        const errorTimeOut = () => {
            setTimeout(() => {
                setError('')
            }, 1000)
        }

        if(winner === null) {
            if (board[num] === null) {
                boardCopy[num] = checkMark;
                setBoard(boardCopy)
            } else {
                setError('The Square is already Full!')
                errorTimeOut()
            }
        } else {
            setError('Reset the board to play again!')
            errorTimeOut()
        }
    }


    const isWinner = () => {
        let wins = [ 
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]
        const winningBoard = (ind) => [board[wins[ind][0]], board[wins[ind][1]], board[wins[ind][2]]]
        const allEqual = arr => arr.every(val => val === arr[0] && val !== null);
        const catsGame = (arr, i) => arr.every(val => val !== null);

        for (let i in wins) {
            const result = allEqual(winningBoard(i))
            const noWin = catsGame(board, i)
            if(result === true) {
                setWinner(turn)
                let sqOne = document.querySelector(`#square-${wins[i][0]}`)
                let sqTwo = document.querySelector(`#square-${wins[i][1]}`)
                let sqThree = document.querySelector(`#square-${wins[i][2]}`)
                sqOne.className = "winner"
                sqTwo.className = "winner"
                sqThree.className = "winner"
                break;
            } else if (noWin && !result ) {
                setWinner("Cats Game!")
           }    
        }
        let whosTurn = turn === "Player 1" ? "Player 2" : "Player 1"
        setTurn(whosTurn)
    }

    useEffect(()=> {
        if(firstRender) {
            setFirstRedner(false)
        } else {
            isWinner()
        }
    }, [board])

    const reset = (type) => {
        const resetBoard = () => {
            setBoard(Array(9).fill(null));
            setWinner(null);
            turn === "Player 1" ? setTurn('Player 2') : setTurn("Player 1");
            let winningSquares = document.querySelectorAll(".winner");
            if(winningSquares.length > 0) {
                winningSquares.forEach(square => square.className = '')
            }
        }
        const resetGame = () => {
            resetBoard()
            setWins({...wins, p1: 0, p2: 0})
        }
        
        type === 'game' ? resetGame() : resetBoard();

    }

    useEffect(()=> {
        const roundWinner = () => winner === null 
            ? null 
                : winner === "Player 1" 
                    ? setWins({...wins, p1: wins.p1+= 1}) 
                        : setWins({...wins, p2: wins.p2+= 1});
        roundWinner()

    }, [winner])

    return (
        <div className="tictactoe-main">
            {winner ? 
                <p className="heading">
                    The Winner is: <span>{winner}</span>
                </p> 
            :
                <p className="heading">
                    Turn: <span>{turn}</span>
                </p>
            }
            <div 
                className="ttt-controller"> 
                <p>Player 1: <span>{wins.p1}</span></p>
                <p>Player 2: <span>{wins.p2}</span></p>
            </div>
            <div
                className="ttt-controller">
                <ButtonSm
                    name="reset board"
                    click={() => reset('board')}/>
                <ButtonSecondary
                    name="reset game"
                    click={() => reset('game')}/>
            </div>
            
            <div className="board">
                <Square 
                    board={board}
                    check={ (num) => check(num)}/>
            </div>
            <p>{error}</p>
        </div>
    )
}
function Square({board, check}) {
    return (
        <>
            {board.map((num, i) => (
                <button
                    id={`square-${i}`}
                    key={i}
                    onClick={() => check(i)}>
                    <p>{num}</p>
                </button>
            ))}
        </>
    )
}