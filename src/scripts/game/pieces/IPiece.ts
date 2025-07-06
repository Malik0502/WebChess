export interface IPiece{
    Name: string;
    Color: string;
    Value: number;
    SpritePath: string;

    MovePiece(): [startPosition: string, endPosition: string];
}