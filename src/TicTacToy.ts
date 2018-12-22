import { Board } from "./Board"
import { question } from 'readline-sync'
import { range } from 'lodash'

function timeout(t: number){return new Promise(r => setTimeout(r, t))}

let i = 0
async function getPlay(){
    await timeout(500)
    return [1, 2, 5, 3, 9, 7][i++]
}

export class TicTacToy{
    private board: Board

    constructor(private boardSize: number){
        this.board = new Board(boardSize)
    }
    async playForOnePlayer(){
    }
    async playForTwoPlayers(){
        this.board = new Board(this.boardSize)
        for(const _ of range(this.boardSize ** 2)){
            await this.clear()
            await this.print(this.board.toString())
            const index = /*await getPlay() //*/await this.askPosition()
            this.board.makePlay(index - 1)
            if(this.board.checkWinner())
                break
            this.board.nextPlayer()
        }
        await this.clear()
        await this.print(this.board.toString())
        this.print(`Player ${this.board.getCurrentPlayer()} was win!`)
    }
    private async askPosition(){
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