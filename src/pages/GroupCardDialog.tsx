import { DialogBody } from "@blueprintjs/core";
import React from "react";
import { CommonColors } from "./Settings";
import { TheoryGroup } from "../models/PlayerData";

export function GroupCardDialog(pars: { color: TheoryGroup; total: number }) {
  return (
    <>
      <DialogBody>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              width: "50px",
              height: "40px",
              borderRadius: 10,
              backgroundColor: CommonColors.groupColorToHex(pars.color),
              marginRight: 10,
            }}
          >
            {pars.total}
          </div>
          <div>
            {" "}
            Du hast insgesamt {pars.total} Theorie karten dieser Farbe (
            {pars.color}) gesammelt. Wenn du X sammelst, bekommst du mehr
            Punkte.
          </div>
        </div>
      </DialogBody>
    </>
  );
}
