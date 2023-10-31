import { Button, Checkbox, Colors, Divider, Icon } from "@blueprintjs/core";
import React from "react";
import { PlayerModel } from "../models/PlayerModel";
import { useState } from "react";
import { StartGameCmd } from "../cmd/StartGameCmd";
import { useCookies } from "react-cookie";
import { PlayerPreviewData } from "../models/PlayerData";
import { useTranslation } from "react-i18next";

export function IntroPage() {
  return (
    <div style={{ display: "flex", margin: 10 }}>
      <div style={{ width: "50%" }}>
        <AboutCaula />
      </div>
      <div style={{ width: 10 }}></div>
      <Divider></Divider>
      <div style={{ width: 10 }}></div>
      <div style={{ width: "50%", marginLeft: "10px" }}>
        <SelectPlayer />
      </div>
    </div>
  );
}

function SelectPlayer() {
  const playerPreviews = PlayerModel.instance.playerPreviews;
  const npcsLevel1 = playerPreviews.filter((n) => n.level === 1 && n.isNpc);
  const [checkedNpcs, setCheckedNpcs] = useState(npcsLevel1);
  const [cookies] = useCookies(["level"]);
  const userLevel = cookies.level ? parseInt(cookies.level) : 1;
  const { t } = useTranslation();

  const onClickStart = () => {
    const npcIndexes = checkedNpcs.map((npc) => playerPreviews.indexOf(npc));
    StartGameCmd(npcIndexes);
  };

  const onClickInstructions=()=>{
    document.dispatchEvent(new CustomEvent("InstructionsDialog", { detail: {} }));
  };


  const onCheckNpc = (npc: PlayerPreviewData) => {
    setCheckedNpcs((prev) => {
      const index = prev.indexOf(npc);
      if (index === -1) {
        return [npc].concat(prev);
      } else {
        prev.splice(index, 1);
        if (prev.length === 0) {
          return npcsLevel1.filter((n) => n !== npc);
        }
        return [...prev];
      }
    });
  };

  const renderNpcImage = (npc: PlayerPreviewData) => {
    const img = t("npcs.npc" + npc.id + "_image");
    return (
      <div
        style={{
          width: "70px",
          height: "70px",
          backgroundImage: "url(faces/" + img + ")",
          backgroundSize: "cover",
        }}
      ></div>
    );
  };

  return (
    <div>
      <h2>{t("intro.select_player_title")}</h2>

      <table border={0}>
        <tbody>
          {playerPreviews.map((v, i) => {
            if (!v.isNpc) {
              return undefined;
            }
            return (
              <tr key={i}>
                <td>
                  <div
                    style={{
                      justifyContent: "right",
                      display: "flex",
                    }}
                  >
                    {userLevel < v.level && (
                      <div>
                        <Icon
                          icon="lock"
                          size={22}
                          color={Colors.LIGHT_GRAY1}
                          title={t("intro.tooltips.npc_locked")}
                        />
                      </div>
                    )}
                    {userLevel >= v.level && (
                      <div>
                        <Checkbox
                          onChange={onCheckNpc.bind(null, v)}
                          checked={checkedNpcs.indexOf(v) !== -1}
                          alignIndicator="right"
                          large
                        />
                      </div>
                    )}
                  </div>
                </td>
                <td>{renderNpcImage(v)}</td>
                <td>
                  <b>{t("npcs.npc" + v.id + "_name")}</b>
                  <br />
                  {t("npcs.npc" + v.id + "_desc")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ height: 10 }}></div>
      <div style={{ display: "flex"}}>
        <Button icon="play" style={{width:"70%"}} onClick={onClickStart} intent="primary" large  >
          Start
        </Button>
         <div style={{width:10}}/>
        <Button icon="help" style={{width:"30%"}} onClick={onClickInstructions} large >
        Spielverlauf
        </Button>
      </div>
    </div>
  );
}

function AboutCaula() {
  const { t } = useTranslation();

  return (
    <div style={{}}>
      <div style={{ margin: 10 }}>
        <h2>{t("intro.title")}</h2>
        <p style={{ whiteSpace: "pre-line" }}>
          Didaktik, Pädagogik, Fachwissenschaft – diese drei Bereiche des
          Studiums miteinander zu verknüpfen ist eine schwierige Aufgabe.
          Deshalb wurde im Projekt LeaP@CAU das Kartenspiel „Caula – Spiel des
          Lehramts“ entwickelt, um einen Überblick und einen Anhaltspunkt für
          die Vernetzung des Professionswissens für Lehrkräfte zu vermitteln.
          Das Spiel gibt den (sehr vereinfachten) Verlauf eines Lehramtsstudiums
          an der Christian-Albrechts-Universität zu Kiel (CAU) wieder. Ziel des
          Spiels ist wie im richtigen Lehramtsstudium der Erwerb des Master of
          Education, der nur mit ausreichend Wissen, Motivation, Erfahrung und
          Empowerment zu erreichen ist. Caula – Spiel des Lehramts gibt es auch
          als analoges Kartenspiel für mehrere Spieler*innen. Probiere gerne
          beide Versionen des Spiels aus. Das analoge Spiel erhältst Du beim
          Zentrum für Lehrerbildung (ZfL) der CAU.
          <br></br>
          Nun aber viel Spaß mit der digitalen Version!
        </p>
        <h2>Mitspieler*innen</h2>
        Deine Mitspieler*innen sind Computergeneriete Charaktere, die sich in
        unterschiedlichen Eigenschaften unterscheiden. Jeder Charakter hat
        Stärken und Schwächen. Wenn du im Spiel deinen Masterabschluss mit den
        meisten Punkten erreichst, hast du gewonnen und der nächste Charakter
        wird freigeschaltet. Je mehr Charaktere in einem Spiel sind, desto
        schwieriger wird das Spiel. Nicht vergessen, Glück gehört auch dazu!
      </div>
    </div>
  );
}
