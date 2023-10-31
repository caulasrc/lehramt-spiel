import {
  Button,
  Classes,
  Colors,
  Divider,
  Icon,
  Popover,
} from "@blueprintjs/core";
import {
  CardProperty,
  CardPropertyType,
  MilestoneLimits,
  PlayerData,
} from "../models/PlayerData";
import React, { useEffect, useState } from "react";
import { PlayerModel } from "../models/PlayerModel";
import { GameModel } from "../models/GameModel";
import { PropertyImage } from "./common/PropertyImage";
import { LilaRGB } from "./Settings";
import { useTranslation } from "react-i18next";
import { NextRoundButton } from "./NextRoundButton";
import { t } from "i18next";

const titleStyle = {
  fontSize: 12,
};

export function BottomProperties() {
  const [playerData, setPlayerData] = useState<PlayerData>(
    PlayerModel.instance.getUser()
  );

  useEffect(() => {
    const eventName1 = GameModel.instance.events.handChanged;
    const eventName2 = GameModel.instance.events.milestoneChanged;
    const listener = (e: Event) => {
      const cd = e as CustomEvent;
      const pd = cd.detail as PlayerData;
      if (pd.isNpc) {
        return;
      }
      setPlayerData({ ...pd });
    };
    document.addEventListener(eventName1, listener);
    document.addEventListener(eventName2, listener);
    return () => {
      document.removeEventListener(eventName1, listener);
      document.removeEventListener(eventName2, listener);
    };
  }, []);

  const renderOneProperty = (index: number) => {
    const prop = playerData.properties[index];
    const milestone = playerData.milestone.requirements.find(
      (m: CardProperty) => m.type === prop.type
    )!;
    return (
      <OneProperty prop={prop} milestoneValue={milestone?.value}></OneProperty>
    );
  };

  const totalFlippedCards = playerData.flipped.length;
  const msName = playerData.milestone.name;
  const progress=GameModel.instance.getMsProgress(playerData);
  const msProgress = Math.floor(
    progress.progress * 100
  );
  const msValue = msProgress + "%";
  const time = totalFlippedCards + (playerData.timeBackup ? 1 : 0);
  const propStyle = { width: "19%", display: "block", marginTop: "auto" };
  return (
    <div style={{ display: "flex", width: "100%", border: "0px solid black" }}>
      <div style={propStyle}>{renderOneProperty(0)}</div>
      <div style={propStyle}>{renderOneProperty(1)}</div>
      <div style={{ width: "24%", border: "0px solid white" }}>
        <TimeBar
          time={time}
          backup={playerData.timeBackup}
          msName={msName}
          msValue={msValue}
          points={progress.points}
        ></TimeBar>
      </div>
      <div style={propStyle}>{renderOneProperty(2)}</div>
      <div style={propStyle}>{renderOneProperty(3)}</div>
    </div>
  );
}

function TimeBar(pars: {
  time: number;
  backup: boolean;
  msName: string;
  msValue: string;
  points:number;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        display: "block",
        borderRadius: 10,
        border: "0px solid yellow",
        position: "relative",
        justifyContent: "space-around",
        marginLeft: 5,
        marginRight: 5,

        backgroundColor: LilaRGB,
      }}
    >
      <div
        style={{
          display: "flex",
          border: "0px solid black",
          justifyContent: "space-between",
          padding: 5,
        }}
      >
        <div style={{ border: "0px solid black", width: "90px" }}>
          <MsButton msName={pars.msName} msValue={pars.msValue}></MsButton>
        </div>

        <div style={{ border: "0px solid black", width: "90px" }}>
          <PointsButton points={pars.points}></PointsButton>
        </div>
        <div style={{ border: "0px solid black", width: "90px" }}>
          <TimeButton time={pars.time} backup={pars.backup}></TimeButton> 
        </div>
      </div>

      <div style={{ paddingLeft: 5, paddingRight: 5, paddingBottom: 5 }}>
        <NextRoundButton />
      </div>
    </div>
  );
}

