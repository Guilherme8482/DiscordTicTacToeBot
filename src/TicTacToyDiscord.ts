import { TicTacToy } from "./TicTacToy"
import { Client, TextChannel } from 'discord.js'

export class TTTDiscord extends TicTacToy{
    public client = new Client()
    private channel?: TextChannel
    
    constructor(readonly token: string, readonly channelId: string){
        super(3)
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
    scan(question?: string): Promise<string>{
        return new Promise(async resolve => {
            if(question)
                await this.print(question)
            this.client.on('message', message => {
                if(message.channel.id === this.channelId 
                   && message.author.id !== this.client.user.id)
                    resolve(message.content)
            })
        })
    }
    async clear(){
        if(this.channel){
            const messages = await this.channel.fetchMessages({})
            await this.channel.bulkDelete(messages)
        }
    }
}