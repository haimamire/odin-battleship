import { Ship } from "../src/game-components";
import { Gameboard } from "../src/game-components";

describe("Ship", () => {
  test("throws an error if the ship is created with an invalid length", () => {
    expect(() => {
      Ship();
    }).toThrow();
    expect(() => {
      Ship("3");
    }).toThrow();
    expect(() => {
      Ship(Infinity);
    }).toThrow();
    expect(() => {
      Ship([]);
    }).toThrow();
    expect(() => {
      Ship(0);
    }).toThrow();
    expect(() => {
      Ship(3);
    }).not.toThrow();
  });

  test("sink condition", () => {
    const ship = Ship(5);
    ship.hit();
    expect(ship.isSunk()).toBeFalsy();

    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeFalsy();

    ship.hit();
    expect(ship.isSunk()).toBeTruthy();

    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
  });
});

describe("Gameboard", () => {
  test("checks if the board is created correctly", () => {
    const board = Gameboard();
    const fullArr = [];
    board.getBoard().forEach((row) => fullArr.push(...row));

    expect(fullArr.length).toBe(100);

    expect(typeof board.getBoard()[0][0]).toBe("object");
    expect(() => {
      board.getBoard()[10][10];
    }).toThrow();
  });

  test("doesn't take invalid coordinates", () => {
    const board = Gameboard();

    expect(() => {
      board.placeShip(5);
    }).toThrow();
    expect(() => {
      board.placeShip(5, 1, 2);
    }).toThrow();
    expect(() => {
      board.placeShip(5, []);
    }).toThrow();
    expect(() => {
      board.placeShip(5, [0, 10]);
    }).toThrow();
    expect(() => {
      board.placeShip(5, [4, 5]);
    }).not.toThrow();
  });

  test("doesn't allow the ship to be placed outside the board", () => {
    const board = Gameboard();

    // x axis
    expect(() => {
      board.placeShip(5, [6, 0], true);
    }).toThrow();
    expect(() => {
      board.placeShip(5, [5, 1], true);
    }).not.toThrow();
    expect(() => {
      board.placeShip(5, [0, 1], true);
    }).not.toThrow();

    // y axis
    expect(() => {
      board.placeShip(5, [0, 6], false);
    }).toThrow();
    expect(() => {
      board.placeShip(5, [1, 5], false);
    }).not.toThrow();
  });

  test("places a ship in the correct coordinates (x axis)", () => {
    const board = Gameboard();
    board.placeShip(5, [0, 0], true);

    expect(board.getBoard()[0][0].ship).not.toBeNull();
    expect(board.getBoard()[2][0].ship).not.toBeNull();
    expect(board.getBoard()[4][0].ship).not.toBeNull();
    expect(board.getBoard()[5][0].ship).toBeNull();
    expect(board.getBoard()[0][1].ship).toBeNull();

    expect(board.getBoard()[0][0].ship.getLength()).toBe(5);
  });

  test("places a ship in the correct coordinates (y axis)", () => {
    const board = Gameboard();
    board.placeShip(5, [0, 0], false);

    expect(board.getBoard()[0][0].ship).not.toBeNull();
    expect(board.getBoard()[0][2].ship).not.toBeNull();
    expect(board.getBoard()[0][4].ship).not.toBeNull();
    expect(board.getBoard()[0][5].ship).toBeNull();
    expect(board.getBoard()[1][0].ship).toBeNull();

    expect(board.getBoard()[0][0].ship.getLength()).toBe(5);
  });

  test("throws an error if the coordinates are occupied", () => {
    const board = Gameboard();
    board.placeShip(5, [0, 0], true);

    expect(() => {
      board.placeShip(5, [3, 0], false);
    }).toThrow();
    expect(() => {
      board.placeShip(5, [4, 0], true);
    }).toThrow();
    expect(() => {
      board.placeShip(5, [5, 0], false);
    }).not.toThrow();
  });
});
