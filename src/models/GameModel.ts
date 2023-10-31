import { classifiedCards } from "./ClassifiedCards";
import { CardData, CardDataType, HandLimit, MilestoneLimits, PlayerData, TickSource } from "./PlayerData";
import { getCardsWithMostNeededProps, getCardsWithoutNeededProps, randomNumbersArray } from "./Util";

export class GameModel {

  public static instance = new GameModel();

  public readonly events = {
    handChanged: "handChangedEvent",
    roundFinished: "roundFinishedEvent",
    stackChanged: "stackChangedEvent",
    milestoneChanged: "milestoneChangedEvent",
    gameOver:"gameover"
  }
  public readonly deck = new Array<CardData>();
  public currentPlayerIndex: number = -1; //-1 when game is not running
  public currentPlayerStep: number = 0;
  public finishGameForPlayerIndex: number = -1;
  public gameSpeed: 0|1|2 = 1;
  public isGameover=false;

  private constructor() {}

  public restart(): void {
    this.currentPlayerIndex = 0;
    this.currentPlayerStep = 0;
    this.finishGameForPlayerIndex=-1;
    this.isGameover=false;
    this.createDeck();
  }

  public gameover():void
  {
    this.isGameover=true;
    document.dispatchEvent(new CustomEvent(this.events.gameOver));
  }

  public dispatchTick(src:TickSource):void
  {
    document.dispatchEvent(new CustomEvent(src));
  }

  public createDeck(): void {
    this.deck.slice(0, this.deck.length); 
    let cardIndex=0;
    classifiedCards.forEach((card) => {
      cardIndex++;
      for (let i = 0; i < card.totalInDeck; i++) {
        const cardCopy = JSON.parse(JSON.stringify(card)) as CardData;
        if(!cardCopy) {
          throw new Error("cardCopy is undefined");
        }
        if(cardCopy.properties.length>0) {
          if(cardIndex<=105) {
            cardCopy.image="1-01-" + (cardIndex<10?"0":"") + cardIndex + ".png";
          } else {
            //if there are more than 105 cards, the images start with 1 again. 
            const index=cardIndex-105;
            cardCopy.image="1-01-" + (index<10?"0":"") + index + ".png";
          }
          this.deck.push(cardCopy);
        }
      }
    });

    //shuffle deck randomly
    this.deck.sort((a,b)=>Math.random()-0.5);

    //shuffle deck non randomly
    /*
    let randomArrayIndex = 0;
    for (let i = 0; i < this.deck.length; i++) {
      const randomIndex = Math.floor(randomNumbersArray[randomArrayIndex] * this.deck.length);
      const temp = this.deck[i];
      this.deck[i] = this.deck[randomIndex];
      this.deck[randomIndex] = temp;

      if(randomArrayIndex>=randomNumbersArray.length-1) {
        randomArrayIndex=0;
      } else {
        randomArrayIndex++;
      }
    }*/
  }

  private popCard(cardType?:CardDataType):CardData
  {
    if(this.deck.length===0) {
      this.createDeck();
    }
    if(typeof cardType!== "undefined") {
      const cardIndex=this.deck.findIndex((c)=>c.type===cardType);
      if(cardIndex===-1) {
        throw new Error("card not found in deck: "+cardType);
      }
      const card = this.deck[cardIndex];
      this.deck.splice(cardIndex,1);
      return card;
    }
    return this.deck.pop()!;
  }

  public autoFillHand(player:PlayerData,cardType?:CardDataType):void
  {
    for(let i=player.hand.length;i<HandLimit;i++) {
      player.hand.push(this.popCard(cardType));
    }
    this.dispatchEventDelayed(this.events.handChanged,player);
  }


  /*
    will deduct card costs from player.
    first it uses the backup time
    then it uses the flipped cards
    then it uses unflipped cards

    returns the amount of cards removed
  */
  public deductCosts(player:PlayerData, card:CardData):number
  {
    const flippedExclusive=player.flipped.filter((c)=>c!==card);
    const unflippedExclusive=player.hand.filter((c)=>player.flipped.indexOf(c)===-1 && c!==card);

    const costs=card.costs;
    let totalPayed=0;
    let totalCardsRemoved=0;

    for(let i=0;i<flippedExclusive.length && totalPayed<costs;i++) {
      const c=flippedExclusive[i];
      const index1=player.flipped.indexOf(c);
      if(index1>-1) {
        player.flipped.splice(index1,1);
        totalPayed++;
        totalCardsRemoved++;
      }
      const index2=player.hand.indexOf(c);
      if(index2>-1) {
        player.hand.splice(index2,1);
      }
    }

    if(player.timeBackup && totalPayed<costs) {
      player.timeBackup=false;
      totalPayed++;
    }

    for(let i=0;i<unflippedExclusive.length && totalPayed<costs;i++) {
      const c=unflippedExclusive[i];
      const index2=player.hand.indexOf(c);
      if(index2>-1) {
        player.hand.splice(index2,1);
        totalPayed++;
        totalCardsRemoved++;
      }
    }
    this.dispatchEventDelayed(this.events.handChanged,player);
    return totalCardsRemoved;
  }

