import { Board } from "./scripts/board/board"
import type { GameTile } from "./scripts/board/entities/gameTile";
import { BoardRenderer } from "./scripts/board/renderer/boardRenderer";
import { MovePreviewRenderer } from "./scripts/board/renderer/movePreviewRenderer";
import { PieceRenderer } from "./scripts/board/renderer/pieceRenderer";
import { SpriteRenderer } from "./scripts/board/renderer/spriteRenderer";
import { TileRenderer } from "./scripts/board/renderer/tileRenderer";
import { BlackTileColor, WhiteTileColor } from "./scripts/common/constants/canvasColors";
import { ControlManager } from "./scripts/game/manager/controlManagement/controlManager";
import { GameManager } from "./scripts/game/manager/gameManagement/gameManager";
import { AlgebraicNotationParser } from "./scripts/game/manager/turnManagement/algebraicNotationParser";
import { TurnManager } from "./scripts/game/manager/turnManagement/turnManager";
import { PieceFactory } from "./scripts/game/pieces/factories/pieceFactory"
import { SlidingMovement } from "./scripts/game/pieces/pieceMovement/slidingMovement";
import { TableRenderer } from "./scripts/table/tableRenderer";

let gameBoard: Board;

let boardRenderer: BoardRenderer;
let spriteRenderer: SpriteRenderer;
let tileRenderer: TileRenderer;
let pieceRenderer: PieceRenderer;
let movePreviewRenderer: MovePreviewRenderer;

let gameManager: GameManager;
let turnManager: TurnManager;
let controlManager: ControlManager;
let algebraicNotationParser: AlgebraicNotationParser;
let tableRenderer: TableRenderer;
let canvas: HTMLCanvasElement;

window.onload = () => {

    canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    const canvasContext: CanvasRenderingContext2D = canvas.getContext("2d")!;

    gameBoard = new Board(new PieceFactory(), new SlidingMovement())

    spriteRenderer = new SpriteRenderer();
    tileRenderer = new TileRenderer(canvasContext, gameBoard);
    pieceRenderer = new PieceRenderer(canvasContext, gameBoard, tileRenderer);
    movePreviewRenderer = new MovePreviewRenderer(gameBoard, canvasContext, tileRenderer, pieceRenderer); 
    boardRenderer = new BoardRenderer(gameBoard, canvas, spriteRenderer, tileRenderer, pieceRenderer, WhiteTileColor, BlackTileColor)
    tableRenderer = new TableRenderer();
    

    algebraicNotationParser = new AlgebraicNotationParser();

    turnManager = new TurnManager(algebraicNotationParser, tableRenderer);
    gameManager = new GameManager(gameBoard, pieceRenderer, movePreviewRenderer, tileRenderer, turnManager);
    controlManager = new ControlManager();

    boardRenderer.drawChessBoard().then(() => {
        controlManager.calcControlledTilesOnStart(gameBoard);
    });

    canvas.addEventListener("click", handleClick)
    
}

function handleClick(event: MouseEvent){
    const rect = canvas.getBoundingClientRect();

    // calcs mouse pos inside the canvas 
    const mousePos: [x: number, y: number] = [Math.round(event.clientX - rect.left), Math.round(event.clientY - rect.top)];

    gameManager.handleMouseClick(mousePos);
    console.log(gameBoard.gamePieces)
}