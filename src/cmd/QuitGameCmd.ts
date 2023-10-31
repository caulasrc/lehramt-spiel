import { GameModel } from "models/GameModel";
import { PlayerModel } from "models/PlayerModel";
import { TickCmd } from "./TickCmd";

export function QuickGameCmd()
{
    GameModel.instance.currentPlayerIndex=-1;

    //break the loop in StartGameCmd
    TickCmd("tickNpc");
    TickCmd("tickUser");
    //
    
    document.dispatchEvent(new CustomEvent("goto",{detail:"intro"}));
}