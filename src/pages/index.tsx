import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const createEmptyBoard = () => {
    return [...Array(9)].map(() => [...Array(9)].map(() => 0));
  };

  const [userInputs, setUserInputs] = useState(createEmptyBoard);
  const [bombMap, setBombMap] = useState(createEmptyBoard);
  const [firstClick, setFirstClick] = useState(true);

  const generateBombMap = (initialX: number, initialY: number) => {
    const newBombMap = createEmptyBoard();
    let bombsPlaced = 0;

    while (bombsPlaced < 10) {
      const x = Math.floor(Math.random() * 9);
      const y = Math.floor(Math.random() * 9);

      if (newBombMap[y][x] === 0 && !(x === initialX && y === initialY)) {
        newBombMap[y][x] = 1;
        bombsPlaced++;
      }
    }

    return newBombMap;
  };

  const countBombsAround = (x: number, y: number, bombMap: number[][]) => {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    return directions.reduce((count, [dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < 9 && ny >= 0 && ny < 9) {
        count += bombMap[ny][nx];
      }
      return count;
    }, 0);
  };

  const revealBoard = (x: number, y: number, bombMap: number[][], userInputs: number[][]) => {
    const newInputs = userInputs.map((row) => row.slice());
    const stack = [[x, y]];

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      if (newInputs[cy][cx] !== 0) continue;

      const bombsAround = countBombsAround(cx, cy, bombMap);
      newInputs[cy][cx] = bombsAround === 0 ? -1 : bombsAround;

      if (bombsAround === 0) {
        const directions = [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ];
        directions.forEach(([dx, dy]) => {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx >= 0 && nx < 9 && ny >= 0 && ny < 9 && newInputs[ny][nx] === 0) {
            stack.push([nx, ny]);
          }
        });
      }
    }

    return newInputs;
  };

  const clickL = (x: number, y: number) => {
    if (firstClick) {
      const newBombMap = generateBombMap(x, y);
      setBombMap(newBombMap);
      setFirstClick(false);

      const newInputs = revealBoard(x, y, newBombMap, userInputs);
      setUserInputs(newInputs);
    } else {
      if (bombMap[y][x] === 1) {
        alert('Game Over!');
        setUserInputs(createEmptyBoard());
        setBombMap(createEmptyBoard());
        setFirstClick(true);
      } else {
        const newInputs = revealBoard(x, y, bombMap, userInputs);
        setUserInputs(newInputs);
      }
    }
  };

  const clickR = (x: number, y: number) => {
    document.getElementsByTagName('html')[0].oncontextmenu = () => false;
    const newInputs = userInputs.map((row) => row.slice());

    if (newInputs[y][x] === 0) {
      newInputs[y][x] = 9; // 9 means flagged
    } else if (newInputs[y][x] === 9) {
      newInputs[y][x] = 0; // unflag
    }

    setUserInputs(newInputs);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {userInputs.map((row, y) =>
          row.map((cell, x) => (
            <div
              className={
                cell === 9
                  ? styles.flag
                  : bombMap[y][x] === 1 && cell !== 0
                  ? styles.bomb
                  : cell === -1
                  ? styles.empty
                  : cell > 0 && cell < 9
                  ? styles.number
                  : styles.cell
              }
              style={cell > 0 && cell < 9 ? { backgroundPosition: `${-cell * 32}px 0` } : {}}
              key={`${y}-${x}`}
              onClick={() => clickL(x, y)}
              onContextMenu={(e) => {
                e.preventDefault();
                clickR(x, y);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
