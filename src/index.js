import "./reset.css";
import "./styles.css";
import { Player, Computer } from "./players.js";

function Game() {
  const body = document.querySelector("body");
  const gameContainer = document.querySelector(".game-container");
  const playerContainer = document.querySelector(".player-board");
  const computerContainer = document.querySelector(".computer-board");

  let player;
  let computer;

  async function start() {
    player = Player("Player");
    computer = Computer();

    playerContainer.textContent = "";
    computerContainer.textContent = "";

    computer.placeShips(5, 4, 3, 3, 2);
    await dragNDropShips(5, 4, 3, 3, 2);

    playGame();
  }

  async function dragNDropShips(...ships) {
    const newGameContainer = Object.assign(document.createElement("div"), {
      className: "ship-placement board right",
    });
    body.insertBefore(newGameContainer, gameContainer);

    let placeOnXAxis = true;
    body.addEventListener("keydown", (e) => {
      if (e.key === "q") {
        placeOnXAxis = !placeOnXAxis;
        newGameContainer.classList.remove(placeOnXAxis ? "down" : "right");
        newGameContainer.classList.add(placeOnXAxis ? "right" : "down");
      }
    });

    while (true) {
      if (ships.length === 0) {
        newGameContainer.remove();
        document.querySelector(".help").remove();
        return;
      }

      const playerCells = player.getCells();
      renderBoard(playerCells, newGameContainer);

      await new Promise((resolve) => {
        playerCells.forEach((cell) => {
          cell.element.addEventListener("mouseover", () => {
            cell.element.classList.add("hover");
          });
          cell.element.addEventListener("mouseout", () => {
            cell.element.classList.remove("hover");
          });

          cell.element.addEventListener("click", () => {
            if (player.board.placeShip(ships[0], cell.coords, placeOnXAxis))
              ships.shift();
            resolve();
          });
        });
      });
    }
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
