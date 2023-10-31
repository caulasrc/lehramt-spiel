import { useEffect, useState } from "react";
import { GameModel } from "../models/GameModel";
import { PlayerModel } from "../models/PlayerModel";
import { PlayerData } from "../models/PlayerData";
import { FinishRoundCmd } from "../cmd/FinishRoundCmd";
import { TickCmd } from "../cmd/TickCmd";
import { Button, Colors, Icon } from "@blueprintjs/core";
import React from "react";
import { LilaRGB } from "./Settings";

export function NextRoundButton() {
  const canFinishRound = () => {
    const user = PlayerModel.instance.getUser();
    const userIndex = PlayerModel.instance.players.indexOf(user);
    return (
      user.hand.length < 4 &&
      GameModel.instance.currentPlayerIndex === userIndex
    );
  };

  const [buttonActive, setButtonActive] = useState(canFinishRound());
  useEffect(() => {
    const listener1 = (e: Event) => {
      const ce = e as CustomEvent;
      const pd = ce.detail as PlayerData;
      if (pd.isNpc) {
        return;
      }
      setButtonActive(canFinishRound());
    };
    const listener2 = (e: Event) => {
      setButtonActive(canFinishRound());
    };
    const eventName1 = GameModel.instance.events.handChanged;
    document.addEventListener(eventName1, listener1);

    const eventName2 = GameModel.instance.events.roundFinished;
    document.addEventListener(eventName2, listener2);

    return () => {
      document.removeEventListener(eventName1, listener1);
      document.removeEventListener(eventName2, listener2);
    };
  }, []);

  const onClickNextRound = () => {
    FinishRoundCmd();
    TickCmd("tickUser");
  };

  const getTitle = () => {
    if (canFinishRound()) {
      return "Du kannst jetzt die Runde beenden.";
    }
    const user = PlayerModel.instance.getUser();
    const userIndex = PlayerModel.instance.players.indexOf(user);
    if (GameModel.instance.currentPlayerIndex !== userIndex) {
      return "Du bist noch nicht an der Reihe.";
    }
    if (user.hand.length === 4) {
      return "Du kannst die Runde noch nicht beenden. Du muss mindestens 1 Karte spielen.";
    }
    return "Du kannst die Runde beenden";
  };

  return (
    <Button
      title={getTitle()}
      disabled={!buttonActive}
      onClick={onClickNextRound}
      style={{
        borderRadius: 10,
        width: "100%",
        backgroundColor: buttonActive ? Colors.WHITE : Colors.LIGHT_GRAY1,
      }}
    >
      <div>
        <Icon
          icon={buttonActive ? "play" : "minus"}
          color={LilaRGB}
          size={20}
        ></Icon>
      </div>
    </Button>
  );
}
