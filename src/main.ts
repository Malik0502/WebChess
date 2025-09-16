import { Board } from "./scripts/board/board"
import { BoardRenderer } from "./scripts/board/boardRenderer";
import { BlackTileColor, WhiteTileColor } from "./scripts/common/constants/canvasColors";
import { GameManager } from "./scripts/game/manager/gameManagement/gameManager";
import { AlgebraicNotationParser } from "./scripts/game/manager/turnManagement/algebraicNotationParser";
import { TurnManager } from "./scripts/game/manager/turnManagement/turnManager";
import { PieceFactory } from "./scripts/game/pieces/factories/pieceFactory"
import { SlidingMovement } from "./scripts/game/pieces/pieceMovement/slidingMovement";
import { TableRenderer } from "./scripts/table/tableRenderer";

let gameBoard: Board;
let boardRenderer: BoardRenderer; 
let gameManager: GameManager;
let turnManager: TurnManager;
let algebraicNotationParser: AlgebraicNotationParser;
let tableRenderer: TableRenderer;
let canvas: HTMLCanvasElement;

window.onload = () => {
    gameBoard = new Board(new PieceFactory(), new SlidingMovement())
    boardRenderer = new BoardRenderer(gameBoard, document.getElementById("game-canvas") as HTMLCanvasElement, WhiteTileColor, BlackTileColor)
    algebraicNotationParser = new AlgebraicNotationParser();
    tableRenderer = new TableRenderer();
    turnManager = new TurnManager(algebraicNotationParser, tableRenderer);
    gameManager = new GameManager(boardRenderer, turnManager);
    canvas = boardRenderer.canvas;

    canvas.addEventListener("click", handleClick)
    
}

function handleClick(event: MouseEvent){
    const rect = canvas.getBoundingClientRect();

    // calcs mouse pos inside the canvas 
    const mousePos: [x: number, y: number] = [Math.round(event.clientX - rect.left), Math.round(event.clientY - rect.top)];

    gameManager.handleMouseClick(mousePos);
    console.log(gameBoard.gamePieces)
}