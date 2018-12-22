import { range } from 'lodash'

const COL_SEPARATOR = ' | '
const ROW_SEPARATOR = '---'
const BREAK_LINE = '\n'
const O = 'O'
const X = 'X'

export class Board{
    private board: string[][]
    private currentPlayer = X

    constructor(size: number){
        if(size < 3) throw new Error('new Board needs at least 3 size.')
        let i = 1
        this.board = range(size).map(() => range(size).map(() => String(i++)))
    }
    toString(){
        return this.board
            .map(line => line
                .map(m => m)
                .join(COL_SEPARATOR)            
            )
            .join(BREAK_LINE + range(this.board.length)
                .map(() => ROW_SEPARATOR)
                .join('') + BREAK_LINE
            )
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
        return this.board[i][j] !== O && this.board[i][j] !== X
    }
    checkWinner(){        
        const inverse = range(this.board.length).map(() => new Array<string>())
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
    private lineIsWinner(markers: string[]){
        for(const marker of markers)
            if(marker !== this.currentPlayer)
                return false
        return true
    }
    nextPlayer(){
        if(this.currentPlayer === X)
            return this.currentPlayer = O
        else
            return this.currentPlayer = X
    }
    getCurrentPlayer(){
        return this.currentPlayer
    }
}