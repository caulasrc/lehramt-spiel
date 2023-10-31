import { Button, Card, Colors, Divider, Icon } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import { Flip } from "react-awesome-reveal";
import { EventCardColor, LilaRGB, Settings, TheoryCardColor } from "./Settings";
import React from "react";
import { CardData, CardProperty, CardPropertyType } from "../models/PlayerData";
import { PlayCardCmd } from "../cmd/PlayCardCmd";
import { PropertyImage } from "./common/PropertyImage";
import { FlipCardCmd } from "../cmd/FlipCardCmd";
import { PlayerModel } from "../models/PlayerModel";
import { CheckCanPlayCardCmd } from "../cmd/CheckCanPlayCardCmd";
import { AddCardBackupCmd } from "../cmd/AddCardBackupCmd";
import { CommonColors } from "./Settings";
import { useTranslation } from "react-i18next";

const cardW = "210px";
const cardH = "330px";

export function EmptyCard() {
  return (
    <div
      style={{
        border: "2px dashed " + Colors.LIGHT_GRAY1,
        padding: 10,
        margin: 10,
        borderRadius: 20,
        width: cardW,
        height: cardH,
      }}
    ></div>
  );
}

function CardButton(pars: { card: CardData; canUse: boolean }) {
  const onPlayCardButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    const user = PlayerModel.instance.getUser();
    const checkCanPlay = CheckCanPlayCardCmd(user, pars.card);
    if (checkCanPlay) {
      PlayCardCmd(user, pars.card);
    }
  };

  if (pars.card.type === "event") {
    const noCosts = pars.card.costs < 1; //negative events have no costs
    const totalPlayerNeeded =
      pars.card.socialForm === "solo" ||
      pars.card.socialForm === "negative-solo" ||
      pars.card.socialForm === "negative-group"
        ? 1
        : 2;
    return (
      <div style={{ display: "flex", width: "100%" }}>
        <Button
          icon="walk"
          fill
          onClick={onPlayCardButton}
          disabled={!pars.canUse}
        >
          Teilnehmen
        </Button>
        <Divider hidden={totalPlayerNeeded < 2}></Divider>
        <div
          hidden={totalPlayerNeeded < 2}
          title={"Dieses Ereignis kann mit anderen Mitspieler*innen erfolgen."}
        >
          <div>
            <Icon icon="people"></Icon>
          </div>
          <div style={{ fontSize: 10 }}>1+</div>
        </div>
        <Divider hidden={noCosts}></Divider>
        <div hidden={noCosts} title={"Zeitkosten: " + pars.card.costs}>
          <div>
            <Icon icon="time"></Icon>
          </div>
          <div style={{ fontSize: 10 }}>{pars.card.costs}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Button
        icon="learning"
        fill
        onClick={onPlayCardButton}
        disabled={!pars.canUse}
      >
        Erlernen
      </Button>
      <Divider hidden={pars.card.costs < 1}></Divider>
      <div
        hidden={pars.card.costs < 1}
        title={"Zeitkosten: " + pars.card.costs}
      >
        <div>
          <Icon icon="time"></Icon>
        </div>
        <div style={{ fontSize: 10 }}>{pars.card.costs}</div>
      </div>
    </div>
  );
}

