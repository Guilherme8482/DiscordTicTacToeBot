import { TTTDiscord } from "./TicTacToeDiscord"
import { DiscordConfig } from "./Console"

!async function main(){
    const dc = <DiscordConfig>require('../discord.config.json')
    const game = await new TTTDiscord(dc).init()
    game.play()
}()