export function Ship(shipLength) {
  if (typeof shipLength !== "number" || shipLength < 1 || shipLength > 5)
    throw new Error("Ship length must be a number between 1 and 5.");

  const length = shipLength;
  let timesHit = 0;
  let hasSunk = false;

  const hit = () => {
    if (hasSunk) return;
    timesHit++;
    if (timesHit >= length) {
      hasSunk = true;
    }
  };

  function isSunk() {
    return hasSunk;
  }

  const getLength = () => {
    return length;
  };

  const getTimesHit = () => {
    return timesHit;
  };

  return {
    getLength,
    getTimesHit,
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
  const cellsHit = [];

  const getBoard = () => {
    return [...board];
  };

  const getAllShips = () => {
    return [...placedShips];
  };

  function allShipsSunk() {
    for (let ship of placedShips) {
      if (!ship.isSunk()) return false;
    }
    return true;
  }

  function placeShip(shipLength, coords, placeOnXAxis) {
    if (!areCoordsValid(coords)) throw new Error("Invalid coordinates.");

    const x = coords[0];
    const y = coords[1];
    const tailX = placeOnXAxis ? shipLength + x - 1 : x;
    const tailY = placeOnXAxis ? y : shipLength + y - 1;

    if (!isPositionValid([x, y], [tailX, tailY])) return false;

    const ship = Ship(shipLength);
    placedShips.push(ship);

    if (placeOnXAxis) {
      for (let i = x; i <= tailX; i++) {
        board[i][y].ship = ship;
      }
    } else {
      for (let i = y; i <= tailY; i++) {
        board[x][i].ship = ship;
      }
    }
    return true;
  }

  function isPositionValid(initialCoords, tailCoords) {
    const x = initialCoords[0];
    const y = initialCoords[1];
    const tailX = tailCoords[0];
    const tailY = tailCoords[1];

    if (tailX >= 10 || tailY >= 10) return false;

    for (let i = x; i <= tailX; i++) {
      for (let j = y; j <= tailY; j++) {
        if (board[i][j].ship) return false;
      }
    }
    return true;
  }

  function receiveAttack(coords) {
    if (!areCoordsValid(coords)) throw new Error("Invalid coordinates.");
    const x = coords[0];
    const y = coords[1];
    const targetCell = board[x][y];

    if (targetCell.hit === true) throw new Error(`Already shot at ${x}, ${y}`);

    targetCell.hit = true;
    cellsHit.push([x, y]);

    if (targetCell.ship) {
      targetCell.ship.hit();
      return true;
    }
    return false;
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

  function areCoordsHit(coords) {
    if (!Array.isArray(coords)) throw new TypeError("An array must be passed.");
    if (cellsHit.length === 0) return false;

    return cellsHit.some(
      (element) => element[0] === coords[0] && element[1] === coords[1],
    );
  }

  function prettyPrint() {
    for (let y = 0; y < 10; y++) {
      const arr = [];
      for (let x = 0; x < 10; x++) {
        let symbol = 0;
        if (board[x][y].ship) symbol = 1;
        if (board[x][y].hit) symbol = "x";
        arr.push(symbol);
      }
      console.log(arr.join(" "));
    }
  }

  return {
    getBoard,
    getAllShips,
    placeShip,
    receiveAttack,
    allShipsSunk,
    areCoordsHit,
    prettyPrint,
  };
}
