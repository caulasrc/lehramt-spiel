import React, { useEffect, useState } from "react";
import { Button, Colors, Divider, Icon, Text } from "@blueprintjs/core";
import { CardData, PlayerData } from "../models/PlayerData";
import { PlayerModel } from "../models/PlayerModel";
import { GameModel } from "../models/GameModel";
import { LogData, LogsModel } from "../models/LogsModel";
import { CommonColors, EventCardColor, LilaRGB } from "./Settings";
import { useTranslation } from "react-i18next";

let divKey = 0;

const smallCardW = "22px";
const smallCardH = "27px";

export function NpcBar() {
  const npcs = PlayerModel.instance.getNpcs();
  const [selectedNpc, setSelectedNpc] = useState<PlayerData | undefined>(
    undefined
  );
  const eventNameLog = LogsModel.instance.events.logAdded;

  useEffect(() => {
    const listenerLog = (e: Event) => {
      const cd = e as CustomEvent;
      const ld = cd.detail as LogData;
      const pd = ld.player;
      const isUserLog = !pd.isNpc;
      if (isUserLog) {
        if (selectedNpc) {
          scrollTo(npcs[0].id);
        }
        setSelectedNpc(undefined);
        return;
      }
      setSelectedNpc(pd);
      if (!isUserLog) {
        if (ld.type === "fillHand") {
          scrollTo(pd.id);
        }
      }
    };
    document.addEventListener(eventNameLog, listenerLog);
    return () => {
      document.removeEventListener(eventNameLog, listenerLog);
    };
  });

  const onScrollLeft = () => scrollBy(-210);
  const onScrollRight = () => scrollBy(210);
  return (
    <div style={{ display: "flex", border: "0px solid black" }}>
      {npcs.length > 2 && (
        <Button icon="chevron-left" minimal onClick={onScrollLeft}></Button>
      )}
      <div
        id="upper-opponent-bar"
        style={{
          left: 0,
          overflowX: "scroll",
          overflow: "hidden",
          display: "flex",
          height: "120px",
        }}
      >
        <div style={{ display: "flex" }}>
          {npcs.map((p: PlayerData,index) => {
            return (
              <div key={index}  style={{ display: "flex" }}>
                <SingleOpponentElement
                  selected={selectedNpc?.id === p.id}
                  key={divKey++}
                  player={p}
                />
                {(index<npcs.length-1) && <Divider></Divider>}
              </div>
            );
          })}
        </div>
      </div>
      {npcs.length > 2 && (
        <Button icon="chevron-right" minimal onClick={onScrollRight}></Button>
      )}
    </div>
  );
}

function SmallCard(pars: { player: PlayerData; card?: CardData }) {
  const { t } = useTranslation();
  let title = "";
  const isFlipped = pars.player.flipped.find((c: CardData) => c === pars.card)!;
  let cardStyle: any = {
    width: smallCardW,
    height: smallCardH,
    borderRadius: 5,
    textAlign: "center",
    color: Colors.WHITE,
  };
  if (typeof pars.card === "undefined") {
    cardStyle = { ...cardStyle, border: "2px dashed " + Colors.GRAY1 };
    title = t("npcBar.tooltip_no_card");
  } else if (isFlipped) {
    cardStyle = { ...cardStyle, backgroundColor: LilaRGB };
    title = t("npcBar.tooltip_timecard").replace("{0}", pars.card.name);
  } else {
    if (pars.card!.type === "event") {
      cardStyle = { ...cardStyle, backgroundColor: EventCardColor };
      title = pars.card.name;
    }
    if (pars.card!.type === "theory") {
      title = pars.card.name;
      cardStyle = {
        ...cardStyle,
        backgroundColor: CommonColors.groupColorToHex(pars.card!.group!),
      };
    }
  }
  return (
    <div key={divKey++} title={title} style={cardStyle}>
      {isFlipped ? <Icon icon="time" size={12}></Icon> : ""}
    </div>
  );
}

function SingleOpponentElement(pars: {
  player: PlayerData;
  selected: boolean;
}) {
  const [player, setPlayer] = useState<PlayerData>(pars.player);

  useEffect(() => {
    setPlayer({ ...pars.player });
  }, [pars.player]);

  useEffect(() => {
    const eventNameMs = GameModel.instance.events.milestoneChanged;
    const eventNameHand = GameModel.instance.events.handChanged;
    const listener = (e: Event) => {
      const cd = e as CustomEvent;
      const pd = cd.detail as PlayerData;
      if (pd.id === player.id) {
        setPlayer({ ...pd });
      }
    };
    document.addEventListener(eventNameMs, listener);
    document.addEventListener(eventNameHand, listener);
    return () => {
      document.removeEventListener(eventNameMs, listener);
      document.removeEventListener(eventNameHand, listener);
    };
  }, [player]);

  const time = GameModel.instance.getTimeFromFlippedCards(player);
  const msData = GameModel.instance.getMsProgress(player);

  const renderSmallCards = () => {
    const result = new Array<JSX.Element>();
    for (let i = 0; i < 4; i++) {
      result.push(
        <SmallCard
          key={divKey++}
          player={player}
          card={i < pars.player.hand.length ? pars.player.hand[i] : undefined}
        />
      );
    }
    return result;
  };

  const { t } = useTranslation();

  const img = t("npcs.npc" + pars.player.id + "_image");

  return (
    <div
      key={"npc" + pars.player.id}
      id={"npc" + pars.player.id}
      style={{ position: "relative", width: "230px",marginRight:10,marginLeft:10 }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 100,
          height: 100,
          top: 0,
          borderRadius: 50,
          display: "flex",
          justifyContent: "center",
          backgroundImage: "url(faces/" + img + ")",
          backgroundSize: "cover",
          backgroundColor: Colors.WHITE,
        }}
      >
        <div
          style={{
            textAlign: "center",
            borderRadius: 10,
            backgroundColor: Colors.WHITE,
            position: "absolute",
            bottom: -8,
          }}
        >
          <div style={{ margin: 5, display:"flex" }}>
            {t("npcs.npc" + pars.player.id + "_name")}
            <div
              style={{
                display: pars.selected ? "block" : "none",
              }}
            >
              <Icon icon="dot" color={LilaRGB}></Icon>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          borderRadius: 10,
          marginLeft: 100,
          border: "0px solid " + Colors.GRAY1,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "0px black solid",
              width: "100%",
              height: "50px",
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            {renderSmallCards()}
          </div>
        </div>

        <div style={{ height: 5 }}></div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <div style={{ display: "flex" }}>
            <Icon icon="time"></Icon>
            <div style={{ marginLeft: 4 }}>{time}</div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Text ellipsize>
            {t("ms." + msData.name)}: {Math.floor(msData.progress * 100)}%
          </Text>
        </div>

        <div style={{ textAlign: "center" }}>
          <Text ellipsize>
            Punkte: {Math.floor(msData.points)}
          </Text>
        </div>
      </div>
    </div>
  );
}

function scrollBy(left: number) {
  document.getElementById("upper-opponent-bar")?.scrollBy({
    left,
    behavior: "smooth",
  });
}

function scrollTo(npcId: number) {
  const e = document.getElementById("npc" + npcId);
  if (e) {
    document.getElementById("upper-opponent-bar")?.scrollTo({
      left: e.offsetLeft - e.offsetWidth,
      behavior: "smooth",
    });
  }
}
