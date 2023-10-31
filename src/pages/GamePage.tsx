import { Divider } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { GameCard } from "./GameCard";
import { BottomProperties } from "./BottomProperties";
import { NpcBar } from "./NpcBar";
import { PlayerModel } from "../models/PlayerModel";
import { CardData, PlayerData } from "../models/PlayerData";
import { GameModel } from "../models/GameModel";
import { Logs } from "./Logs";
import { GroupCardsBar } from "./GroupCardsBar";
import { EmptyCard } from "./GameCard";
import { Fade } from "react-awesome-reveal";
import { Settings } from "./Settings";

export default function GamePage() {
  return (
    <div
      style={{
        border: "0px solid black",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        margin: "auto",
      }}
    >
      <div
        style={{
          margin: 5,
          display: "flex",
          height: "120px",
          border: "0px solid black",
        }}
      >
        <div style={{ width: "50%", border: "0px solid black" }}>
          <NpcBar />
        </div>
        <Divider></Divider>
        <div
          style={{ width: "50%", height: "120px", border: "0px solid black" }}
        >
          <Logs />
        </div>
      </div>
      <PlayerCards></PlayerCards>
      <GroupCardsBar />
      <BottomProperties />
    </div>
  );
}

let slots = new Array<CardData | undefined>(4);

function PlayerCards() {
  const gm = GameModel.instance;
  const pm = PlayerModel.instance;
  const user = pm.getUser();
  const currentPlayer = pm.players[gm.currentPlayerIndex];

  const [hand, setHand] = useState<CardData[]>(user.hand);
  const [canUse, setCanUse] = useState<boolean>(currentPlayer.isNpc === false);

  useEffect(() => {
    const listener1 = (e: Event) => {
      const ce = e as CustomEvent;
      const playerInEvent = ce.detail as PlayerData;
      if (playerInEvent === user) {
        setHand([...user.hand]);
      }
    };
    const listener2 = (e: Event) => {
      const currentPlayer = pm.players[gm.currentPlayerIndex];
      setCanUse(currentPlayer.isNpc === false);
    };

    const eventName1 = gm.events.handChanged;
    document.addEventListener(eventName1, listener1);
    const eventName2 = gm.events.roundFinished;
    document.addEventListener(eventName2, listener2);
    return () => {
      document.removeEventListener(eventName1, listener1);
      document.removeEventListener(eventName1, listener2);
    };
  });

  const renderCardByIndex = (index: number) => {
    const flipped = user.flipped.indexOf(hand[index]) > -1;
    return (
      <Fade
        duration={Settings.FADE_TIME / 2}
        delay={(Settings.FADE_TIME / 4) * index}
      >
        <GameCard card={hand[index]} flipped={flipped} canUse={canUse} />
      </Fade>
    );
  };

  const renderEmtyCard = (index: number) => {
    return <EmptyCard />;
  };

  //remove cards from slots that are not in hand
  for (let i = 0; i < 4; i++) {
    if (slots[i] && hand.indexOf(slots[i]!) === -1) {
      slots[i] = undefined;
    }
  }
  //add cards from hand to slots that are not in slots
  for (let i = 0; i < 4; i++) {
    if (slots[i] === undefined) {
      for (let j = 0; j < hand.length; j++) {
        if (slots.indexOf(hand[j]) === -1) {
          slots[i] = hand[j];
          break;
        }
      }
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        border: "0px solid black",
      }}
    >
      <div style={{ width: 1 }}></div>
      {slots[0] ? renderCardByIndex(hand.indexOf(slots[0])) : renderEmtyCard(0)}

      {slots[1] ? renderCardByIndex(hand.indexOf(slots[1])) : renderEmtyCard(1)}

      {slots[2] ? renderCardByIndex(hand.indexOf(slots[2])) : renderEmtyCard(2)}

      {slots[3] ? renderCardByIndex(hand.indexOf(slots[3])) : renderEmtyCard(3)}
      <div style={{ width: 1 }}></div>
    </div>
  );
}
