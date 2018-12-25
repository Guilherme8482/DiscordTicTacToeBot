import { range } from 'lodash'

const COL_SEPARATOR = ' | '
const ROW_SEPARATOR = '--'
const BREAK_LINE = '\n'
const SPACER = ' '

export enum Marker{
    X,
    O,
    BLANK
}

export interface BoardOptions{
    size: number
    emojiX?: string
    emojiO?: string
    spacerSize?: number
}

export class Board{
    private board: Marker[][]
    private currentPlayer = Marker.X
    public emojis: string[] = []
    private spacerSize: number

    constructor({size, emojiX, emojiO, spacerSize}: BoardOptions){
        if(size < 3) throw new Error('new Board needs at least 3 size.')
        this.board = range(size).map(() => range(size).map(() => Marker.BLANK))
        this.emojis[Marker.X] = emojiX || '🤣'
        this.emojis[Marker.O] = emojiO || '😍'
        this.spacerSize = spacerSize  || 1
    }
    setEmojis({x, o}: {x?: string, o?: string}){
        if(x) this.emojis[Marker.X] = x
        if(o) this.emojis[Marker.O] = o
    }
    toString(){
        const spacer = SPACER.repeat(this.spacerSize)
        const separator = ROW_SEPARATOR.repeat(this.board.length * this.spacerSize)
        return this.board
            .map((line, i) => line
                .map((m, j) => this.getEmoji(m) || spacer + String(3 * i + j + 1) + spacer)
                .join(COL_SEPARATOR)
            )
            .join(BREAK_LINE + separator + BREAK_LINE)
    }
    indexToCoordenate(index: number){
        return [
            0 | index / this.board.length,
            index % this.board.length
        ]
    }
    makePlay(index: number){
        const [i, j] = this.indexToCoordenate(index)
        this.board[i][j] = this.currentPlayer
        return true
    }
    positionIsFree(index: number){
        const [i, j] = this.indexToCoordenate(index)
        return this.board[i][j] !== Marker.O && this.board[i][j] !== Marker.X
    }
    haveAWinner(){        
        const inverse = range(this.board.length).map(() => new Array<Marker>())
        for(const i of range(this.board.length))
            for(const j of range(this.board.length))
                inverse[i][j] = this.board[j][i]
        const target = [
            ...inverse,                                 //vertical lines
            ...this.board,                              //horizontal lines
            this.board.map((_, i, a) => a[i][i]),       //main diagonal
            this.board.map((_, i, a) => a[i][this.board.length - 1 - i])    //inverse diagonal
        ]
        for(const line of target)
            if(this.lineIsWinner(line))
                return true
        return false
    }
    private lineIsWinner(markers: Marker[]){
        for(const marker of markers)
            if(marker !== this.currentPlayer)
                return false
        return true
    }
    nextPlayer(){
        if(this.currentPlayer === Marker.X)
            return this.currentPlayer = Marker.O
        else
            return this.currentPlayer = Marker.X
    }
    getCurrentPlayer(){
        return this.currentPlayer
    }
    getEmoji(marker: Marker){
        return this.emojis[marker]
    }
}