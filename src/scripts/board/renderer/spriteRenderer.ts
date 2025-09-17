import { SpriteMap } from "../../common/records/spriteMap"

export class SpriteRenderer{
    public connectImageSrcToSpriteMap() {
        SpriteMap["white-pawn"].src = "src/assets/pw.svg"
        SpriteMap["white-bishop"].src = "src/assets/bw.svg"
        SpriteMap["white-knight"].src = "src/assets/nw.svg"
        SpriteMap["white-rook"].src = "src/assets/rw.svg"
        SpriteMap["white-queen"].src = "src/assets/qw.svg"
        SpriteMap["white-king"].src = "src/assets/kw.svg"
        SpriteMap["black-pawn"].src = "src/assets/pb.svg"
        SpriteMap["black-bishop"].src = "src/assets/bb.svg"
        SpriteMap["black-knight"].src = "src/assets/nb.svg"
        SpriteMap["black-rook"].src = "src/assets/rb.svg"
        SpriteMap["black-queen"].src = "src/assets/qb.svg"
        SpriteMap["black-king"].src = "src/assets/kb.svg"
    }
}