import { GameModel } from "models/GameModel";
import { LogsModel } from "models/LogsModel";
import { PlayerModel } from "models/PlayerModel";

function resetModels()
{
    PlayerModel.instance.setPlayers([1,2,3]);
    GameModel.instance.restart();
    LogsModel.instance.reset(); 
}

it('should deal 4 cards', () => {
    resetModels();
    const user=PlayerModel.instance.getUser();
    GameModel.instance.autoFillHand(user);
    const totalCards=user.hand.length;
    expect(totalCards).toEqual(4);
});


it('should remove unflipped cards when paying and no flipped cards are present', () => {
    resetModels();
    const player=PlayerModel.instance.getUser();
    GameModel.instance.autoFillHand(player,"theory");
    const firstCard=player.hand[0];
    //console.log("first card costs ",firstCard.costs);
    const totalRemoved=GameModel.instance.deductCosts(player,firstCard);
    expect(totalRemoved).toEqual(firstCard.costs);
    expect(player.hand.length).toEqual(4-firstCard.costs);
}); 

it('same as before but with 2 flipped cards', () => {
    resetModels();
    const player=PlayerModel.instance.getUser();
    GameModel.instance.autoFillHand(player,"theory");
    const firstCard=player.hand[0];
    GameModel.instance.flipCard(player,[player.hand[1],player.hand[2]]);
    const totalRemoved=GameModel.instance.deductCosts(player,firstCard);
    expect(totalRemoved).toEqual(firstCard.costs);
    expect(player.hand.length).toEqual(4-firstCard.costs);
}); 

it('apply properties and pay for card', () => {
    resetModels();
    const player=PlayerModel.instance.getUser();
    GameModel.instance.autoFillHand(player,"theory");
    const firstCard=player.hand[0];
    GameModel.instance.removeFromHand(player,firstCard);
    GameModel.instance.addProperties(player,firstCard);
    GameModel.instance.deductCosts(player,firstCard);
    expect(player.hand.length).toEqual(4-(1+firstCard.costs));
});
