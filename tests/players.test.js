import { Player } from "../src/players";
import { Computer } from "../src/players";

describe("Player and computer creation", () => {
  test("throws an error if the player is created without a valid name", () => {
    expect(() => {
      Player();
    }).toThrow();
    expect(() => {
      Player("");
    }).not.toThrow();
    expect(() => {
      Computer();
    }).not.toThrow();
  });

  test("gameboard is different for each player", () => {
    const player = Player("test");
    const computer = Computer();

    player.board.placeShip(1, [0, 0], true);
    expect(player.board.allShipsSunk()).toBeFalsy();
    expect(computer.board.allShipsSunk()).toBeTruthy();
  });
});

describe("computer behavior", () => {
  test("places all ships on the board", () => {
    const computer = Computer();

    expect(() => {
      computer.placeShips(5, 4, 3, 3, 2);
    }).not.toThrow();

    expect(computer.board.getAllShips().length).toBe(5);

    // Checks if the sum of the lengths equals the amount of cells occupied by ships
    let cellsOccupied = 0;
    const computerBoard = computer.board.getBoard();
    for (let row of computerBoard) {
      row.forEach((cell) => {
        cell.ship ? cellsOccupied++ : undefined;
      });
    }
    expect(cellsOccupied).toBe(17);
  });
});
