import { Board } from "./Board"
import { question } from 'readline-sync'
import { range } from 'lodash'

export class TicTacToe{
    protected board: Board

    constructor(protected boardSize: number){
        this.board = new Board(boardSize)
    }
    async playForOnePlayer(){
        this.board = new Board(this.boardSize)
        for(const i of range(this.boardSize ** 2)){            
            await this.clear()
            await this.print(this.board.toString())            
            const index = (i % 2 === 0) 
                ? await this.askPosition()
                : 0 | Math.random() * this.boardSize ** 2
            this.board.makePlay(index - 1)
            if(this.board.haveAWinner())
                break
            this.board.nextPlayer()
        }
        await this.clear()
        await this.print(this.board.toString())
        const winner = this.board.getEmoji(this.board.getCurrentPlayer())
        this.print(`Player ${winner} was win!`)
    }
    async playForTwoPlayers(){
        this.board = new Board(this.boardSize)
        for(const _ of range(this.boardSize ** 2)){
            await this.clear()
            await this.print(this.board.toString())
            const index = await this.askPosition()
            this.board.makePlay(index - 1)
            if(this.board.haveAWinner())
                break
            this.board.nextPlayer()
        }
        await this.clear()
        await this.print(this.board.toString())
        const winner = this.board.getEmoji(this.board.getCurrentPlayer())
        this.print(`Player ${winner}  was win!`)
    }
    protected async askPosition(){
        let position: number
        while(true){
            position = Number(await this.scan('Which position you want to mark? '))
            if( position >= 1 
                && position <= this.boardSize ** 2 
                && this.board.positionIsFree(position - 1))
                break
            await this.print('You cant mark in this, please say...')
        }
        return position
    }
    async print(message: string){
        console.log(message)
    }
    async scan(message?: string){
        return question(message || '')
    }
    async clear(){
        console.clear()
    }
}