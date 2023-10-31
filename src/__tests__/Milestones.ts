import { GameModel } from "models/GameModel";
import { CardPropertyType, MilestoneLimits } from "models/PlayerData";
import { PlayerModel } from "models/PlayerModel";



it('check different conditions for milestones', () => {

    const user=PlayerModel.instance.getUser();
    GameModel.instance.autoFillHand(user);

    const msLimit=MilestoneLimits;

    const setUserProp=(propName:CardPropertyType,val:number)=>{
        user.properties.find(p=>p.type===propName)!.value=val;
    };
    const getMsValue=(msName:string,type:CardPropertyType):number=>{
        return msLimit.find(p=>p.name===msName)!.requirements.find(c=>c.type===type)?.value!;
    };

    const msName1=msLimit[0].name;

    setUserProp("empowerment",getMsValue(msName1,"empowerment"));
    setUserProp("knowledge",getMsValue(msName1,"knowledge"));
    setUserProp("experience",getMsValue(msName1,"experience"));
    setUserProp("motivation",getMsValue(msName1,"motivation"));
    expect(GameModel.instance.checkMilestone(user)).toEqual(true);

    setUserProp("empowerment",getMsValue(msName1,"empowerment")-1);
    setUserProp("knowledge",getMsValue(msName1,"knowledge"));
    setUserProp("experience",getMsValue(msName1,"experience"));
    setUserProp("motivation",getMsValue(msName1,"motivation"));
    expect(GameModel.instance.checkMilestone(user)).toEqual(false);

    setUserProp("empowerment",0);
    setUserProp("knowledge",0);
    setUserProp("experience",0);
    setUserProp("motivation",0);


});

