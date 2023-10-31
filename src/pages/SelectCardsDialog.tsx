import {
  Button,
  Colors,
  DialogBody,
  DialogFooter,
  Divider,
} from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { CardData, PlayerData } from "../models/PlayerData";
import { GameModel } from "../models/GameModel";
import { PlayerModel } from "../models/PlayerModel";
import { FlipCardCmd } from "../cmd/FlipCardCmd";
import { LilaRGB } from "./Settings";
import { t } from "i18next";
import { PropertyImage } from "./common/PropertyImage";
let keyIndex = 0;

export function SelectCardsDialog(pars: { card: CardData }) {
  const user = PlayerModel.instance.getUser();
  const time = GameModel.instance.getTimeFromFlippedCards(user);
  const restTimeNeeded = pars.card.costs - time;
  const [allCards, setAllCards] = useState<CardData[]>(user.hand);

  const eventName = GameModel.instance.events.handChanged;

  useEffect(() => {
    const listener = (e) => {
      const ce = e as CustomEvent;
      const pd = ce.detail as PlayerData;
      if (pd === user) {
        setAllCards([...user.hand]);
      }
    };
    document.addEventListener(eventName, listener);
    return () => {
      document.removeEventListener(eventName, listener);
    };
  });

  const onClick = () => {
    document.dispatchEvent(new Event("confirm"));
  };

  const renderRewards = () => {
    return (
      <div>
        {pars.card.properties.map((v, i) => {
          const propName = t("common." + v.type);
          const propValue=(v.value>0?"+"+v.value:v.value.toString());
          return (
            <div style={{display:"flex",marginRight:10}}>
              <PropertyImage scale={0.025} type={v.type}></PropertyImage>
              <div style={{display:"block", marginLeft:5, marginTop:"auto",marginBottom:"auto"}}> {propName + ": " + propValue}</div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <>
      <DialogBody>
        <b>{pars.card.name}</b>
        <br></br>
        <i>{pars.card.desc}</i>
        <Divider />
        <div style={{ display: "block" }}>
          <b>Du bekommst: </b>
          <div>{renderRewards()}</div>
        </div>

        <Divider />
        <div style={{ display: restTimeNeeded > 0 ? "block" : "none" }}>
          <b>Aber:</b>
          <br></br>
          Um am Ereignis "{pars.card.name}" teilzunehmen, brauchst du mehr Zeit.
          Wähle {restTimeNeeded} weitere Karte(n) aus, die du gegen Zeit dafür
          eintauschen möchtest.
        </div>
        <div style={{ height: 5 }}></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {allCards.map((c: CardData) => {
            return (
              <RenderCard
                key={keyIndex++}
                targetCosts={pars.card.costs}
                card={c}
                player={user}
              ></RenderCard>
            );
          })}
        </div>
      </DialogBody>
      <DialogFooter
        actions={
          <Button
            disabled={restTimeNeeded > 0}
            intent="primary"
            text="Teilnehmen"
            onClick={onClick}
          />
        }
      />
    </>
  );
}

function RenderCard(pars: {
  player: PlayerData;
  card: CardData;
  targetCosts: number;
}) {
  const [data, setData] = useState(pars);

  useEffect(() => {
    setData({ ...pars });
  }, [pars]);

  const onClickCheck = () => {
    //
    FlipCardCmd(data.player, data.card, "both");
    const curTime = GameModel.instance.getTimeFromFlippedCards(data.player);
    if (curTime > pars.targetCosts) {
      //
      data.player.flipped.forEach((flippedCard: CardData) => {
        if (flippedCard !== data.card) {
          FlipCardCmd(data.player, flippedCard, "unflipOnly");
          return;
        }
      });
    }
  };

  const imgUrl="cards/" + pars.card.image!;
  const checked = data.player.flipped.includes(data.card);
  return (
    <div style={{ display: "block",justifyContent:"space-evenly" }}>
      <div
        style={{
          display: "block",
          margin: 5,
          padding: 5,
          backgroundColor: Colors.WHITE,
          borderRadius: 10,
          width: "150px",
          height: "170px",
          border: "2px solid " + (checked?LilaRGB:Colors.LIGHT_GRAY1),
          textAlign: "center",
          boxShadow: checked?"0px 0px 5px 0px rgba(0,0,0,0.5)":"",
        }}
      >
        <div
          style={{
            textAlign: "center",
            wordWrap: "break-word",
            wordBreak: "break-word",
            whiteSpace: "normal",
            height:"50px"
          }}
        >
          {pars.card.name}
        </div>
        <div>
          <img src={imgUrl} alt=""  height={70}></img>
        </div>
        <div>
        <Button onClick={onClickCheck} icon={checked?"tick-circle":"circle"}>Tauschen</Button>
        </div>
        
      </div>
    </div>
  );
}
