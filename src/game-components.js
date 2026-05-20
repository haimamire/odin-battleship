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

  const getLength = () => {
    return length;
  };

  return {
    getLength,
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

  const placedShips = [];

  const getBoard = () => {
    return board;
  };

  function placeShip(shipLength, coords, placeOnXAxis) {
    if (!areCoordsValid(coords)) throw new Error("Invalid coordinates.");
    const x = coords[0];
    const y = coords[1];

    const tailPosition = shipLength + (placeOnXAxis ? x : y) - 1;
    if (tailPosition >= 10) throw new Error("Illegal placement");

    if (
      coordsAreOccupied(
        [x, y],
        placeOnXAxis ? [tailPosition, y] : [x, tailPosition],
      )
    )
      throw new Error("Already occupied.");

    const ship = Ship(shipLength);
    placedShips.push(ship);

    if (placeOnXAxis) {
      for (let i = x; i <= tailPosition; i++) {
        board[i][y].ship = ship;
      }
    } else {
      for (let i = y; i <= tailPosition; i++) {
        board[x][i].ship = ship;
      }
    }
  }

  function areCoordsValid(coords) {
    return (
      coords.length === 2 &&
      coords[0] >= 0 &&
      coords[0] < 10 &&
      coords[1] >= 0 &&
      coords[1] < 10
    );
  }

  function coordsAreOccupied(startCoords, endCoords) {
    for (let x = startCoords[0]; x <= endCoords[0]; x++) {
      for (let y = startCoords[1]; y <= endCoords[1]; y++) {
        const currentCell = board[x][y];
        if (currentCell.ship) return true;
      }
    }
    return false;
  }

  return {
    getBoard,
    placeShip,
  };
}
