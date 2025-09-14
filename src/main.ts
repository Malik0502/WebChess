import { Board } from "./scripts/board/board"
import { GameManager } from "./scripts/game/manager/gameManagement/gameManager";
import { AlgebraicNotationParser } from "./scripts/game/manager/turnManagement/algebraicNotationParser";
import { TurnManager } from "./scripts/game/manager/turnManagement/turnManager";
import { PieceFactory } from "./scripts/game/pieces/factories/pieceFactory"
import { SlidingMovement } from "./scripts/game/pieces/pieceMovement/slidingMovement";
import { TableRenderer } from "./scripts/table/tableRenderer";

let gameBoard  : Board;
let gameManager: GameManager;
let turnManager: TurnManager;
let algebraicNotationParser: AlgebraicNotationParser;
let tableRenderer: TableRenderer;
let canvas: HTMLCanvasElement;

window.onload = () => {
    gameBoard = new Board(document.getElementById("game-canvas") as HTMLCanvasElement, "#F0D9B5", "#B58863", new PieceFactory(), new SlidingMovement())
    algebraicNotationParser = new AlgebraicNotationParser();
    tableRenderer = new TableRenderer();
    turnManager = new TurnManager(algebraicNotationParser, tableRenderer);
    gameManager = new GameManager(gameBoard, turnManager);
    canvas = gameBoard.canvas;

    canvas.addEventListener("click", handleClick)
    
}

function handleClick(event: MouseEvent){
    const rect = canvas.getBoundingClientRect();

    // calcs mouse pos inside the canvas 
    const mousePos: [x: number, y: number] = [Math.round(event.clientX - rect.left), Math.round(event.clientY - rect.top)];

    gameManager.handleMouseClick(mousePos);
    console.log(gameBoard.gamePieces)
}