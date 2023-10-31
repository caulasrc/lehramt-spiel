import { GameModel } from "models/GameModel";
import { PlayerModel } from "models/PlayerModel";
import { NextBestStepCmd } from "./NextBestStepCmd";
import { FinishRoundCmd } from "./FinishRoundCmd";
import { WaitForNextTickCmd } from "./WaitForNextTickCmd";
import { LogsModel } from "models/LogsModel";
import { AutoFillHandCmd } from "./AutoFillHandCmd";
import { NextBrainlessStepCmd } from "./NextBrainlessStepCmd";


const createNpcTickInterval=()=>{
  const gm = GameModel.instance;
  console.log("createNpcTickInterval",gm.gameSpeed);
  if(gm.gameSpeed===0) {
    return setInterval(gm.dispatchTick.bind(gm,"tickNpc"), 500);
  }
  if(gm.gameSpeed===1) {
    return setInterval(gm.dispatchTick.bind(gm,"tickNpc"), 1000);
  }
  if(gm.gameSpeed===2) {
    return setInterval(gm.dispatchTick.bind(gm,"tickNpc"), 3000);
  }
  throw new Error("invalid gameSpeed");
};

export async function StartGameCmd(npcIndexes: Array<number>) {

  document.dispatchEvent(new CustomEvent("goto", { detail: "game" }));

  PlayerModel.instance.setPlayers(npcIndexes);
  const user = PlayerModel.instance.getUser();

  GameModel.instance.restart();
  LogsModel.instance.reset(); 
  LogsModel.instance.gameStarted(user);

  AutoFillHandCmd(user);
  startAutoTicks();
}

async function startAutoTicks() {
 
  const pm = PlayerModel.instance;
  const gm = GameModel.instance;

  let autoTickNpcInterval: NodeJS.Timeout=createNpcTickInterval();
  let gameSpeed=gm.gameSpeed;

  let gameover = false;
  while (!gameover) {

    if(gameSpeed!==gm.gameSpeed) {
      
      clearInterval(autoTickNpcInterval);
      autoTickNpcInterval=createNpcTickInterval();
      gameSpeed=gm.gameSpeed;
    }
    if(gm.currentPlayerIndex===-1) {
      break;
    }
    const curPlayer = pm.players[gm.currentPlayerIndex];
    const curPlayerIsUser = curPlayer.isNpc === false;

    if (curPlayerIsUser) {
      await WaitForNextTickCmd("tickUser");
    } else {
      await WaitForNextTickCmd("tickNpc");
    }

    if(gm.currentPlayerIndex===-1) {
      break;
    }
    const playerChanged=pm.players[gm.currentPlayerIndex]!==curPlayer;
    if(playerChanged) {
      continue;
    }

    let didStep=false;
    if(curPlayerIsUser) {
      didStep = await NextBestStepCmd(curPlayer);
    } else {
      if(pm.brainlessNpcs) {
        didStep = await NextBrainlessStepCmd(curPlayer);
      } else {
        didStep = await NextBestStepCmd(curPlayer);
      }
    }
    if (!didStep) {
      gameover = FinishRoundCmd();
    }
  }
  clearInterval(autoTickNpcInterval);
}
