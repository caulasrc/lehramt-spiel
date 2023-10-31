import { GameModel } from "models/GameModel";
import { TickSource } from "models/PlayerData";

export function TickCmd(src:TickSource)
{
    GameModel.instance.dispatchTick(src);
}

