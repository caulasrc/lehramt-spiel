import { GameModel } from "models/GameModel";
import { CardData, PlayerData } from "models/PlayerData";
import * as ttt from "react-i18next";

export function CheckCanPlayCardCmd(player: PlayerData, card: CardData) {
  const curTime = GameModel.instance.getTimeFromFlippedCards(player);

  const t = ttt.getI18n().t;
  if (curTime < card.costs) {

    let desc="";
    const timeRest=(card.costs - curTime);
    if(timeRest===1) {
      desc = t("alert.not_enough_time_singular").replace("{0}", card.name);
    } else {
      desc = t("alert.not_enough_time_plural").replace("{0}", card.name).replace("{1}", timeRest.toString());
    }

    document.dispatchEvent(new CustomEvent("alert", { detail: desc }));
    return false;
  }

  const isNegativeCard = card.costs < 1;
  if(isNegativeCard) {
    //ok. play negative card first.
  } else {
    const negativeCard = player.hand.find((card) => {
      return card.costs < 1;
    });
    if(negativeCard) {
      const desc=t("alert.negative_cards_first").replace("{0}", card.name).replace("{1}", negativeCard.name);
      document.dispatchEvent(new CustomEvent("alert", { detail: desc }));
      return false;
    }
  }

  return true;
}

