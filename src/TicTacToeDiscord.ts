import { TicTacToe } from "./TicTacToe"
import { User } from 'discord.js'
import { Board, Marker } from "./Board";
import { range } from "lodash";
import { DiscordConsole } from "./Console";

const emojiFinder = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g

interface PlayerEmoji{
    user: User
    emoji?: string
}

export class TTTDiscord extends TicTacToe{ 
    console: DiscordConsole
    protected player?: {X: PlayerEmoji, O: PlayerEmoji}
    private currentPlayer?: PlayerEmoji

    constructor(token: string, channelId: string){
        super(3)
        this.console = new DiscordConsole(token, channelId)
    }
    async init(){
        await this.console.init()
        return this
    }
    toString(){
        return (this.player
            ? `___${this.player.X.user.username}___ vs ___${this.player.O.user.username}___\n`
            : 'Tic Tac Toe')
            + this.board.toString()
    }
    async play(){
        this.player = {
            X: await this.getPlayer(Marker.X),
            O: await this.getPlayer(Marker.O)
        }
        this.currentPlayer = this.player.X
        this.reset({
            size: this.boardSize, 
            emojiX: this.player.X.emoji, 
            emojiO: this.player.O.emoji,
            spacerSize: 3
        })
        await this.playForTwoPlayers()
        this.waitNextGame()
    }
    protected async waitNextGame(){
        await this.console.print('If someone wants to play again, just say "again"')
        await this.console.nextValidMessage(
            msg => msg.content.toLowerCase().match(/again/) !== null
        )
        this.playForTwoPlayers()
    }
    protected async askPosition(){
        const user = this.currentPlayer && this.currentPlayer.user
        while(true){
            await this.console.print(`${user  || ''}, which position you want to mark?`)
            const msg = await this.console.nextValidMessage(
                msg => (!user) || (user && user.id === msg.author.id)
            )
            const position = Number(msg.content)
            if( position >= 1 
                && position <= this.boardSize ** 2 
                && this.board.positionIsFree(position - 1)
            )
                return position
            await this.console.print('You cant mark in this, please say...')
        }
    }
    async getPlayer(marker: Marker){
        await this.console.print('Who wants to play TTT? If you want, just say "me"')
        const msg = await this.console.nextValidMessage(
            msg => msg.content.match(/me/) !== null
        )
        const emoji = (((msg.content.split('as').pop() || '').match(emojiFinder) || []).shift() || '')
        await this.console.print(`Okay ${msg.author.username || ''}, you're playing as ${emoji || this.board.getEmoji(marker)}`)
        return {user: msg.author, emoji}
    }
    nextPlayer(){
        if(!this.player) 
            throw new Error('Player is needed to continue.')
        if(this.currentPlayer === this.player.X)
            this.currentPlayer = this.player.O
        else
            this.currentPlayer = this.player.X
    }
    endGameToString(){
        const user = this.currentPlayer && this.currentPlayer.user.toString() 
            || this.board.getEmoji(this.board.getCurrentPlayer())
        return this.toString() + `\nPlayer ${user} was win!`
    }
}