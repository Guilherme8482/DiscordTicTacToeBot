import { TTTDiscord } from "./TicTacToeDiscord"

interface DiscordConfig{
    token: string
    channelId: string
}

const d = <DiscordConfig>require('../discord.config.json')

!async function main(){
    const game = await new TTTDiscord(d.token, d.channelId).init()
    game.play()
}()