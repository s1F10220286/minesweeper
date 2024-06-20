import { useState } from 'react';
import styles from './index.module.css';

const createBoard = (size: number): number[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(0));
};

const Home = () => {
  const [board, setBoard] = useState<number[][]>(createBoard(9)); // 9x9 の盤面を作成
  const [sampleVal, setSampleVal] = useState<number>(0);

  const clickCell = (x: number, y: number) => {
    const newBoard = board.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (rowIndex === y && colIndex === x) {
          return cell === 0 ? 1 : 0;
        }
        return cell;
      })
    );
    setBoard(newBoard);
  };

  console.log(sampleVal);

  return (
    <div className={styles.container}>
      <div
        className={styles.sampleStyle}
        style={{ backgroundPosition: `${sampleVal * -30}px` }}
      />
      <button onClick={() => setSampleVal((val) => (val + 1) % 14)}>Sample</button>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={styles.cell}
              onClick={() => clickCell(x, y)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
