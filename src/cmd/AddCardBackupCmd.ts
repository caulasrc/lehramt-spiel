import { GameModel } from "models/GameModel";
import { LogsModel } from "models/LogsModel";
import { CardData, PlayerData } from "models/PlayerData";

export function AddCardBackupCmd(player: PlayerData, cd: CardData) {
  if (player.timeBackup) {
    return;
  }
  GameModel.instance.addBackupTime(player, cd);
  LogsModel.instance.backup(player, cd);
}
