import { GameBoardCreator } from "./scripts/board/chessBoardCreator"
import { PieceFactory } from "./scripts/game/pieces/pieceFactory"

let gameBoard  : GameBoardCreator;

window.onload = () => {
    gameBoard = new GameBoardCreator(document.getElementById("game-canvas") as HTMLCanvasElement, "#F0D9B5", "#B58863", new PieceFactory())
    gameBoard.drawChessBoard();
}