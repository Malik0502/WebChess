import { expect, describe, beforeEach, test, vi, beforeAll } from 'vitest';
import { PieceRenderer } from '../../scripts/board/renderer/pieceRenderer';
import { Board } from '../../scripts/board/board';
import { PieceFactory } from '../../scripts/game/pieces/factories/pieceFactory';
import { SlidingMovement } from '../../scripts/game/pieces/pieceMovement/slidingMovement';
import { TileRenderer } from '../../scripts/board/renderer/tileRenderer';
import * as fs from 'fs';
import type { GameTile } from '../../scripts/board/entities/gameTile';
import { ControlManager } from '../../scripts/game/manager/controlManagement/controlManager';

vi.mock('../../scripts/common/records/spriteMap', () => {
  return {
    SpriteMap: {
      "white-pawn": {} as HTMLImageElement,
      "white-bishop": {} as HTMLImageElement,
      "white-knight": {} as HTMLImageElement,
      "white-rook": {} as HTMLImageElement,
      "white-queen": {} as HTMLImageElement,
      "white-king": {} as HTMLImageElement,
      "black-pawn": {} as HTMLImageElement,
      "black-bishop": {} as HTMLImageElement,
      "black-knight": {} as HTMLImageElement,
      "black-rook": {} as HTMLImageElement,
      "black-queen": {} as HTMLImageElement,
      "black-king": {} as HTMLImageElement
    }
  };
});

function createMockContext2D(): CanvasRenderingContext2D {
  // Alle Methoden als leere Funktionen mocken
  const methods = [
    "fillRect", "clearRect", "strokeRect", "beginPath",
    "closePath", "moveTo", "lineTo", "arc", "fill", "stroke",
    "fillText", "strokeText", "drawImage", "save", "restore",
    "translate", "rotate", "scale", "setLineDash", "fillStyle",
    "strokeStyle", "lineWidth", "font", "textAlign", "textBaseline",
    "measureText"
  ] as const;

  const ctx: any = {};

  methods.forEach((m) => {
    ctx[m] = vi.fn();
  });

  return ctx as CanvasRenderingContext2D;
}

describe('Board and Renderer Tests', () => {
    let mockCtx: CanvasRenderingContext2D;
    let factory: PieceFactory;
    let slidingMovement: SlidingMovement;
    let board: Board;
    let tileRenderer: TileRenderer;
    let pieceRenderer: PieceRenderer;
    let controlManager: ControlManager;

    beforeEach(() => {
        mockCtx = createMockContext2D();
        factory = new PieceFactory();
        slidingMovement = new SlidingMovement();
        board = new Board(factory, slidingMovement);
        controlManager = new ControlManager();

        const jsonString = fs.readFileSync('src/tests/controlledTiles/board.json', 'utf-8');
        board.gameTiles = JSON.parse(jsonString)

        tileRenderer = new TileRenderer(mockCtx, board);
        pieceRenderer = new PieceRenderer(mockCtx, board, tileRenderer);
        pieceRenderer.drawStartPiecesOnChessBoard();
    });

    test("board and pieces generate properly on start up", () => {
        expect(board.gameTiles.length).toBe(8);
        expect(board.gameTiles[0].length).toBe(8);
    });

    test("controlled Tiles generate correctly on start up", () => {
        const controlledGameTiles: GameTile[] = [];
        const expectedControlledTiles: GameTile[] = [];

        expectedControlledTiles.push(...board.gameTiles[2]);
        expectedControlledTiles.push(...board.gameTiles[5]);

        controlManager.calcControlledTilesOnStart(board);

        board.gameTiles.forEach(row => {
            row.forEach(tile => {
                if(tile.control.controllingPieces.length > 0){
                    controlledGameTiles.push(tile);
                }
            });
        });

        expect(controlledGameTiles.length).toBe(expectedControlledTiles.length);
        expect(controlledGameTiles).toStrictEqual(expectedControlledTiles)
    })
});

