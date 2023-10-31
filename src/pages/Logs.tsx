import React, { useEffect, useState } from "react";
import { LogData, LogsModel } from "../models/LogsModel";
import {
  Button,
  Classes,
  Divider,
  Icon,
  Popover,
} from "@blueprintjs/core";
import { PlayerModel } from "../models/PlayerModel";
import { LilaRGB, Settings } from "./Settings";
import { CardData } from "../models/PlayerData";
import { PropertyImage } from "./common/PropertyImage";
import * as i18 from "react-i18next";
import { Fade } from "react-awesome-reveal";

let divIndex = 0;

const getLogMsgString = (ld: LogData): string => {
  const user = PlayerModel.instance.getUser();
  const t = i18.getI18n().t;
  const npcName = t("npcs.npc" + ld.player.id + "_name");
  if (ld.type === "gameStarted") {
    return t("logs.game_started");
  }

  if (ld.type === "emptyHand") {
    if (ld.player === user) {
      return t("logs.empty_hand");
    } else {
      return "";
    }
  }

  if (ld.type === "gameWon") {
    if (ld.player === user) {
      return t("logs.game_won_user");
    } else {
      return t("logs.game_won_npc").replace("{0}", npcName);
    }
  }
  if (ld.type === "finishRound") {
    if (ld.player === user) {
      return t("logs.finish_round_user");
    } else {
      return t("logs.finish_round_npc").replace("{0}", npcName);
    }
  }
  if (ld.type === "fillHand") {
    if (ld.player === user) {
      return t("logs.fill_hand_user");
    } else {
      return t("logs.fill_hand_npc").replace("{0}", npcName);
    }
  }
  if (ld.type === "event") {
    const playerName = t("npcs.npc" + ld.player.id + "_name");
    const question = t("logs.event_question").replace("{0}", ld.card?.name!);
    return playerName + ": " + question;
  }
  if (ld.type === "negativeEvent") {
    if (ld.player === user) {
      return t("logs.negative_event_user").replace("{0}", ld.card?.name!);
    } else {
      return t("logs.negative_event_npc")
        .replace("{0}", npcName)
        .replace("{1}", ld.card?.name!);
    }
  }
  if (ld.type === "theoryLearned") {
    if (ld.player === user) {
      return t("logs.theory_learned_user").replace("{0}", ld.card?.name!);
    } else {
      return t("logs.theory_learned_npc")
        .replace("{0}", npcName)
        .replace("{1}", ld.card?.name!);
    }
  }
  if (ld.type === "eventParticipated") {
    if (ld.player === user) {
      return t("logs.event_participated_user").replace("{0}", ld.card?.name!);
    } else {
      return t("logs.event_participated_npc")
        .replace("{0}", npcName)
        .replace("{1}", ld.card?.name!);
    }
  }
  if (ld.type === "milestoneReached") {
    const translatedMsName=t("ms."+ld.player.milestone.name);
    if (ld.player === user) {
      return t("logs.milestone_reached_user").replace(
        "{0}",
        translatedMsName
      );
    } else {
      return t("logs.milestone_reached_npc")
        .replace("{0}", npcName)
        .replace("{1}", translatedMsName);
    }
  }
  if (ld.type === "backupcard") {
    if (ld.player === user) {
      return t("logs.backup_user").replace("{0}", ld.card?.name!);
    } else {
      return t("logs.backup_npc")
        .replace("{0}", npcName)
        .replace("{1}", ld.card?.name!);
    }
  }
  return "";
};

const createLogDiv = (data: LogData) => {
  const user = PlayerModel.instance.getUser();
  return (
    <div
      title={data.card ? data.card.desc : undefined}
      key={divIndex++}
      style={{ margin: 0, padding: 1 }}
    >
      {data.type === "event" && (
        <EventLog msg={getLogMsgString(data)} ld={data}></EventLog>
      )}
      {data.type !== "event" && (
        <MsgLog
          logId={data.id}
          msg={getLogMsgString(data)}
          isUser={user === data.player}
        ></MsgLog>
      )}
    </div>
  );
};

