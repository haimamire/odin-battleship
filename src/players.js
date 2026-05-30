import { Gameboard } from "./game-components.js";

export function Player(playerName, hidden = false) {
  if (typeof playerName !== "string")
    throw new TypeError("Player name must be a string.");

  const name = playerName;
  const board = Gameboard();

  function getCells() {
    const cells = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const element = document.createElement("div");
        element.className = "cell";

        if (!hidden && board.getBoard()[x][y].ship)
          element.classList.add("ship");
        if (board.getBoard()[x][y].hit) {
          if (board.getBoard()[x][y].ship) element.classList.add("ship");
          element.classList.add("hit");
        }

        cells.push({
          element,
          coords: [x, y],
        });
      }
    }
    return cells;
  }

  let nextComputerAttack = [];

  function receiveComputerAttack() {
    if (nextComputerAttack.length === 0) {
      return receiveRandomAttack();
    } else {
      while (true) {
        const coords = nextComputerAttack[0].shift();

        if (!board.areCoordsValid(coords) || board.wereCoordsHit(coords)) {
          nextComputerAttack.shift();
          if (nextComputerAttack.length === 0) return receiveRandomAttack();
          continue;
        }
        if (!board.foundShip(coords)) nextComputerAttack.shift();

        board.receiveAttack(coords);
        return coords;
      }
    }
  }

  function receiveRandomAttack() {
    while (true) {
      const coords = board.getRandomCoords();
      if (board.wereCoordsHit(coords)) continue;

      board.receiveAttack(coords);

      if (board.foundShip(coords)) {
        const [x, y] = coords;
        const rightArr = [],
          leftArr = [],
          topArr = [],
          bottomArr = [];

        for (let i = 1; i < 10; i++) {
          const rightCoords = [x + i, y];
          if (board.areCoordsValid(rightCoords)) rightArr.push(rightCoords);
          const leftCoords = [x - i, y];
          if (board.areCoordsValid(leftCoords)) leftArr.push(leftCoords);
          const topCoords = [x, y - i];
          if (board.areCoordsValid(topCoords)) topArr.push(topCoords);
          const bottomCoords = [x, y + i];
          if (board.areCoordsValid(bottomCoords)) bottomArr.push(bottomCoords);
        }
        nextComputerAttack.push(rightArr, leftArr, topArr, bottomArr);
      }
      return coords;
    }
  }

  return {
    name,
    board,
    getCells,
    receiveComputerAttack,
  };
}

export function Computer() {
  const { name, board, getCells } = Player("Computer", true);

  function placeShips(...shipLengths) {
    const shipsCoords = [];
    for (let shipLength of shipLengths) {
      while (true) {
        const randomCoords = board.getRandomCoords();
        const placeOnXAxis = getRandomBoolean();

        if (board.placeShip(shipLength, randomCoords, placeOnXAxis)) {
          shipsCoords.push(randomCoords);
          break;
        }
      }
    }
    return shipsCoords;
  }

  function getRandomBoolean() {
    return Math.round(Math.random());
  }

  return {
    name,
    board,
    getCells,
    placeShips,
  };
}
