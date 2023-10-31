import { GameModel } from "models/GameModel";
import { LogData, LogsModel } from "models/LogsModel";
import { CardData, PlayerData } from "models/PlayerData";
import { PlayerModel } from "models/PlayerModel";

export async function RequestGroupEventPlayersCmd(
  player: PlayerData,
  card: CardData
): Promise<Array<PlayerData>> {

  if (card.type !== "event") {
    throw new Error("card is not an event");
  }
  const socialForm = card.socialForm;
  if (socialForm === "solo" || socialForm === "negative-solo" || socialForm === "negative-group") {
    return [player];
  }

  const maxParticipants = 3;
  const players = PlayerModel.instance.players;
  const playersCanParticipate = GameModel.instance.filterPlayersForTime(
    card.costs,
    players
  );
  const isUser = !player.isNpc;
  if (isUser) {
    //
    return limitList(playersCanParticipate, maxParticipants);
  }
  const user = PlayerModel.instance.getUser();
  const userCanParticipate = playersCanParticipate.indexOf(user) > -1;
  if (!userCanParticipate) {
    return limitList(playersCanParticipate, maxParticipants);
  }
  return new Promise<Array<PlayerData>>((resolve, reject) => {

    const onClickCallback = (logData:LogData, yes: boolean) => {
      if (!yes) {
        LogsModel.instance.removeCallback(logData);
        playersCanParticipate.splice(playersCanParticipate.indexOf(user), 1);
        resolve(limitList(playersCanParticipate, maxParticipants));
        return;
      }
      const canPayViaBackupTime = user.timeBackup && card.costs===1;
      if(canPayViaBackupTime) {
        LogsModel.instance.removeCallback(logData);
        resolve(limitList(playersCanParticipate, maxParticipants));
        return;
      }
      const dialogConfirmedCallback=()=>{
        LogsModel.instance.removeCallback(logData);
        resolve(limitList(playersCanParticipate, maxParticipants));
      };
      openSelectCardsDialog(card,dialogConfirmedCallback);
    };
    const lastLog=LogsModel.instance.eventRequest(player,
      card,
      onClickCallback
    );
    if(PlayerModel.instance.declineNpcEvents) {
      onClickCallback(lastLog,false);
    }
  });
}


function openSelectCardsDialog(card:CardData, confirmCallback:()=>void) {
  
  const onConfirmEvent=(e:Event)=>{
    removeAll();
    confirmCallback();
  };
  const onCloseEvent=(e:Event)=>{
    removeAll();
  };
  const removeAll=()=>{
    document.removeEventListener("confirm", onConfirmEvent);
    document.removeEventListener("close", onCloseEvent);
  }
  document.addEventListener("close", onCloseEvent);
  document.addEventListener("confirm", onConfirmEvent);
  document.dispatchEvent(new CustomEvent("SelectCardsDialog", {detail:{data:{card}}}));
}

function limitList(
  list: Array<PlayerData>,
  maxElements: number
): Array<PlayerData> {
  if (list.length <= maxElements) {
    return list;
  }
  return list.slice(0, maxElements);
}