function OneProperty(pars: { prop: CardProperty; milestoneValue: number }) {
  const { t } = useTranslation();
  return (
    <div
      title={t("common." + pars.prop.type + "_tooltip")}
      style={{
        borderRadius: 10,
        margin: 5,
        padding: 5,
        display: "flex",
        border: "0px solid grey",
        backgroundColor: Colors.WHITE,
      }}
    >
      <PropertyImage scale={0.045} type={pars.prop.type} />
      <div style={{ width: 5 }}></div>
      <div style={{ display: "block", userSelect: "none" }}>
        <div style={titleStyle}>{t("common." + pars.prop.type)}</div>
        <RenderPropValue
          val={pars.prop.value}
          max={pars.milestoneValue}
          propType={pars.prop.type}
        ></RenderPropValue>
      </div>
    </div>
  );
}

function RenderPropValue(pars: {
  val: number;
  max: number;
  propType: CardPropertyType;
}) {
  const propName=t("common."+pars.propType);

  if (pars.val === pars.max) {
    
    const title =
      "Du hast 100% an '" + propName+ "' für den aktuellen Meilenstein erreicht.";
    return (
      <div style={{ display: "flex", alignItems: "center" }} title={title}>
        <Icon icon="tick-circle"></Icon>
        <div style={{ width: 4 }}></div>
        <div>100%</div>
      </div>
    );
  }
  
  const lastMilestoneLimit = MilestoneLimits[
    MilestoneLimits.length - 1
  ].requirements.find((m) => m.type === pars.propType)!.value;
  if (pars.val >= lastMilestoneLimit) {
    const add = pars.val - lastMilestoneLimit;
    let title =
      "Du hast 100% an '" +
      propName +
      "' für den letzten Meilenstein 'Master' erreicht.";

    if(add>0) {
      title+=" Du hast zusätzlich "+add+" Punkte für den Highscore.";
    }
    const addStr=(add>0?" (+"+add+")":"");
    return (
      <div style={{ display: "flex", alignItems: "center" }} title={title}>
        <Icon icon="tick-circle"></Icon>
        <div style={{ width: 4 }}></div>
        <div>100% {addStr}</div>
      </div>
    );
  }

  

  if (pars.val > pars.max) {

    const add = pars.val - pars.max;
    const title =
      "Du hast 100% an '" +
      propName +
      "' für den aktuellen Meilenstein und zusätzlich " +
      add +
      " für den nächsten.";
    return (
      <div style={{ display: "flex", alignItems: "center" }} title={title}>
        <Icon icon="tick-circle"></Icon>
        <div style={{ width: 4 }}></div>
        <div>100% (+{add})</div>
      </div>
    );
  }
  
  const title =
    "Du hast " +
    pars.val +
    " von " +
    pars.max +
    " '" +
    propName +
    "' für den aktuellen Meilenstein.";
  return (
    <div title={title}>
      {pars.val}/{pars.max}
    </div>
  );
}

