import { PlayerModel } from "models/PlayerModel";
import { GameModel } from "models/GameModel";
import { LogsModel } from "models/LogsModel";
import { AutoFillHandCmd } from "./AutoFillHandCmd";

export function FinishRoundCmd():boolean {

  const gm=GameModel.instance;
  const pm=PlayerModel.instance;
  const lm=LogsModel.instance;
  const players = pm.players;
  const curPlayer = players[gm.currentPlayerIndex];
  
  gm.setFlippedCards(curPlayer,[]);
  LogsModel.instance.finishRound(curPlayer);
  curPlayer.statistics.roundsFinished++;

  if(gm.checkMilestone(curPlayer)) {
    lm.milestoneReached(curPlayer);
  }

  if(gm.lastMilestoneReached(curPlayer)) {
    if(gm.finishGameForPlayerIndex===-1) {
      gm.finishGameForPlayerIndex=gm.currentPlayerIndex;
    }
  }
  
  if (gm.currentPlayerIndex === players.length - 1) {
    gm.currentPlayerIndex = 0;
  } else {
    gm.currentPlayerIndex++;
  }
  gm.currentPlayerStep = 0;

  if(gm.finishGameForPlayerIndex===gm.currentPlayerIndex) {
    document.dispatchEvent(new CustomEvent(gm.events.roundFinished));
    LogsModel.instance.gameWon(curPlayer);
    document.dispatchEvent(new CustomEvent("goto",{detail:"gameover"}));
    return true;
  }

  const nextPlayer=players[gm.currentPlayerIndex];
  AutoFillHandCmd(nextPlayer);

  document.dispatchEvent(new CustomEvent(gm.events.roundFinished));
  /*
  const curPlayerIsNowNpc=players[gm.currentPlayerIndex].isNpc;
  if(curPlayerIsNowNpc) {
   //
  } else {
    AutoFillHandCmd(players[gm.currentPlayerIndex]);
  }*/

  return false;
}
