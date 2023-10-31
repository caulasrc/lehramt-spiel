import { LogsModel } from "models/LogsModel";
import { CardData, PlayerData } from "../models/PlayerData";
import { GameModel } from "models/GameModel";

export function FlipCardCmd(
  player: PlayerData,
  card: CardData,
  behavior: "flipOnly" | "unflipOnly" | "both"
) {

  if(card.costs<1) {
    console.error("cant flip negative cards");
    return;
  }

  if (behavior === "both") {
    const isFlipped=player.flipped.indexOf(card) > -1;
    if (!isFlipped) {
      GameModel.instance.flipCard(player, [card]);
      /*LogsModel.instance.addLog(
        player,
        player.name + " hat " + card.name + " geflipped."
      );*/
    } else {
      GameModel.instance.unflipCard(player, [card]);
      /*LogsModel.instance.addLog(
        player,
        player.name + " hat " + card.name + " zurück geflipped."
      );*/
    }
  }

  if (behavior === "flipOnly") {
    const isFlipped=player.flipped.indexOf(card) > -1;
    if (!isFlipped) {
      GameModel.instance.flipCard(player, [card]);
      /*LogsModel.instance.addLog(
        player,
        player.name + " hat " + card.name + " geflipped."
      );*/
    }
  }

  if (behavior === "unflipOnly") {
    const isFlipped=player.flipped.indexOf(card) > -1;
    if (isFlipped) {
      GameModel.instance.unflipCard(player, [card]);
      /*LogsModel.instance.addLog(
        player,
        player.name + " hat " + card.name + " zurück geflipped."
      );*/
    }
  }
}