function TimeButton(pars: { time: number,backup:boolean }) {

  let desc=<p>Du hast in dieser Runde {pars.time} Zeitpunkt(e) zur Verfügung. </p>
  if(pars.backup) {
    desc=<p>Du hast in dieser Runde {pars.time} Zeitpunkt(e) zur Verfügung und 1 Zeitpunkt im Zeitvorrat. </p>;
  }
  if(pars.time===0 && !pars.backup) {
    desc=<p style={{color:Colors.RED1}}>Du hast in dieser Runde keine Zeit mehr zur Verfügung.</p>;
  }
  const renderBody = () => {
    return (
      <div>
        <h3>Zeit</h3>
        <p>
          Hier siehst du wie viel Zeit dir in dieser Runde zur Verfügung steht.
        </p>
        
         {desc}
        <Divider></Divider>
        <p>
          Wenn du auf eine Karte klickst und sie umdrehst, bekommst du Zeit
          gutgeschrieben. Nutze diese Zeit um Theorien zu erlernen oder an
          Ereignissen teilzunehmen.
        </p>
        <div style={{ display: "flex" }}>
          <div style={{ margin: 5 }}>
            <Icon icon="inheritance"></Icon>
          </div>
          <div>
            Du kannst auch Zeit von einer Runde in die nächste mitnehmen, in dem
            du eine Karte in den Zeitvorrat verschiebst.
          </div>
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
          minimal
          {...targetProps}
          style={{
            margin: 0,
            padding: 0,
          }}
        >
          <div
            style={{
              textAlign: "center",
              display: "block",
              border: "0px solid white",
            }}
          >
            <div style={{ color: "white", ...titleStyle }}>Zeit</div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              
              {pars.backup &&  <Icon color="white" style={{marginRight:5}} icon="inheritance"></Icon>}
              <Icon
                icon="time"
                style={{ margin: 0, padding: 0, color: "white" }}
              />
              <div style={{ width: 4 }}></div>
              <div style={{ color: "white" }}>{pars.time}</div>
            </div>
          </div>
        </Button>
      )}
    />
  );
}

function MsButton(pars: { msName: string; msValue: string }) {
  const { t } = useTranslation();
  const allMsNames = MilestoneLimits.map((m) => m.name);
  const currentMsIndex = allMsNames.indexOf(pars.msName);
  const renderBody = () => {
    return (
      <div style={{ width: 700, padding: 10 }}>
        <h3>Meilenstein</h3>
        <p>
          Du hast deinen aktuellen Meilenstein <i>{t("ms." + pars.msName)}</i> zu{" "}
          {pars.msValue} abgeschlossen.
        </p>
        <Divider></Divider>
        {allMsNames.map((msName, index) => {
          const opacity = currentMsIndex >= index ? 1 : 0.4;
          return (
            <div style={{ margin: 5, opacity }} key={index}>
              <div style={{ display: "flex", fontWeight: "bold" }}>
                <div>
                  {index + 1}. {t("ms." + msName)}
                </div>
                {currentMsIndex > index && (
                  <Icon icon="tick" style={{ marginLeft: 5 }}></Icon>
                )}
              </div>
              <div>{t("ms." + msName + "_desc")}</div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <Popover
      interactionKind="click"
      popoverClassName={Classes.POPOVER_CONTENT_PLACEMENT}
      placement="top"
      content={renderBody()}
      renderTarget={({ isOpen, ...targetProps }) => (
        <Button
          {...targetProps}
          minimal
          style={{
            margin: 0,
            padding: 0,
          }}
        >
          <div style={{ display: "block", width: "100%", color: Colors.WHITE }}>
            <div style={titleStyle}>{t("ms." + pars.msName)}</div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                whiteSpace: "pre-line",
              }}
            >
              {pars.msValue}
            </div>
          </div>
        </Button>
      )}
    />
  );
}

function PointsButton(pars: { points: number }) {
  const renderBody = () => {
    return <div><h3>Punkte</h3> Die Punkte geben an, wie viel der unteren Eigenschaften du bereits erreicht hast. Es ist somit die Summe von Wissen, Motivation, Erfahrung und Empowerment. Der Punktestand ist u.A. wichtig für die Highscore Auswertung am Ende des Spiels.</div>;
  };
  return (
    <Popover
      interactionKind="click"
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      placement="top"
      content={renderBody()}
      renderTarget={({ isOpen, ...targetProps }) => (
        <Button
          minimal
          {...targetProps}
          style={{
            borderRadius: 5,
            margin: 0,
            padding: 0,
            color: Colors.WHITE,
          }}
        >
          <div
            style={{
              textAlign: "center",
              display: "block",
              border: "0px solid white",
            }}
          >
            <div
              style={{
                display: "block",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <div style={{ color: "white", ...titleStyle }}>Punkte</div>
              <div style={{ color: "white" }}>{pars.points}</div>
            </div>
          </div>
        </Button>
      )}
    />
  );
}


