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
