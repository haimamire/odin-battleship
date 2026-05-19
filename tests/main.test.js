import { Ship } from "../src/game-components";

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
