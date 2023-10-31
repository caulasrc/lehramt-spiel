import { GameModel } from "models/GameModel";
import { CardData, PlayerData } from "models/PlayerData";
import { WaitForNextTickCmd } from "./WaitForNextTickCmd";
import { FlipCardCmd } from "./FlipCardCmd";

export async function AutoFlipRequiredCards(
  player: PlayerData,
  forCard: CardData
) {
  const gm = GameModel.instance;
  const canAfford = gm.getTimeFromFlippedCards(player) >= forCard.costs;
  if (canAfford) {
    return;
  }
  const couldAffordCard=gm.getTimeFromAllCards(player)>=forCard.costs;
  if(!couldAffordCard) {
    return;
  }
  for (let i = 0; i < player.hand.length; i++) {
    const cardToFlip = gm.getMostUnwantedCard(player, forCard);
    if (cardToFlip) {
      FlipCardCmd(player, cardToFlip, "flipOnly");
      await WaitForNextTickCmd();
      const canAfford = gm.getTimeFromFlippedCards(player) >= forCard.costs;
      if (canAfford) {
        return;
      }
    }
  }
}
