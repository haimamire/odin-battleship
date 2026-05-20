export function Ship(shipLength) {
  if (typeof shipLength !== "number" || shipLength < 1 || shipLength > 5)
    throw new Error("Ship length must be a number between 1 and 5.");

  const length = shipLength;
  let timesHit = 0;
  let hasSunk = false;

  const hit = () => {
    if (!hasSunk) timesHit++;
  };

  function isSunk() {
    if (timesHit >= length) {
      hasSunk = true;
    }
    return hasSunk;
  }

  return {
    length,
    hit,
    isSunk,
  };
}

export function Gameboard() {
  const board = (() => {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        const cell = {
          ship: null,
          hit: false,
        };
        row.push(cell);
      }
      arr.push(row);
    }
    return arr;
  })();

  const getBoard = () => {
    return board;
  };

  return {
    getBoard,
  };
}
