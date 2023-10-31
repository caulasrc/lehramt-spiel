import { Button, Colors, Divider } from "@blueprintjs/core";
import React, { useEffect } from "react";
import { GameModel } from "../models/GameModel";
import { PlayerModel } from "../models/PlayerModel";

let npcTickInterval: NodeJS.Timeout | undefined;
let userTickUpInterval: NodeJS.Timeout | undefined;

export function DebugBar() {
  const [autoUserTick, setAutoUserTick] = React.useState(false);
  const [autoNpcTick, setAutoNpcTick] = React.useState(false);
  const [declineNpcEvents, setDeclineNpcEvents] = React.useState(false);
  const [brainlessNpcs, setbrainlessNpcs] = React.useState(false);

  useEffect(() => {
    if (autoUserTick) {
      userTickUpInterval = setInterval(() => {
        GameModel.instance.dispatchTick("tickUser");
      }, 100);
    } else {
      clearInterval(userTickUpInterval);
    }
    return () => {
      clearInterval(userTickUpInterval);
    };
  }, [autoUserTick]);

  useEffect(() => {
    if (autoNpcTick) {
      npcTickInterval = setInterval(() => {
        GameModel.instance.dispatchTick("tickNpc");
      }, 100);
    } else {
      clearInterval(npcTickInterval);
    }
    return () => {
      clearInterval(npcTickInterval);
    };
  }, [autoNpcTick]);

  useEffect(() => {
    PlayerModel.instance.declineNpcEvents = declineNpcEvents;
  }, [declineNpcEvents]);

  useEffect(() => {
    PlayerModel.instance.brainlessNpcs = brainlessNpcs;
  }, [brainlessNpcs]);

  return (
    <div style={{backgroundColor:Colors.LIGHT_GRAY4, display:"block", border:"2px solid black", borderRadius:10, width:"900px", marginLeft:"auto", marginRight:"auto", padding:5}}>
      <div style={{textAlign:"center"}}>Debug panel for testing purposes</div>
      <div
        style={{
          margin: 10,
          display: "flex",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Button
          onClick={() => {
            GameModel.instance.dispatchTick("tickUser");
          }}
        >
          User tick
        </Button>
        <Button
          onClick={setAutoUserTick.bind(null, !autoUserTick)}
          icon={autoUserTick ? "full-circle" : "circle"}
        >
          Auto User tick
        </Button>
        <Divider></Divider>
        <Button
          onClick={() => {
            GameModel.instance.dispatchTick("tickNpc");
          }}
        >
          Npc tick
        </Button>
        <Button
          onClick={setAutoNpcTick.bind(null, !autoNpcTick)}
          icon={autoNpcTick ? "full-circle" : "circle"}
        >
          Auto NPC tick
        </Button>
        <Divider></Divider>
        <Button
          icon={declineNpcEvents ? "full-circle" : "circle"}
          onClick={setDeclineNpcEvents.bind(null, !declineNpcEvents)}
        >
          Decline NPC events
        </Button>
        <Divider></Divider>
        <Button
          icon={brainlessNpcs ? "full-circle" : "circle"}
          onClick={setbrainlessNpcs.bind(null, !brainlessNpcs)}
        >
          Brainless NPCs
        </Button>
      </div>
    </div>
  );
}
