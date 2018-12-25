import { TTTDiscord } from "./TicTacToeDiscord"
import { DiscordConfig } from "./Console"

!async function main(){
    const dcList = <DiscordConfig[]>require('../discord.config.json')
    for(const dc of dcList){
        const game = await new TTTDiscord(dc).init()
        game.play()
    }
}()