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
import { AddCardBackupCmd } from "./AddCardBackupCmd";


export async function NextBestStepCmd(player: PlayerData): Promise<boolean> 
{
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

  const allCards = player.hand;
  const flippedCards = player.flipped;
  const unflippedCards = player.hand.filter(
    (card) => flippedCards.indexOf(card) === -1
  );

  const negativeCard = getNegativeCard(player.hand);
  if (negativeCard) {
    gm.addToStack(player, negativeCard);
    gm.removeFromHand(player, negativeCard);
    gm.addProperties(player, negativeCard);
    gm.addBonusPropertiesFromTheoryGroup(player, negativeCard);
    gm.deductCosts(player, negativeCard);//not needed.
    gm.currentPlayerStep++;
    lm.negativeEvent(player,negativeCard);
    return true;
  }

  const cardsWithNeededProps = getCardsWithMostNeededProps(player);
  const cardsWithoutNeededProps = getCardsWithoutNeededProps(player);
  const curTime = gm.getTimeFromFlippedCards(player);
  const totalUnflippedCards = unflippedCards.length;

  if (curTime === 0) {
    const unwantedCard = gm.getMostUnwantedCard(player);
    if (unwantedCard) {
      FlipCardCmd(player, unwantedCard, "flipOnly");
      gm.currentPlayerStep++;
      return true;
    }
    return false;
  }

  if (curTime > 0) {
    const cardsList = cardsWithNeededProps.concat(cardsWithoutNeededProps);
    for (let i = 0; i < cardsList.length && i < 3; i++) {
      const card = cardsList[i]!;
      if (await PlayCardCmd(player, card)) {
        gm.currentPlayerStep++;
        return true;
      }
    }
    if (totalUnflippedCards > 1) {//do not flip all cards
      const unwantedCard = gm.getMostUnwantedCard(player);
      if (unwantedCard) {
        FlipCardCmd(player, unwantedCard, "flipOnly");
        gm.currentPlayerStep++;
        return true;
      }
    }
  }

  if (flippedCards.length > 0 && totalUnflippedCards === 0) {
    const mostExpensiveCards = getMostExpensiveCards(player);
    const time = gm.getTimeFromAllCards(player) - 1; //-1 because we are not counting the card we are about to play

    for (let expensiveCard of mostExpensiveCards) {
      if (
        time >= expensiveCard.costs 
      ) {
        const handCopy = [...player.hand];
        handCopy.splice(handCopy.indexOf(expensiveCard), 1);

        for(let j=0;j<handCopy.length;j++) {
          FlipCardCmd(player, handCopy[j], "flipOnly");
          gm.currentPlayerStep++;
        }

        if (await PlayCardCmd(player, expensiveCard)) {
          gm.currentPlayerStep++;
          return true;
        }
      }
    }
  }

  if (player.timeBackup === false && allCards.length > 0) {
    let card = gm.getMostUnwantedCard(player);
    if (!card && flippedCards.length > 0) {
      card = flippedCards[0]!;
    }
    if (!card && unflippedCards.length > 0) {
      card = unflippedCards[0]!;
    }
    if (card) {
      AddCardBackupCmd(player, card);
      gm.currentPlayerStep++;
      return true;
    }
  }

  return false;
}

const getMostExpensiveCards = (player: PlayerData) => {
  return player.hand.sort((a, b) => {
    return b.costs - a.costs;
  });
};


const getNegativeCard = (
  hand: Array<CardData>
): CardData | undefined => {
  return hand.find((card) => {
    return card.costs<1;
  });
};