export function GameCard(pars: {
  card: CardData;
  flipped: boolean;
  canUse: boolean;
}) {
  const [flipped, setFlipped] = useState<boolean>(pars.flipped);

  useEffect(() => {
    setFlipped(pars.flipped);
  }, [pars.flipped]);

  const onClickFlip = (e: React.MouseEvent) => {
    const player = PlayerModel.instance.getUser();
    FlipCardCmd(player, pars.card, "both");
  };

  const onAddToBackup = (e: React.MouseEvent) => {
    e.stopPropagation();
    const player = PlayerModel.instance.getUser();
    AddCardBackupCmd(player, pars.card);
  };
  const canAddBackup = !PlayerModel.instance.getUser().timeBackup;

  const renderDownContents = () => {
    return (
      <div
        style={{
          display: "block",
          width: cardW,
          height: cardH,
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "290px",
            backgroundColor: LilaRGB,
            marginBottom: 120,
            borderRadius: 5,
            backgroundImage: "url(sclock.png)",
            backgroundSize: "80px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            display: "block",
          }}
        >
          <Button
            icon="inheritance"
            fill
            onClick={onAddToBackup}
            disabled={!pars.canUse || !canAddBackup}
          >
            Zeitvorrat
          </Button>
        </div>
      </div>
    );
  };

  const renderUpContents = () => {
    return (
      <div
        style={{
          display: "block",
          textAlign: "center",
          justifyContent: "center",
          border: "0px solid black",
          width: cardW,
          height: cardH,
          position: "relative",
        }}
      >
        <div
          style={{
            borderRadius: 5,
            backgroundColor: pars.card.group ? TheoryCardColor : EventCardColor,
            height: "290px",
          }}
        >
          <div
            title={pars.card.name}
            style={{
              display: "block",
              width: "100%",
              borderRadius: 5,
              padding: 5,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                wordBreak: "break-word",
                lineHeight: "20px",
                height: "50px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
                borderRadius: "5px 5px 0px 0px",
                padding: 5,
                color: "white",
                border: "0x dashed black",
                backgroundColor: pars.card.group
                  ? CommonColors.groupColorToHex(pars.card.group)
                  : EventCardColor,
              }}
            >
              {pars.card.name}
            </div>
            <div
              style={{
                width: "100%",
                height: "165px",
                backgroundColor: "white",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={"cards/" + pars.card.image}
                  width="65px"
                  height="65px"
                  alt=""
                  style={{ display: pars.card.image ? "block" : "none" }}
                ></img>
              </div>
              <div
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  fontSize: 12,
                  fontStyle: "italic",
                }}
              >
                {pars.card.desc}
              </div>
            </div>
          </div>

          <div style={{ paddingBottom: 5 }}>
            <GameCardProperties card={pars.card} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <CardButton card={pars.card} canUse={pars.canUse} />
        </div>
      </div>
    );
  };

  const renderCard = (canFlip: boolean) => (
    <Card
      onClick={canFlip ? onClickFlip : () => {}}
      elevation={canFlip ? 1 : 0}
      interactive={canFlip}
      style={{
        padding: 10,
        borderRadius: 10,
        backgroundColor: canFlip ? Colors.WHITE : Colors.DARK_GRAY5,
      }}
    >
      {!flipped && renderUpContents()}
      {flipped && renderDownContents()}
    </Card>
  );

  const canFlip = pars.card.costs > 0;
  return (
    <Flip
      key={flipped ? 1 : 0}
      direction="vertical"
      duration={Settings.FADE_TIME * 2}
    >
      {renderCard(canFlip)}
    </Flip>
  );
}

function GameCardProperty(pars: {
  data: CardProperty;
  style?: object;
  clr?: "black" | "white";
  opacity?: number;
}) {
  const border = "0px solid black";
  const { t } = useTranslation();
  const txtColor = pars.clr === "white" ? Colors.WHITE : Colors.BLACK;
  return (
    <div style={{ justifyContent: "center", display: "flex", border }}>
      <div
        title={t("common." + pars.data.type)}
        style={{
          border,
          display: "block",
        }}
      >
        <PropertyImage
          opacity={pars.opacity}
          scale={0.05}
          type={pars.data.type}
          clr={pars.clr}
        />
        <div
          style={{
            border,
            color: txtColor,
            opacity: pars.opacity ? pars.opacity : 1,
          }}
        >
          {pars.data.value > 0 ? "+" + pars.data.value : pars.data.value}
        </div>
      </div>
    </div>
  );
}

function GameCardProperties(pars: { card: CardData }) {
  const border = "0px solid black";
  const propStyle = {
    //width: "60px",
    //height: "60px",
    border,
  };

  const props = pars.card.properties;

  const renderProp = (propType: CardPropertyType) => {
    const existingProp = props.find((p) => p.type === propType);
    if (!existingProp) {
      const emptyProp: CardProperty = { type: propType, value: 0 };
      return (
        <GameCardProperty
          opacity={0.33}
          style={propStyle}
          data={emptyProp}
          clr="white"
        />
      );
    }
    return (
      <div
        key={propType}
        style={{
          display: "block",
          justifyContent: "center",
          alignContent: "start",
          border: "0px solid black",
        }}
      >
        <GameCardProperty style={propStyle} data={existingProp} clr="white" />
      </div>
    );
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      {renderProp("knowledge")}
      {renderProp("motivation")}
      {renderProp("experience")}
      {renderProp("empowerment")}
    </div>
  );
}

/*
function InfoButton(pars: { card: CardData }) {
  const renderBody = () => {
    return (
      <div>
        <h3>{pars.card.name}</h3>
        <div style={{ display: "flex" }}>
          <img
            src={"cards/" + pars.card.image}
            width="128px"
            height="128px"
            alt=""
            style={{ display: pars.card.image ? "block" : "none" }}
          ></img>
          <p>{pars.card.desc}</p>
        </div>
      </div>
    );
  };
  return (
    <Popover
      interactionKind="click"
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      placement="top"
      content={renderBody()}
      renderTarget={({ isOpen, ...targetProps }) => (
        <Button
          {...targetProps}
          minimal
          color="white"
          small
          style={{
            margin: 0,
            padding: 0,
            color: Colors.WHITE,
            borderRadius: 5,
            position: "absolute",
            top: 2,
            right: 2,
            backgroundColor: Colors.WHITE,
          }}
          icon="info-sign"
        />
      )}
    />
  );
}
*/
