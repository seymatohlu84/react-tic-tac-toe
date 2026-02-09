import { useState } from "react";

function Square({ value, onSquareClick, isHighlighted }) {
  return (
    <button 
      className={"square" + (isHighlighted? " square--win":"")} 
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);
  const winner=result?.winner;
  const winningLine = result?.line ?? [];
  const isDraw = !winner && squares.every(square=> square !==null);
  let status;
  if(winner){
    status= "Kazanan: " + winner;
  }
  //Berabere Durumunu ekledim.
  else if(isDraw){
    status="Oyun berabere!";
  }
  else{
    status="Sıradaki oyuncu: "+ (xIsNext ? "X" : "O");
  }  
  return (
    <>
      <div className="status">{status}</div>

      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isHighlighted={winningLine.includes(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isHighlighted={winningLine.includes(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isHighlighted={winningLine.includes(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isHighlighted={winningLine.includes(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isHighlighted={winningLine.includes(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isHighlighted={winningLine.includes(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isHighlighted={winningLine.includes(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isHighlighted={winningLine.includes(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isHighlighted={winningLine.includes(8)}/>
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? `${move}. hamleye git` : "Oyunun başlangıcı";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], line:[a,b,c]};
    }
  }
  return null;
}
