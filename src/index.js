import "./reset.css";
import "./styles.css";
import { Player, Computer } from "./players.js";

function Game() {
  const gameContainer = document.querySelector(".game-container");
  const playerContainer = document.querySelector(".player-board");
  const computerContainer = document.querySelector(".computer-board");

  const player = Player("Player");
  const computer = Computer();

  function start() {
    player.board.placeShip(5, [0, 0], true);
    player.board.placeShip(4, [0, 1], true);
    player.board.placeShip(3, [0, 2], true);
    player.board.placeShip(3, [0, 3], true);
    player.board.placeShip(2, [0, 4], true);

    computer.placeShips(5, 4, 3, 3, 2);

    playGame();
  }

  async function playGame() {
    let playerBoard = player.board.getCells();
    let computerBoard = computer.board.getCells();

    renderBoard(playerBoard, playerContainer);
    renderBoard(computerBoard, computerContainer);

    while (true) {
      // Player's turn
      await new Promise((resolve) => {
        computerBoard.forEach((cell) => {
          cell.element.addEventListener("click", () => {
            try {
              computer.board.receiveAttack(cell.coords);

              computerBoard = computer.board.getCells();
              renderBoard(computerBoard, computerContainer);

              resolve();
            } catch (e) {
              console.log(e.message);
            }
          });
        });
      });

      // Computer's turn
      await new Promise((resolve) => {
        setTimeout(() => {
          player.receiveComputerAttack();

          playerBoard = player.board.getCells();
          renderBoard(playerBoard, playerContainer);

          resolve();
        }, 1000);
      });
    }
  }

  function renderBoard(board, container) {
    container.textContent = "";
    board.forEach((row) => container.appendChild(row.element));
  }

  return {
    start,
  };
}

const game = Game();
game.start();
