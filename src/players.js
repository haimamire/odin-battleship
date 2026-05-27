import { Gameboard } from "./game-components.js";

export function Player(playerName) {
  if (typeof playerName !== "string")
    throw new TypeError("Player name must be a string.");

  const name = playerName;
  const board = Gameboard();

  function receiveRandomAttack() {
    while (true) {
      const randomCoords = getRandomCoords();
      if (!board.areCoordsHit(randomCoords)) {
        board.receiveAttack(randomCoords);
        break;
      }
    }
  }

  function getRandomCoords() {
    return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
  }

  return {
    name,
    board,
    receiveRandomAttack,
    getRandomCoords,
  };
}

export function Computer() {
  const { name, board, getRandomCoords } = Player("Computer");

  function placeShips(...shipLengths) {
    const shipsCoords = [];
    for (let shipLength of shipLengths) {
      while (true) {
        const randomCoords = getRandomCoords();
        const placeOnXAxis = getRandomBoolean();

        if (board.placeShip(shipLength, randomCoords, placeOnXAxis)) {
          shipsCoords.push(randomCoords);
          break;
        }
      }
    }
    console.log(`New ships placed at ${JSON.stringify(shipsCoords)}`);
    return shipsCoords;
  }

  function getRandomBoolean() {
    return Math.round(Math.random());
  }

  return {
    name,
    board,
    placeShips,
  };
}

const computer = Computer();
computer.placeShips(5, 4, 3, 3, 2);
computer.board.prettyPrint();

console.log("");

const player = Player("");
player.receiveRandomAttack();
player.board.prettyPrint();
