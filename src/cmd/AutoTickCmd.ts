import { GameModel } from "models/GameModel";

export function AutoTickCmd(totalTicks:number)
{
    const iv1=setInterval(() => {
        GameModel.instance.dispatchTick("tickNpc");
        GameModel.instance.dispatchTick("tickUser");
        if(totalTicks<0) {
            clearInterval(iv1);
        }
        totalTicks--;
    }, 1);
}
