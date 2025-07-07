import { Board } from "./scripts/board/board"
import { GameManager } from "./scripts/game/manager/gameManager";
import { PieceFactory } from "./scripts/game/pieces/pieceFactory"

let gameBoard  : Board;
let gameManager: GameManager;
let canvas: HTMLCanvasElement;

window.onload = () => {
    gameBoard = new Board(document.getElementById("game-canvas") as HTMLCanvasElement, "#F0D9B5", "#B58863", new PieceFactory())
    gameManager = new GameManager(gameBoard);
    canvas = gameBoard.canvas;

    canvas.addEventListener("click", handleClick)
}

function handleClick(event: MouseEvent){
    const rect = canvas.getBoundingClientRect();

    // calcs mouse pos inside the canvas 
    const mousePos: [x: number, y: number] = [Math.round(event.clientX - rect.left), Math.round(event.clientY - rect.top)];

    gameManager.handleMouseClick(mousePos);
}