import "./reset.css";
import "./styles.css";
import { Player, Computer } from "./players.js";

function Game() {
  const playerContainer = document.querySelector(".player-board");
  const computerContainer = document.querySelector(".computer-board");

  let player;
  let computer;

  function start() {
    player = Player("Player");
    computer = Computer();

    playerContainer.textContent = "";
    computerContainer.textContent = "";

    player.board.placeShip(5, [0, 0], true);
    player.board.placeShip(4, [0, 1], true);
    player.board.placeShip(3, [0, 2], true);
    player.board.placeShip(3, [0, 3], true);
    player.board.placeShip(2, [0, 4], true);

    computer.placeShips(5, 4, 3, 3, 2);

    playGame();
  }

  async function playGame() {
    let playerCells = player.getCells();
    let computerCells = computer.getCells();

    renderBoard(playerCells, playerContainer);
    renderBoard(computerCells, computerContainer);

    while (true) {
      // Player's turn
      await new Promise((resolve) => {
        computerCells.forEach((cell) => {
          cell.element.addEventListener("click", () => {
            try {
              computer.board.receiveAttack(cell.coords);

              computerCells = computer.getCells();
              renderBoard(computerCells, computerContainer);

              resolve();
            } catch (e) {
              console.log(e.message);
            }
          });
        });
      });
      if (computer.board.allShipsSunk()) return handleWin(player);

      // Computer's turn
      await new Promise((resolve) => {
        setTimeout(() => {
          player.receiveComputerAttack();

          playerCells = player.getCells();
          renderBoard(playerCells, playerContainer);

          resolve();
        }, 1000);
      });

      if (player.board.allShipsSunk()) return handleWin(computer);
    }
  }

  function handleWin(winner) {
    alert(`${winner.name} has won.`);
    start();
  }

  function renderBoard(cells, container) {
    container.textContent = "";
    cells.forEach((cell) => container.appendChild(cell.element));
  }

  return {
    start,
  };
}

const game = Game();
game.start();
