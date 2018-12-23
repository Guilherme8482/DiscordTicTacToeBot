import { TicTacToe } from "./TicTacToe"
import { Client, TextChannel, Message, User, Emoji } from 'discord.js'
import { Board, Marker } from "./Board";
import { range } from "lodash";

const emojiFinder = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g

export class TTTDiscord extends TicTacToe{
    public client = new Client()
    private channel?: TextChannel
    
    constructor(readonly token: string, readonly channelId: string){
        super(3)
    }
    async playForTwoPlayers(){
        this.board = new Board(3)
        const player = {
            X: await this.getPlayer(Marker.X),
            O: await this.getPlayer(Marker.O)
        }
        this.board.setEmojis({x: player.X.emoji, o: player.O.emoji})
        const title = `${player.X.user.username} vs ${player.O.user.username}\n`
        let currentUser = player.X
        for(const i of range(this.boardSize ** 2)){
            currentUser = i % 2 === 0 ? player.X : player.O
            await this.clear()
            await this.print(title + this.board.toString())
            const index = await this.askPosition(currentUser.user)
            this.board.makePlay(index - 1)
            if(this.board.haveAWinner())
                break
            this.board.nextPlayer()
        }
        await this.clear()
        await this.print(title + this.board.toString())
        this.print(`Player ${currentUser.user} was win!`)
        this.playAgain()
    }
    protected async playAgain(){
        await this.print('If someone wants to play again, just say "again"')
        await this.nextValidMessage(
            msg => this.msgIsAllowed(msg) && msg.content.toLowerCase().match(/again/) !== null
        )
        this.playForTwoPlayers()
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
    async getPlayer(marker: Marker){
        await this.print('Who wants to play TTT? If you want, just say "me"')
        const msg = await this.nextValidMessage(
            msg => this.msgIsAllowed(msg) && msg.content.match(/me/) !== null
        )
        const emoji = (msg.content.match(emojiFinder) || []).shift()
        await this.print(`Okay, ${msg.author.username || ''}, you're playing as ${emoji || this.board.getEmoji(marker)}`)
        return {user: msg.author, emoji}
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