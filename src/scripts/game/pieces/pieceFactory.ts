import type { GameTile } from "../../board/entities/gameTile";
import { Bishop } from "./bishop";
import type { IPiece } from "./Interfaces/IPiece";
import type { IPieceFactory } from "./Interfaces/IPieceFactory";
import { King } from "./king";
import { Knight } from "./knight";
import { Pawn } from "./pawn";
import { Queen } from "./queen";
import { Rook } from "./rook";

export class PieceFactory implements IPieceFactory{
    
    createPiece(name: string, color: string, tile: GameTile): IPiece | undefined {
        if (name.includes("pawn")) {
            return new Pawn(name, color, tile.coordinates, tile);
        }
        if (name.includes("bishop")) {
            return new Bishop(name, color, tile.coordinates, tile);
        }
        if (name.includes("knight")) {
            return new Knight(name, color, tile.coordinates, tile);
        }
        if (name.includes("rook")) {
            return new Rook(name, color, tile.coordinates, tile);
        }
        if (name.includes("queen")) {
            return new Queen(name, color, tile.coordinates, tile);
        }
        if (name.includes("king")) {
            return new King(name, color, tile.coordinates, tile);
        }

        return undefined;
    }
}