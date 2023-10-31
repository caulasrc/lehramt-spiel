import { AutoTickCmd } from "cmd/AutoTickCmd";
import { FlipCardCmd } from "cmd/FlipCardCmd";
import { PlayCardCmd } from "cmd/PlayCardCmd";
import { RequestGroupEventPlayersCmd } from "cmd/RequestGroupEventPlayersCmd";
import { GameModel } from "models/GameModel";
import { LogData, LogsModel } from "models/LogsModel";
import { PlayerData } from "models/PlayerData";
import { PlayerModel } from "models/PlayerModel";

function resetModels()
{
    PlayerModel.instance.setPlayers([1,2,3]);
    GameModel.instance.restart();
    LogsModel.instance.reset(); 
}
const calculatePropertySum=(player:PlayerData)=>{
    const propSum=player.properties.reduce((acc,prop)=>{
        return acc+prop.value;
    },0);
    return propSum;
};

it('should start event without npcs', async () => {

    resetModels();
    AutoTickCmd(100);
    const player=PlayerModel.instance.getUser();
    GameModel.instance.autoFillHand(player,"event");
    const firstCard=player.hand[0];

    FlipCardCmd(player,player.hand[1],"flipOnly");
    FlipCardCmd(player,player.hand[2],"flipOnly");
    FlipCardCmd(player,player.hand[3],"flipOnly");

    const didPlay=await PlayCardCmd(player,firstCard);
    expect(didPlay).toEqual(true);
    expect(player.hand.length).toEqual(4-(1+firstCard.costs));
    expect(calculatePropertySum(player)).toBeGreaterThan(0);
});
jest.setTimeout(2000);


it('should start event with npcs', async () => {

    AutoTickCmd(100);
    resetModels();
    
    const players=PlayerModel.instance.players;
    const user=players[0];
    GameModel.instance.autoFillHand(user,"event");

    for(let i=1;i<players.length;i++) {
        const npc=players[i];
        GameModel.instance.autoFillHand(npc);
    }
    
    //non solo card
    const firstCard=user.hand.find(card=>card.socialForm!=="solo" && card.socialForm!=="negative-solo")!;
    const cardCosts=firstCard.costs;

    //console.log("firstCard",firstCard);

    FlipCardCmd(user,user.hand[1],"flipOnly");
    FlipCardCmd(user,user.hand[2],"flipOnly");
    FlipCardCmd(user,user.hand[3],"flipOnly");

    const playersWhoWillParticipate=await RequestGroupEventPlayersCmd(user,firstCard);
    //remove user from list
    const index=playersWhoWillParticipate.indexOf(user);
    playersWhoWillParticipate.splice(index,1);

    expect(playersWhoWillParticipate.length>1).toEqual(true);

    const didPlay=await PlayCardCmd(user,firstCard);
    expect(didPlay).toEqual(true);
    expect(user.hand.length).toEqual(4-(1+cardCosts));//1 is the card that was played
    expect(calculatePropertySum(user)).toBeGreaterThan(0);

    for(let i=0;i<playersWhoWillParticipate.length;i++) { 
        const pl=playersWhoWillParticipate[i];
        expect(pl.hand.length).toEqual(4-cardCosts);
        expect(calculatePropertySum(pl)).toBeGreaterThan(0);
    }
});


it('npc should start an event with user', async () => {
    resetModels();
    AutoTickCmd(100);

    const gm=GameModel.instance;
    
    const players=PlayerModel.instance.players;
    const user=players[0];
    gm.autoFillHand(user);
    FlipCardCmd(user,user.hand[0],"flipOnly");
    FlipCardCmd(user,user.hand[1],"flipOnly");
    FlipCardCmd(user,user.hand[2],"flipOnly");

    const npc=players[1];
    gm.autoFillHand(npc,"event");

    for(let i=2;i<players.length;i++) {
        const npc=players[i];
        gm.autoFillHand(npc);
    }

    const nonSoloEventCard=npc.hand.find(card=>card.socialForm!=="solo" && card.socialForm!=="negative-solo")!;
    expect(nonSoloEventCard).toBeDefined();

    const cardsToFlip=npc.hand.filter(card=>card!==nonSoloEventCard);
    gm.flipCard(npc,cardsToFlip);

    const playerAnswer=true;

    const eventName=LogsModel.instance.events.logAdded;
    const onShowSelectCardDialogEvent=async (e:Event)=>{
        const ce=e as CustomEvent;
        const ld=ce.detail as LogData;
        if(ld.type==="event" && ld.callback) {
            document.removeEventListener(eventName,onShowSelectCardDialogEvent);
            ld.callback(ld,playerAnswer);//simulate user lick on YES button.
        }
    };
    document.addEventListener(eventName,onShowSelectCardDialogEvent);

    setTimeout(()=>{
        document.dispatchEvent(new Event("confirm"));
    },10);

    const didPlay=await PlayCardCmd(npc,nonSoloEventCard);
    expect(didPlay).toEqual(true);

    const sum1=calculatePropertySum(user);
    const sum2=calculatePropertySum(npc);

    expect(sum1).toEqual(sum2);
    expect(sum1).toBeGreaterThan(0);

    expect(npc.hand.length).toEqual(4-(1+nonSoloEventCard.costs));//1 is the card that was played
    expect(user.hand.length).toEqual(4-nonSoloEventCard.costs);
});
