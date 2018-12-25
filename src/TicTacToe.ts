import { Board, BoardOptions } from "./Board"
import { range } from 'lodash'
import { NodeConsole } from "./Console"

export class TicTacToe{
    protected board!: Board
    protected console = new NodeConsole()

    constructor(protected boardSize: number){
        this.reset()
    }
    reset(bOptions?: BoardOptions){
        this.board = new Board(bOptions || {size: this.boardSize})
        return this
    }
    async playForTwoPlayers(){        
        for(const _ of range(this.boardSize ** 2)){
            await this.console.clear()
            await this.console.print(this.toString())
            const index = await this.askPosition()
            this.board.makePlay(index - 1)
            if(this.board.haveAWinner()){                
                await this.console.clear()
                await this.console.print(this.winnerToSring())
                return
            }
            this.board.nextPlayer()
        }
        await this.console.clear()
        await this.console.print(this.tiedToString())
    }
    protected async getPlayerMessage(question?: string){
        return await this.console.question(question)
    }
    protected async askPosition(){
        while(true){
            const position = Number(await this.getPlayerMessage('Which position you want to mark? '))
            if( position >= 1 
                && position <= this.boardSize ** 2 
                && this.board.positionIsFree(position - 1))
                return position
            await this.console.print('You cant mark in this, please say...')
        }
    }
    protected toString(){
        return 'Tic Tac Toe\n' + this.board.toString()
    }
    protected winnerToSring(){
        const winner = this.board.getEmoji(this.board.getCurrentPlayer())
        return this.toString() + `\nPlayer ${winner}  was win!`
    }
    protected tiedToString(){
        return this.toString() + `\nUnfortunately no one w the game.`
    }
}