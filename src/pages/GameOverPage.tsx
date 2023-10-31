import React, { useEffect } from "react";
import { PlayerModel } from "../models/PlayerModel";
import { PlayerData } from "../models/PlayerData";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Button, Divider } from "@blueprintjs/core";

export function GameOverPage() {
  const [, setCookie] = useCookies(["level"]);
  const pm = PlayerModel.instance;
  const sortedPlayers = pm.getSortedPlayers();
  const userWin = sortedPlayers[0][0] === pm.getUser();
  const nextLevel = pm.getHighestLevelNpc().level + 1;

  useEffect(() => {
    if (userWin) {
      setCookie("level", nextLevel, { path: "/" });
    }
  });
  const onClickRestart = () => {
    const event = new CustomEvent("goto", { detail: "intro" });
    document.dispatchEvent(event);
  };

  const renderRestartButton = () => {
    return (
      <div>
        <Divider></Divider>
        <Button intent="none" onClick={onClickRestart} icon="play">
          Spiel neu starten
        </Button>
      </div>
    );
  };

  const { t } = useTranslation();
  return (
    <div style={{ margin: 10, padding: 10, display: "flex" }}>
      <div style={{ width: "60%", display: userWin ? "none" : "block" }}>
        <h2>{t("highscore.lose_title")}</h2>
        <p>{t("highscore.lose_desc")}</p>
        {renderRestartButton()}
      </div>
      <div style={{ width: "60%", display: userWin ? "block" : "none" }}>
        <h2>{t("highscore.win_title")}</h2>
        <p>{t("highscore.win_desc")}</p>

        <div style={{ display: nextLevel < 6 && userWin ? "block" : "none" }}>
          <h2>Ferner</h2>
          <p>
            Jemand Neues wurde freigeschaltet. Aber Achtung: Diese Person ist
            noch leistungsstärker als die anderen!
          </p>
        </div>
        {renderRestartButton()}
      </div>

      <div style={{ width: "10%" }}></div>
      <div style={{ width: "30%" }}>
        <Highscore sortedPlayers={sortedPlayers} />
        <Statistics />
      </div>
    </div>
  );
}

function Highscore(pars: { sortedPlayers: Array<[PlayerData, number]> }) {
  const sortedPlayers = pars.sortedPlayers;
  const user = PlayerModel.instance.getUser();
  const { t } = useTranslation();
  return (
    <div>
      <h2>Highscore</h2>
      <table>
        <tbody>
          <tr>
            <td>#</td>
            <td style={{ width: "100px", fontWeight: "bold" }}>
              {t("highscore.player")}
            </td>
            <td style={{ width: "100px", fontWeight: "bold" }}>
              {t("highscore.milestone")}
            </td>
            <td style={{ fontWeight: "bold" }}>Punkte</td>
          </tr>

          {sortedPlayers.map((p, i) => (
            <tr key={i}>
              <td>{i + 1}.</td>
              <td>
                {p[0] === user ? (
                  <u style={{ color: "green" }}>{t("highscore.you")}</u>
                ) : (
                  t("npcs.npc" + p[0].id + "_name")
                )}
              </td>
              <td>{p[0].milestone.name}</td>
              <td>{p[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Statistics() {
  const { t } = useTranslation();
  const pm = PlayerModel.instance;
  const myStatistics = pm.getUser().statistics;

  const durationTimestamp =
    myStatistics.lastMoveTimestamp - myStatistics.firstMoveTimestamp;
  const d = new Date(durationTimestamp);
  const timeStr = d.getMinutes() + "m " + d.getSeconds() + "s";

  return (
    <div>
      <h2>{t("highscore.stats")}</h2>
      <table>
        <tbody>
          <tr>
            <td style={{ width: "200px" }}>{t("highscore.stats_time")}</td>
            <td>{timeStr}</td>
          </tr>

          <tr>
            <td>{t("highscore.stats_rounds")}</td>
            <td>{myStatistics.roundsFinished}</td>
          </tr>

          <tr>
            <td>{t("highscore.stats_theories")}</td>
            <td>{myStatistics.theoriesLearned}</td>
          </tr>

          <tr>
            <td>{t("highscore.stats_events")}</td>
            <td>{myStatistics.totalEventsParticipatedIn}</td>
          </tr>

          <tr>
            <td>{t("highscore.stats_events_created")}</td>
            <td>{myStatistics.totalEventsStarted}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
