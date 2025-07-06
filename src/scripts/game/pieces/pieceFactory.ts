import { Bishop } from "./bishop";
import type { IPiece } from "./interfaces/IPiece";
import type { IPieceFactory } from "./interfaces/IPieceFactory";
import { King } from "./king";
import { Knight } from "./knight";
import { Pawn } from "./pawn";
import { Queen } from "./queen";
import { Rook } from "./rook";

export class PieceFactory implements IPieceFactory{
    
    createPiece(name: string, color: string, coordinate: string): IPiece {
        if(name.includes("pawn")){
            return new Pawn(name, color, coordinate)
        }
        if(name.includes("bishop")){
            return new Bishop(name, color, coordinate)
        }
        if(name.includes("knight")){
            return new Knight(name, color, coordinate)
        }
        if(name.includes("rook")){
            return new Rook(name, color, coordinate)
        }
        if(name.includes("queen")){
            return new Queen(name, color, coordinate)
        }
        if(name.includes("king")){
            return new King(name, color, coordinate)
        }

        return new King(name, color, coordinate)
    }


}