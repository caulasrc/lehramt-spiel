import { GameModel } from "models/GameModel";
import { LogsModel } from "models/LogsModel";
import { PlayerData } from "models/PlayerData";

export function AutoFillHandCmd(player: PlayerData): boolean {

  const gm = GameModel.instance;
  const lm = LogsModel.instance;
  if (player.hand.length < 4) {
    gm.autoFillHand(player);
    lm.fillHand(player);
    return true;
  }
  return false;
}