export function Logs() {
  const [logs, setLogs] = useState<
    Array<{ data: LogData; element: JSX.Element }>
  >([]);

  useEffect(() => {
    if (logs.length === 0) {
      setLogs(
        LogsModel.instance.logs.map((e) => {
          return { data: e, element: createLogDiv(e) };
        })
      );
    }
  }, [logs]);

  useEffect(() => {
    const eventName = LogsModel.instance.events.logAdded;
    const f = (_e: Event) => {
      const ce = _e as CustomEvent;
      const lastNewLog = ce.detail as LogData;
      setLogs((prev) => {
        const alreadyPresent = prev.find((e) => e.data === lastNewLog);
        if (alreadyPresent) {
          return prev;
        }
        const newVal = [
          ...prev,
          { data: lastNewLog, element: createLogDiv(lastNewLog) },
        ];
        if (newVal.length > 20) {
          newVal.shift();
        }
        return newVal;
      });
    };
    document.addEventListener(eventName, f);
    return () => document.removeEventListener(eventName, f);
  });

  useEffect(() => {
    const logsDiv = document.getElementById("logs");
    if (!logsDiv) {
      return;
    }
    logsDiv.scrollTop = logsDiv.scrollHeight;
  }, [logs]);

  return (
    <div
      id="logs"
      style={{
        width: "100%",
        overflowY: "auto",
        scrollBehavior: "smooth",
        border:"0px solid black",
        height:"120px"
      }}
    >
      {logs.map((e) => {
        if (e.data.type === "event") {
          //re render event logs, because they have a callback and can change
          return createLogDiv(e.data);
        } else {
          return e.element;
        }
      })}
    </div>
  );
}

function MsgLog(pars: { logId: number; msg: string; isUser: boolean }) {
  return (
    <Fade key={pars.logId} triggerOnce={true} duration={Settings.FADE_TIME * 2}>
      <div style={{ display: "flex", margin: 2 }}>
        {!pars.isUser && <Icon icon="dot" color={LilaRGB}></Icon>}
        <div>{pars.msg}</div>
      </div>
    </Fade>
  );
}

function EventLog(pars: { ld: LogData; msg: string }) {
  const callback = pars.ld.callback;
  const hasCallback = callback ? true : false;
  const isUser = pars.ld.player === PlayerModel.instance.getUser();
  const t = i18.getI18n().t;

  const onClickNo = () => {
    callback!(pars.ld, false);
  };
  const onClickYes = () => {
    callback!(pars.ld, true);
  };
  return (
    <div style={{ display: "flex", margin: 2 }}>
      {!isUser && <Icon icon="dot"></Icon>}
      <div>
        <div>{pars.msg}</div>

        <div style={{ display: "flex", marginTop: 5 }}>
          <Button intent="primary" disabled={!hasCallback} onClick={onClickYes}>
            <div style={{ display: "flex" }}>
              <div>{t("logs.participate")}</div>
              <Divider></Divider>

              <Icon icon="time"></Icon>
              <div style={{ width: 4 }}></div>
              <div style={{}}>{pars.ld.card!.costs}</div>
            </div>
          </Button>
          <div style={{ width: 5 }}></div>
          <Button rightIcon="cross" disabled={!hasCallback} onClick={onClickNo}>
            {t("logs.decline")}
          </Button>
          <div style={{ width: 5 }}></div>
          <InfoButton card={pars.ld.card!}></InfoButton>
        </div>
      </div>
    </div>
  );
}

function InfoButton(pars: { card: CardData }) {
  const t = i18.getI18n().t;
  const renderBodyEvent = () => {
    return (
      <div>
        <h3>{pars.card.name}</h3>
        <p>{pars.card.desc}</p>
        <Divider></Divider>
        <i>Wenn du an diesem Event teilnimmst, bekommst du:</i>

        <div style={{ margin: 5 }}>
          {pars.card.properties.map((prop,index) => {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  margin: 5,
                }}
              >
                <PropertyImage key={prop.type} type={prop.type} scale={0.035} />
                <div style={{ width: 5 }} />
                {t("common." + prop.type)}: {prop.value}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <Popover
      interactionKind="click"
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      placement="bottom"
      content={renderBodyEvent()}
      renderTarget={({ isOpen, ...targetProps }) => (
        <Button {...targetProps} icon="info-sign" />
      )}
    />
  );
}