  public removeFromHand(player:PlayerData, card:CardData)
  {
    let didChange=false;
    const flippedIndex=player.flipped.indexOf(card);
    if(flippedIndex>-1) {
      player.flipped.splice(flippedIndex,1);
      didChange=true;
    }
    const index1=player.hand.indexOf(card);
    if(index1>-1) {
      player.hand.splice(index1,1);
      didChange=true;
    }
    if(didChange) {
      this.dispatchEventDelayed(this.events.handChanged,player);
    }
  }

  public addToStack(player:PlayerData, card:CardData)
  {
    const inStack=player.stack.indexOf(card)>-1;
    if(!inStack) {
      player.stack.push(card);
      this.dispatchEventDelayed(this.events.stackChanged,player);
    }
  }

  //learn
  public addProperties(player:PlayerData, card:CardData):void
  {
    card.properties.forEach((prop)=>{
      const currentProp = player.properties.find((cp)=>cp.type===prop.type)!;
      currentProp.value+=prop.value;
      if(currentProp.value<0) {
        currentProp.value=0;
      }
    });
    if(player.statistics.firstMoveTimestamp===0) {
      player.statistics.firstMoveTimestamp=Date.now();
    }
    player.statistics.lastMoveTimestamp=Date.now();
  }

  public addBonusPropertiesFromTheoryGroup(player:PlayerData, card:CardData):void
  {
    const tg=card.group;
    if(!tg) {
      return;//in case of event cards
    }
    if(player.stack.indexOf(card)===-1) {
      console.error("card not in stack",card);
      return;
    }
    const cardsInGroup=player.stack.filter((c)=>c.group===tg);
    const totalCardsInGroup=cardsInGroup.length;
    if(totalCardsInGroup>1) {
      player.properties.find((p)=>p.type==="knowledge")!.value+=1;
      if(totalCardsInGroup>2) {
        player.properties.find((p)=>p.type==="motivation")!.value+=1;
      }
    }

  }

  public addBackupTime(player:PlayerData, card:CardData):void
  {
    player.timeBackup=true;
    this.removeFromHand(player,card);
  }

  public unflipCard(player:PlayerData, cardToFlip:Array<CardData>):void
  {
    for(let i=0;i<cardToFlip.length;i++) {
      const index=player.flipped.indexOf(cardToFlip[i]);
      const isFlipped = index>-1;
      if(isFlipped) {
        player.flipped.splice(index,1);
      }
    }
    this.dispatchEventDelayed(this.events.handChanged,player);
  }

  public flipCard(player:PlayerData, cardToFlip:Array<CardData>):void
  {
    let didFlip=false;
    for(let i=0;i<cardToFlip.length;i++) {
      const index=player.flipped.indexOf(cardToFlip[i]);
      const isFlipped = index>-1;
      if(isFlipped===false) {
        player.flipped.push(cardToFlip[i]);
        didFlip=true;
      }
    }
    if(didFlip) {
      this.dispatchEventDelayed(this.events.handChanged,player);
    }
  }

  public setFlippedCards(player:PlayerData,flipped:Array<CardData>):void
  {
    if(player.flipped.length===0) {
      return;
    }
    player.flipped.splice(0,player.flipped.length);
    if(flipped) {
      player.flipped.push(...flipped);
    }
    this.dispatchEventDelayed(this.events.handChanged,player);
  }

  public getMostUnwantedCard(player:PlayerData,ignore?:CardData):CardData|undefined
  {
    const cardsWithoutNeededProps = getCardsWithoutNeededProps(player).filter((c)=>c!==ignore);
    if(cardsWithoutNeededProps.length>0) {
      return cardsWithoutNeededProps[0]!;
    }
    const cardsWithNeededProps=getCardsWithMostNeededProps(player).filter((c)=>c!==ignore);
    if(cardsWithNeededProps.length>0) {
      return cardsWithNeededProps[cardsWithNeededProps.length-1]!;
    }
  }

