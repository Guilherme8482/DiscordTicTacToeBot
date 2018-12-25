import { question } from "readline-sync";
import { Client, TextChannel, Message } from "discord.js";


export class NodeConsole{
    async print(message: string){
        console.log(message)
    }
    async question(message?: string){
        return question(message || '')
    }
    async clear(){
        console.clear()
    }
}

export class DiscordConsole extends NodeConsole{
    private client = new Client()
    private channel?: TextChannel

    constructor(readonly token: string, readonly channelId: string){
        super()
    }
    async init(){
        await this.client.login(this.token)
        this.channel = <TextChannel>this.client.channels.get(this.channelId)
        return this
    }
    nextMessage() : Promise<Message> {
        return new Promise(resolve => {
            this.client.once('message', msg => resolve(msg))
        })
    }
    msgIsAllowed = (message: Message) => {
        return message.channel.id === this.channelId && message.author.id !== this.client.user.id
    }
    async nextValidMessage(condition: (msg: Message) => boolean){
        while(true){
            const msg = await this.nextMessage()
            if(this.msgIsAllowed(msg) && condition(msg)) return msg
        }
    }
    async print(message: string){
        if(this.channel)
            await this.channel.send(message)
    }
    async question(message?: string){
        if(message)
            await this.print(message)
        return (await this.nextValidMessage(this.msgIsAllowed)).content
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