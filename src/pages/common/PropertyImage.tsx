import React from "react";
import { CardPropertyType } from "../../models/PlayerData";

export function PropertyImage(pars: {
  type: CardPropertyType;
  scale: number;
  clr?: "black" | "white";
  opacity?: number;
}) {
  const originalDim = { width: 612 * pars.scale, height: 792 * pars.scale };
  const imgName = "icon_" + pars.type + ".png";
  
  let filters =
    pars.clr !== "white"
      ? {
          WebkitFilter: "invert(1)",
          filter: "invert(1)",
        }
      : {};
  return (
    <div
      style={{
        border: "0px solid black",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <img
        style={{
          padding: 0,
          margin: 0,
          border: "0px solid red",
          opacity:(pars.opacity!==undefined)?pars.opacity:1,
          ...filters,
        }}
        src={imgName}
        width={originalDim.width}
        height={originalDim.height}
        alt={pars.type}
      ></img>
    </div>
  );
}
