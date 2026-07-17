import { useMemo, useState } from 'react';

type CellValue = '' | 'X' | 'O';
type GameResult = 'X' | 'O' | 'draw' | null;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

function getGameResult(board: CellValue[]): GameResult {
  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (!board.includes('')) {
    return 'draw';
  }

  return null;
}

export default function App() {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill('') as CellValue[]);
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');

  const result = useMemo(() => getGameResult(board), [board]);
  const gameActive = result === null;

  const statusText =
    result === 'draw'
      ? "It's a draw!"
      : result
        ? `Player ${result} wins!`
        : `Player ${currentPlayer}'s turn`;

  function handleCellClick(index: number) {
    if (!gameActive || board[index]) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    setBoard(nextBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  }

  function resetGame() {
    setBoard(Array(9).fill('') as CellValue[]);
    setCurrentPlayer('X');
  }

  return (
    <main className="app-shell">
      <section className="game-card">
        <p className="eyebrow">React remake</p>
        <h1>Tic Tac Toe</h1>
        <p className="status" aria-live="polite">{statusText}</p>

        <div className="board" role="grid" aria-label="Tic tac toe board">
          {board.map((value, index) => (
            <button
              key={index}
              type="button"
              className="cell"
              onClick={() => handleCellClick(index)}
              aria-label={`Cell ${index + 1}${value ? `, ${value}` : ''}`}
              disabled={!gameActive || Boolean(value)}
            >
              {value}
            </button>
          ))}
        </div>

        <button type="button" className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
      </section>
    </main>
  );
}