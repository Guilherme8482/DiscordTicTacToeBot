import { TTTDiscord } from "./TicTacToyDiscord";

const token = "NTI1NzcwNjg0NTA1NTIyMTg1.Dv7jiw.wksrcxZNz85lfSCLoFhey00mM5c"
const channelId = '465958178891497474'

!async function main(){
    const b = await new TTTDiscord(token, channelId).init()
    b.playForTwoPlayers()
}()


