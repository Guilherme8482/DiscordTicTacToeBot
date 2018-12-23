import { TTTDiscord } from "./TicTacToeDiscord";

const d: {token: string, channelId: string} = require('../discord.config.json')

!async function main(){
    const b = await new TTTDiscord(d.token, d.channelId).init()
    b.playForTwoPlayers()
}()