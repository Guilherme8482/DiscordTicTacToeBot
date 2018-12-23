import { TTTDiscord } from "./TicTacToeDiscord";

const d: {token: string, channelId: string} = require('../discord.config.json')

!async function main(){
    const b = await new TTTDiscord(d.token, d.channelId).init()
    b.playForTwoPlayers()
}()

// https://discordapp.com/oauth2/authorize?client_id=525770684505522185&scope=bot&permissions=8