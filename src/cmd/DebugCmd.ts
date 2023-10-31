/* eslint-disable @typescript-eslint/no-unused-vars */
import { GameModel } from "models/GameModel";
import { PlayerModel } from "models/PlayerModel";
import { PlayCardCmd } from "./PlayCardCmd";

export function DebugCmd() {
  //DebugSelectCardsDialog();
}

function DebugSelectCardsDialog() {
  console.log("DebugSelectCardsDialog");
  const players = PlayerModel.instance.players;
  const user = PlayerModel.instance.getUser();
  GameModel.instance.autoFillHand(user);

  const npcs = PlayerModel.instance.getNpcs();
  const npc = npcs[0];
  GameModel.instance.currentPlayerIndex = players.indexOf(npc);
  GameModel.instance.autoFillHand(npc, "event");

  const groupCards = npc.hand.filter(
    (c) => c.type === "event" && c.socialForm === "group"
  );
  const groupCard = groupCards[0];
  const otherCards = npc.hand.filter((c) => c !== groupCard);
  GameModel.instance.flipCard(npc, otherCards);

  PlayCardCmd(npc, groupCard);
}
