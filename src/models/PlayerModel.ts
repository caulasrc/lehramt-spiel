import {
  CardProperty,
  MilestoneLimits,
  PlayerData,
  PlayerPreviewData,
} from "./PlayerData";

export class PlayerModel {
  public static instance = new PlayerModel();

  public readonly players: PlayerData[];
  public readonly playerPreviews: PlayerPreviewData[];

  public declineNpcEvents: boolean = false;
  public brainlessNpcs: boolean = false;

  private constructor() {
    this.playerPreviews = [
      {
        color: "white",
        level: 1,
        isNpc: false,
        id: 0,
      },
      {
        color: "red",
        level: 1,
        isNpc: true,
        id: 1,
      },
      {
        color: "green",
        level: 1,
        isNpc: true,
        id: 2,
      },
      {
        color: "blue",
        level: 2,
        isNpc: true,
        id: 3,
      },
      {
        color: "yellow",
        level: 3,
        isNpc: true,
        id: 4,
      },
      {
        color: "purple",
        level: 4,
        isNpc: true,
        id: 5,
      }
    ];
    this.players = [];
  }

  public getUser(): PlayerData {
    return this.players[0];
  }

  public getHighestLevelNpc() {
    const npcs = this.getNpcs();
    const sorted = npcs.sort((a, b) => b.level - a.level);
    return sorted[0];
  }

  public setPlayers(npcIndexes: Array<number>): void {
    if (npcIndexes.indexOf(0) >= 0) {
      throw new Error("user must not be npc");
    }
    this.players.splice(0, this.players.length);
    this.players.push(this.createInitialPlayerData(0)); //user

    npcIndexes.forEach((index) => {
      this.players.push(this.createInitialPlayerData(index));
    });
  }

  private createInitialPlayerData(index: number): PlayerData {
    const preview = this.playerPreviews[index];
    return {
      ...preview,
      properties: this.createInitialProps(preview.level),
      hand: [],
      stack: [],
      flipped: [],
      timeBackup: index>4,
      milestone: MilestoneLimits[0],
      statistics: {
        theoriesLearned: 0,
        firstMoveTimestamp: 0,
        lastMoveTimestamp: 0,
        totalEventsParticipatedIn: 0,
        totalEventsStarted: 0,
        roundsFinished: 0,
      },
    };
  }

  private createInitialProps(level: number): Array<CardProperty> {
    if (level === 1) {
      return [
        { type: "knowledge", value: 0 },
        { type: "motivation", value: 0 },
        { type: "experience", value: 0 },
        { type: "empowerment", value: 0 },
      ];
    }
    if (level === 2) {
      return [
        { type: "knowledge", value: 1 },
        { type: "motivation", value: 0 },
        { type: "experience", value: 1 },
        { type: "empowerment", value: 0 },
      ];
    }
    if (level === 3) {
      return [
        { type: "knowledge", value: 1 },
        { type: "motivation", value: 1 },
        { type: "experience", value: 2 },
        { type: "empowerment", value: 1 },
      ];
    }
    if (level === 4) {
      return [
        { type: "knowledge", value: 2 },
        { type: "motivation", value: 1 },
        { type: "experience", value: 2 },
        { type: "empowerment", value: 2 },
      ];
    }
    if (level === 5) {
      return [
        { type: "knowledge", value: 2 },
        { type: "motivation", value: 2 },
        { type: "experience", value: 3 },
        { type: "empowerment", value: 2 },
      ];
    }
    if (level === 6) {
      return [
        { type: "knowledge", value: 3 },
        { type: "motivation", value: 3 },
        { type: "experience", value: 3 },
        { type: "empowerment", value: 2 },
      ];
    }
    return [
      { type: "knowledge", value: 3 },
      { type: "motivation", value: 3 },
      { type: "experience", value: 3 },
      { type: "empowerment", value: 2 },
    ];
  }

  public getNpcs(): Array<PlayerData> {
    return this.players.filter((p) => p.isNpc);
  }

  public getSortedPlayers(): Array<[PlayerData, number]> {
    const players = this.players;
    const player2Score = new Array<[PlayerData, number]>();
    players.forEach((player) => {
      const score = player.properties.reduce(
        (sum, prop) => sum + prop.value,
        0
      );
      player2Score.push([player, score]);
    });
    const sortedPlayers = player2Score.sort((a, b) => b[1] - a[1]);
    return sortedPlayers;
  }
}
