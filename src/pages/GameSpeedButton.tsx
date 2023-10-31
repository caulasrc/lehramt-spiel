import { Button, Menu, MenuItem, Popover } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { GameModel } from "../models/GameModel";

export function GameSpeedButton() {
  const [curSpeed, setCurSpeed] = useState(GameModel.instance.gameSpeed);

  useEffect(() => {
    GameModel.instance.gameSpeed = curSpeed;
  }, [curSpeed]);
  const onChangeSpeed = (index: 0 | 1 | 2) => {
    setCurSpeed(index);
  };

  const speedText = ["Schnell", "Normal", "Langsam"];
  return (
    <div style={{ display: "flex" }}>
      <Popover
        content={
          <Menu>
            <MenuItem
              text={speedText[0]}
              icon={curSpeed === 0 ? "tick-circle" : "circle"}
              onClick={onChangeSpeed.bind(null, 0)}
            />
            <MenuItem
              text={speedText[1]}
              icon={curSpeed === 1 ? "tick-circle" : "circle"}
              onClick={onChangeSpeed.bind(null, 1)}
            />
            <MenuItem
              text={speedText[2]}
              icon={curSpeed === 2 ? "tick-circle" : "circle"}
              onClick={onChangeSpeed.bind(null, 2)}
            />
          </Menu>
        }
        placement="bottom"
      >
        <Button
          minimal
          alignText="left"
          icon="fast-forward"
          text={"Spielgeschwindigkeit: " + speedText[curSpeed]}
        />
      </Popover>
    </div>
  );
}
