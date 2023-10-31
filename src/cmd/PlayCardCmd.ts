import { LogsModel } from "../models/LogsModel";
import { GameModel } from "../models/GameModel";
import { CardData, PlayerData } from "../models/PlayerData";
import { RequestGroupEventPlayersCmd } from "./RequestGroupEventPlayersCmd";
import { AutoFlipRequiredCards } from "./AutoFlipRequiredCards";

import { Trans } from "react-i18next";

export async function PlayCardCmd(
  player: PlayerData,
  card: CardData
): Promise<boolean> {
  const gm = GameModel.instance;
  const lm = LogsModel.instance;

  const time = gm.getTimeFromFlippedCards(player);
  const canAfford = time >= card.costs;

  if (!canAfford) {
    return false;
  }

  if (card.type === "theory") {
    gm.addToStack(player, card);
    gm.addProperties(player, card);
    gm.addBonusPropertiesFromTheoryGroup(player, card);
    gm.deductCosts(player, card);
    gm.removeFromHand(player, card);
    lm.theoryLearned(player, card);
    player.statistics.theoriesLearned++;
  }

  if (card.type === "event") {
    player.statistics.totalEventsStarted++;
    const participating = await RequestGroupEventPlayersCmd(player, card);
    if (participating.length === 0) {
      throw new Error("no players can participate");
    }
    for (let i = 0; i < participating.length; i++) {
      const participatingPlayer = participating[i];
      await AutoFlipRequiredCards(participatingPlayer, card);
      participatingPlayer.statistics.totalEventsParticipatedIn++;
      gm.addProperties(participatingPlayer, card);
      gm.deductCosts(participatingPlayer, card);

      if (card.costs < 1) {
        lm.negativeEvent(participatingPlayer, card);
      } else {
        lm.eventParticipated(participatingPlayer, card);
      }
    }
    gm.removeFromHand(player, card);
  }

  if(!player.isNpc && player.hand.length===0) {
    lm.emptyHand(player);
  }

  return true;
}
