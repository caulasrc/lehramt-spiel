import { useEffect, useState } from "react";
import { IntroPage } from "./pages/IntroPage";
import { Dialogs } from "./pages/Dialogs";
import {
  Button,
  Colors,
  Divider,
  OverlayToaster,
  Toaster,
} from "@blueprintjs/core";
import GamePage from "./pages/GamePage";
import React from "react";
import { GameOverPage } from "./pages/GameOverPage";
//import { DebugBar } from "./pages/DebugBar";
import { LilaRGB, Settings } from "./pages/Settings";
import { Fade } from "react-awesome-reveal";
import "./i18n";
import { GameSpeedButton } from "./pages/GameSpeedButton";

type AppLocation = "intro" | "game" | "gameover";

//surpass warning
const myToaster: Toaster = OverlayToaster.create({
  className: "recipe-toaster",
  position: "top",
});

export default function App() {
  const [location, setLocation] = useState<AppLocation>("intro");

  useEffect(() => {
    const onGoto = (e: Event) => {
      const ce = e as CustomEvent;
      setLocation(ce.detail as AppLocation);
    };
    const onAlert = (e: Event) => {
      const ce = e as CustomEvent;
      myToaster.show({ message: ce.detail, intent: "warning", icon: "time" });
    };
    document.addEventListener("goto", onGoto);
    document.addEventListener("alert", onAlert);

    return () => {
      document.removeEventListener("goto", onGoto);
      document.removeEventListener("alert", onAlert);
    };
  });

  const onClickRestart = () => {
    setLocation("intro");
  };

  const onClickCaula = () => {
    window.location.href = "https://www.gute-lehre-lehramt.uni-kiel.de/caula/";
  };

  const bgSize = { w: 1150, h: 690 };
  const whiteBorder = 0;

  const onClickInstructions = () => {
    document.dispatchEvent(
      new CustomEvent("InstructionsDialog", { detail: {} })
    );
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor: Colors.LIGHT_GRAY5,
        width: "100%",
        height: "100%",
        position: "absolute",
        display: "block",
      }}
    >
      <Dialogs />
      <div
        style={{
          display: "flex",
          padding: 10,
          height: "120px",
          backgroundColor: LilaRGB,
          justifyContent: "center",
        }}
      >
        <img
          alt=""
          src="./caula.png"
          style={{ width: "auto", height: "100%" }}
        ></img>
      </div>
      <Fade key={location} duration={Settings.FADE_TIME * 2}>
        <div
          style={{
            display: "block",
            boxShadow: "0px 0px 100px 0px rgba(0,0,0,0.2)",
            borderRadius: 36,
            margin: 10,
            padding: 10,

            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "20px",
            width: bgSize.w + whiteBorder * 2,
            height: bgSize.h + whiteBorder * 2,
            backgroundRepeat: "no-repeat",
            backgroundPositionX: whiteBorder,
            backgroundPositionY: whiteBorder,
            backgroundSize: bgSize.w + "px " + bgSize.h + "px",
          }}
        >
          <div
            className="mainBg"
            style={{
              border: "4px solid " + LilaRGB,
              borderRadius: 30,
              height: "100%",
              padding: 10,
            }}
          >
            {location === "intro" && <IntroPage />}
            {location === "game" && <GamePage />}
            {location === "gameover" && <GameOverPage />}
          </div>
        </div>
      </Fade>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          marginTop: 20,
          width: "100%",
        }}
      >
        {location !== "intro" && (
          <Button
            style={{ display: "block" }}
            onClick={onClickInstructions}
            minimal
            small
            icon="info-sign"
          >
            Spielverlauf
          </Button>
        )}

        {location !== "intro" && (
          <Button onClick={onClickRestart} minimal small icon="refresh">
            Neu starten
          </Button>
        )}
        {location === "game" && <GameSpeedButton></GameSpeedButton>}
        <Button
          style={{ display: location !== "intro" ? "none" : "block" }}
          onClick={onClickCaula}
          minimal
          small
          icon="circle-arrow-left"
        >
          CAULA Website
        </Button>
      </div>
      <div style={{ height: 10 }}></div>

      <div style={{ height: 10 }}></div>
      <Divider></Divider>
      <div
        style={{
          display: "flex",
          width: 800,
          textAlign: "center",
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: 13,
          color: Colors.GRAY1,
        }}
      >
        <div style={{ margin: 10 }}>
          LeaP@CAU wird im Rahmen der gemeinsamen „Qualitätsoffensive
          Lehrerbildung“ von Bund und Ländern aus Mitteln des Bundesministeriums
          für Bildung und Forschung gefördert.
          <br></br>
          <div style={{ display: "flex",justifyContent:"center" }}>
            <a href="https://www.gute-lehre-lehramt.uni-kiel.de/impressum">
              Impressum 
            </a>

            <Divider />

            <a rel="noreferrer" target="_blank" href="https://badmonkee.de">
              Bad Monkee GmbH (Entwickler)
            </a>
            <Divider />
            <a rel="noreferrer"
              target="_blank"
              href="https://github.com/caulasrc/lehramt-spiel.git"
            >
              GitHub (Code)
            </a>
          </div>
        </div>
        <div style={{ margin: 10 }}>
          <img src="cau-norm-en-blackwhite-rgb.svg" width={200} alt=""></img>
          <br></br>
        </div>
      </div>
      <div style={{ height: 20 }}></div>

      <div style={{ height: 20 }}></div>
    </div>
  );
}