  public flipMostUnwantedCard(player:PlayerData,ignore?:CardData):CardData|undefined
  {
    const cardsWithoutNeededProps = getCardsWithoutNeededProps(player).filter((c)=>c!==ignore);
    if(cardsWithoutNeededProps.length>0) {
      const cardToFlip=cardsWithoutNeededProps[0]!;
      this.flipCard(player,[cardToFlip]);
      return cardToFlip;
    }
    const cardsWithNeededProps=getCardsWithMostNeededProps(player).filter((c)=>c!==ignore);
    if(cardsWithNeededProps.length>0) {
      const cardToFlip=cardsWithNeededProps[cardsWithNeededProps.length-1]!;
      this.flipCard(player,[cardToFlip]);
      return cardToFlip;
    }
  }

  public getTimeFromFlippedCards(player:PlayerData):number
  {
    return player.flipped.length+(player.timeBackup?1:0);
  }

  public getTimeFromAllCards(player:PlayerData):number
  {
    return player.hand.length+(player.timeBackup?1:0);
  }

  public getMsProgress(player:PlayerData):{name:string,progress:number,points:number}
  {
    let percentSum=0;
    const totalRequirements=player.milestone.requirements.length;
    let points=0;
    for(let i=0;i<totalRequirements;i++) {
      const req = player.milestone.requirements[i];
      const max=req.value;
      const prop = player.properties.find((p)=>p.type===req.type)!;
      const val=Math.min(max,prop.value);
      percentSum+=val/max;
      points+=val;
    }
    return {points,name:player.milestone.name,progress:percentSum/totalRequirements};
  }


  public checkMilestone(player:PlayerData):boolean
  {
    const milestoneRequirements=player.milestone.requirements;
    for (let i = 0; i < milestoneRequirements.length; i++) {
      const req = milestoneRequirements[i];
      const prop = player.properties.find((p)=>p.type===req.type);
      if(!prop || prop.value<req.value) {
        return false;
      }
    }
    const curMilestoneIndex=MilestoneLimits.indexOf(player.milestone);
    const nextMilestoneIndex=curMilestoneIndex+1;
    if(nextMilestoneIndex>=MilestoneLimits.length) {
      this.dispatchEventDelayed(this.events.milestoneChanged,player);
      return true;
    }
    player.milestone=MilestoneLimits[nextMilestoneIndex];
    this.dispatchEventDelayed(this.events.milestoneChanged,player);
    return true;
  }

  public lastMilestoneReached(player:PlayerData):boolean
  {
    const curMilestoneIndex=MilestoneLimits.indexOf(player.milestone);
    if(curMilestoneIndex===MilestoneLimits.length-1) {
      const milestoneRequirements=player.milestone.requirements;
      for (let i = 0; i < milestoneRequirements.length; i++) {
        const req = milestoneRequirements[i];
        const prop = player.properties.find((p)=>p.type===req.type)!;
        if(prop.value<req.value) {
          return false;
        }
      }
      return true;
    }
    return false
  }

  
  private lastEventName:string="";
  private lastEventData:any;
  private dispatchEventDelayed(eventName:string,detailData:any):void
  {
    if(this.lastEventName===eventName && this.lastEventData===detailData) {
      return;
    }
    setTimeout(()=>{
      this.lastEventName="";
      this.lastEventData=undefined;
      const e=(new CustomEvent(eventName,{detail:detailData}));
      document.dispatchEvent(e);
    },1);
  }

  public filterPlayersForTime(timeNeededPerPlayer:number,players:Array<PlayerData>):Array<PlayerData>
  {
    const playersWithEnoughTime=players.filter((p)=>{
      return this.getTimeFromAllCards(p)>=timeNeededPerPlayer;
    });
    return playersWithEnoughTime;
  }

  /*public canPlayCard(card:CardData,players:Array<PlayerData>):boolean
  {
    if(card.type==="theory") {
      return true;
    }
    if(card.type==="event") {
      if(card.socialForm==="solo" || card.socialForm==="negative-solo") {
        return true;
      }
    }
    const playersWithEnoughTime=this.getPlayersWhoCanParticipate(card,players);
    if(playersWithEnoughTime.length===0) {
      return false;
    }
    return true;
  }*/


}
