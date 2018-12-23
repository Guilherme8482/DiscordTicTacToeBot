import { TicTacToe } from "./TicTacToe"
import { Client, TextChannel, Message, User } from 'discord.js'
import { Board } from "./Board";
import { range } from "lodash";

export class TTTDiscord extends TicTacToe{
    public client = new Client()
    private channel?: TextChannel
    private firstPlayer?: User
    private secondPlayer?: User
    
    constructor(readonly token: string, readonly channelId: string){
        super(3)
    }
    async playForTwoPlayers(){
        this.firstPlayer = await this.getPlayer()
        await this.print(`Okay, ${this.firstPlayer.username}, you're playing as X`)
        this.secondPlayer = await this.getPlayer()
        await this.print(`Okay, ${this.secondPlayer.username}, you're playing as O`)

        this.board = new Board(this.boardSize)
        for(const i of range(this.boardSize ** 2)){
            await this.clear()
            await this.print(this.board.toString())
            let index 
            if(i % 2 === 0)
                index = await this.askPosition(this.firstPlayer)
            else            
                index = await this.askPosition(this.secondPlayer)
            this.board.makePlay(index - 1)
            if(this.board.checkWinner())
                break
            this.board.nextPlayer()
        }
        await this.clear()
        await this.print(this.board.toString())
        this.print(`Player ${this.board.getCurrentPlayer()} was win!`)
    }
    protected async askPosition(user?: User){
        let position: number
        while(true){
            await this.print(`Which position you want to mark ${user && user.username || ''}?`)
            let msg
            if(user)
                msg = await this.nextValidMessage(msg => user.id === msg.author.id)
            else
                msg = await this.nextMessage()
            position = Number(msg.content)
            if( position >= 1 
                && position <= this.boardSize ** 2 
                && this.board.positionIsFree(position - 1)
            )
                break
            await this.print('You cant mark in this, please say...')
        }
        return position
    }
    async init(){
        await this.client.login(this.token)
        this.channel = <TextChannel>this.client.channels.get(this.channelId)
        return this
    }
    async print(message: string){
        if(this.channel)
            await this.channel.send(message)
    }
    async scan(question?: string){
        if(question)
            await this.print(question)
        return (await this.nextValidMessage(this.msgIsAllowed)).content
    }
    msgIsAllowed = (message: Message) => {
        return message.channel.id === this.channelId && message.author.id !== this.client.user.id
    }
    nextMessage() : Promise<Message> {
        return new Promise(resolve => {
            this.client.once('message', msg => resolve(msg))
        })
    }
    async nextValidMessage(condition: (msg: Message) => boolean){
        let msg: Message
        do
            msg = await this.nextMessage()
        while(!condition(msg))
        return msg
    }
    async getPlayer(){
        await this.print('Who wants to play TTT? If you want, just say "me"')
        const msg = await this.nextValidMessage(
            msg => this.msgIsAllowed(msg) && !!msg.content.match(/me/)
        )
        return msg.author
    }
    async clear(){
        try{
            if(this.channel){
                const messages = await this.channel.fetchMessages({})
                await this.channel.bulkDelete(messages)
            }
        }
        catch(e){
        }        
    }
}