import { GameBoardCreator } from "./scripts/board/chessBoardCreator"
import { PieceFactory } from "./scripts/game/pieces/pieceFactory"

window.onload = () => {
    const gameBoard : GameBoardCreator = new GameBoardCreator(document.getElementById("game-canvas") as HTMLCanvasElement, "#F0D9B5", "#B58863", new PieceFactory())

    gameBoard.drawChessBoard();
}