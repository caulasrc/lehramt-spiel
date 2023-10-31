import { GameModel } from "models/GameModel";
import { LogsModel } from "models/LogsModel";
import { CardData, PlayerData } from "models/PlayerData";
import {
  getCardsWithMostNeededProps,
  getCardsWithoutNeededProps,
} from "models/Util";
import { PlayCardCmd } from "./PlayCardCmd";
import { FlipCardCmd } from "./FlipCardCmd";
import { AutoFillHandCmd } from "./AutoFillHandCmd";

export async function NextBrainlessStepCmd(
  player: PlayerData
): Promise<boolean> {
  console.log("NextBrainlessStepCmd (" + player.id + ")");

  const gm = GameModel.instance;
  const lm = LogsModel.instance;

  if (gm.lastMilestoneReached(player)) {
    lm.milestoneReached(player);
    return false;
  }

  if (gm.currentPlayerStep === 0) {
    if (AutoFillHandCmd(player)) {
      gm.currentPlayerStep++;
      return true;
    }
  }

  const flippedCards = player.flipped;
  const unflippedCards = player.hand.filter(
    (card) => flippedCards.indexOf(card) === -1
  );

  const negativeCard = getCardWithNegativeProp(unflippedCards);
  if (negativeCard) {
    gm.addToStack(player, negativeCard);
    gm.removeFromHand(player, negativeCard);
    gm.addProperties(player, negativeCard);
    gm.addBonusPropertiesFromTheoryGroup(player, negativeCard);
    gm.deductCosts(player, negativeCard);
    gm.currentPlayerStep++;
    lm.negativeEvent(player,negativeCard);
    return true;
  }

  const cardsWithNeededProps = getCardsWithMostNeededProps(player);
  const cardsWithoutNeededProps = getCardsWithoutNeededProps(player);
  const curTime = gm.getTimeFromFlippedCards(player);

  const getRandomCardFrom = (list: Array<CardData>) => {
    return list[Math.floor(Math.random() * list.length)];
  };

  if (curTime === 0) {
    const anyCard = getRandomCardFrom(cardsWithNeededProps);
    if (anyCard) {
      FlipCardCmd(player, anyCard, "flipOnly");
      gm.currentPlayerStep++;
      return true;
    }
    return false;
  }

  if (curTime > 0) {
    const cardsList = cardsWithNeededProps
      .concat(cardsWithoutNeededProps)
      .reverse();
    for (let i = 0; i < cardsList.length && i < 3; i++) {
      const card = cardsList[i]!;
      if (await PlayCardCmd(player, card)) {
        gm.currentPlayerStep++;
        return true;
      }
    }
  }

  return false;
}

const getMostExpensiveCards = (player: PlayerData) => {
  return player.hand.sort((a, b) => {
    return b.costs - a.costs;
  });
};

const getCardWithNegativeProp = (
  hand: Array<CardData>
): CardData | undefined => {
  return hand.find((card) => {
    return card.properties.find((prop) => prop.value < 0);
  });
};
