export interface IPiece{
    name: string;
    color: string;
    value: number;
    spritePath: string;
    startCoordinates: string;
    currentCoordinates: string;
    hasMoved: boolean;


    MovePiece(): [startPosition: string, endPosition: string];
}