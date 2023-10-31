import { CardData, PlayerData } from "./PlayerData";

export interface LogData {
  type: "gameStarted" | "event" |"emptyHand" | "negativeEvent" | "theoryLearned" | "eventParticipated" | "fillHand" | "gameWon" | "finishRound" | "milestoneReached" | "backupcard";
  player: PlayerData;
  card?: CardData;
  callback?: (logData:LogData, yes: boolean) => void;
  id:number;
}

export class LogsModel {
  public static instance = new LogsModel();

  public readonly events = {
    logAdded: "logAdded",
  };

  public readonly logs: Array<LogData>;

  private logIdCounter=0;

  private constructor() {
    this.logs = [];
  }

  public reset() {
    this.logs.splice(0, this.logs.length);
  }

  /*public addLog(player: PlayerData, log: string) {
    const ld = { log, type: "msg", player } as LogData;
    this.logs.push(ld);
    document.dispatchEvent(
      new CustomEvent(this.events.logAdded, { detail: ld })
    );
  }*/

  private add(t:LogData["type"], player: PlayerData, card?: CardData) {
    const ld = { type:t, player, card, id:this.logIdCounter++ } as LogData;
    this.logs.push(ld);
    if(this.logs.length>20) {
      this.logs.splice(0,1);
    }
    document.dispatchEvent(
      new CustomEvent(this.events.logAdded, { detail: ld })
    );

  }

  public gameStarted(player:PlayerData)
  {
    this.add("gameStarted",player);
  }

  public milestoneReached(player: PlayerData)
  {
    this.add("milestoneReached",player);
  }

  public finishRound(player: PlayerData)
  {
    this.add("finishRound",player);
  }

  public gameWon(player: PlayerData)
  {
    this.add("gameWon",player);
  }

  public backup(player: PlayerData, card: CardData) {
    this.add("backupcard",player,card);
  }

  public theoryLearned(player: PlayerData, card: CardData) {
    this.add("theoryLearned",player,card);
  }

  public negativeEvent(player: PlayerData, card: CardData) {
    this.add("negativeEvent",player,card);
  }

  public fillHand(player: PlayerData) {
    this.add("fillHand",player);
  }

  public emptyHand(player: PlayerData) {
    this.add("emptyHand",player);
  }

  public removeCallback(ld:LogData):void
  {
    ld.callback = undefined;
    document.dispatchEvent(
      new CustomEvent(this.events.logAdded, { detail: ld })
    );
  }

  public eventParticipated(player: PlayerData, card: CardData)
  {
    this.add("eventParticipated",player,card);
  }

  public eventRequest(
    player: PlayerData,
    card: CardData,
    callback: (logData:LogData, yes: boolean) => void
  ):LogData {
    const ld = {
      type: "event",
      card,
      callback,
      player,
      id: this.logIdCounter++,
    } as LogData;
    this.logs.push(ld);
    document.dispatchEvent(
      new CustomEvent(this.events.logAdded, { detail: ld })
    );
    return ld;
  }
}
