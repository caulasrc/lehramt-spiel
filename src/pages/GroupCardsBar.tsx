import React, { useEffect, useState } from "react";
import { PlayerModel } from "../models/PlayerModel";
import { CardData, PlayerData, TheoryGroup } from "../models/PlayerData";
import { GameModel } from "../models/GameModel";
import { Button, Classes, Divider, Popover } from "@blueprintjs/core";
import { CommonColors } from "./Settings";
import { t } from "i18next";
import { PropertyImage } from "./common/PropertyImage";

let divIndex = 0;

export function GroupCardsBar() {
  const [user, setUser] = useState<PlayerData>(PlayerModel.instance.getUser());

  useEffect(() => {
    const eventName = GameModel.instance.events.stackChanged;
    const listener = (e: Event) => {
      const cd = e as CustomEvent;
      const pd = cd.detail as PlayerData;
      if (pd.isNpc) {
        return;
      }
      setUser({ ...pd });
    };
    document.addEventListener(eventName, listener);
    return () => {
      document.removeEventListener(eventName, listener);
    };
  }, []);

  const group2Cards = new Map<string, CardData[]>();
  user.stack.forEach((c) => {
    if (c.type === "theory" && c.group) {
      if (!group2Cards.has(c.group)) {
        group2Cards.set(c.group, []);
      }
      group2Cards.get(c.group)!.push(c);
    }
  });

  if (group2Cards.size === 0) {
    return <div></div>;
  }

  return (
    <div
      style={{
        justifyContent: "center",
        display: "flex",
        border: "0px solid black",
        marginLeft: 5,
        marginRight: 5,
        height: "35px",
      }}
    >
      {Array.from(group2Cards.keys()).map((k) => {
        const cards = group2Cards.get(k)!;
        const color = cards[0].group!;
        return SingleGroupElement({ color, total: cards.length });
      })}
    </div>
  );
}

function SingleGroupElement(pars: { color: TheoryGroup; total: number }) {
  const title = t("theories." + pars.color + "");
  const desc = t("theories." + pars.color + "_desc");
  const clr = CommonColors.groupColorToHex(pars.color);

  return (
    <Popover
      key={divIndex++}
      interactionKind="click"
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      placement="top"
      content={
        <div>
          <h4
            id="singular"
            style={{ display: pars.total === 1 ? "block" : "none" }}
          >
            <b style={{ color: clr }}>&#9679;</b> {title}: {pars.total} Karte
          </h4>
          <h4
            id="plural"
            style={{ display: pars.total > 1 ? "block" : "none" }}
          >
            <b style={{ color: clr }}>&#9679;</b> {title}: {pars.total} Karten
          </h4>

          <div>{desc}</div>
          <Divider></Divider>

          <p style={{ display: pars.total === 1 ? "block" : "none" }}>
            Du hast eine Theorie der Gruppe <i>'{title}'</i> erlernt.<br></br>{" "}
            Wenn du eine weitere Karte dieser Farbe ausspielst, bekommst du
            zusätzlich <b>1 Wissen.</b>
          </p>
          <p style={{ display: pars.total > 1 ? "block" : "none" }}>
            Du hast mehrere Theorien der Gruppe <i>'{title}'</i> erlernt.
            <br></br> Wenn du eine weitere Karte dieser Farbe ausspielst,
            bekommst du zusätzlich <b>1 Wissen</b> und <b>1 Motivation</b>.
          </p>
        </div>
      }
      renderTarget={({ isOpen, ...targetProps }) => (
        <ButtonElement
          color={pars.color}
          total={pars.total}
          targetProps={targetProps}
        />
      )}
    />
  );
}

function ButtonElement(pars: {
  color: TheoryGroup;
  total: number;
  targetProps: any;
}) {
  const color = pars.color;
  const total = pars.total;
  const title = t("theories." + color + "");
  return (
    <Button
      {...pars.targetProps}
      title={title}
      key={color}
      style={{
        borderRadius: 5,
        margin: 0,
        padding: 0,
        marginRight: 5,
        border: "2px solid" + CommonColors.groupColorToHex(color),
      }}
    >
      <div style={{ display: "flex", margin: 2 }}>
        <div
          style={{
            display: "block",
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: 2,
            marginRight: 2,
            border: "0px solid black",
          }}
        >
          <div
            className="line2ellipsis"
            style={{ fontSize: 12, maxWidth: 100 }}
          >
            {title}
          </div>
        </div>
        <div style={{ marginRight: 2, display: "block" }}>
          {total > 1 && (
            <PropertyImage
              clr="black"
              type="motivation"
              scale={0.016}
            ></PropertyImage>
          )}
          {total > 0 && (
            <PropertyImage
              clr="black"
              type="knowledge"
              scale={0.02}
            ></PropertyImage>
          )}
        </div>
      </div>
    </Button>
  );
}

/*h2 {
  display: -webkit-box;
  max-width: 400px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}*/
