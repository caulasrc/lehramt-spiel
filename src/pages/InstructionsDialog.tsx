import { DialogBody } from "@blueprintjs/core";
import React from "react";

export function InstructionsDialog() {
  const body = (
    <div>
      <h3>Spielverlauf</h3>
      Beim digitalen Caula-Spiel suchst Du Dir zu Beginn einen bis
      fünf Charaktere aus, gegen die Du das Spiel spielen möchtest. 
      <br/>
      Zum Spielbeginn ist nicht klar, ob alle von Euch oder nur Einzelne das Studium
      schaffen werden. Sammle daher im Verlauf des Spiels genug Wissen,
      Motivation, Erfahrung und Empowerment, um die vier Meilensteine Deines
      Studiums (Schulpraktikum, Bachelorabschluss, Praxissemester und die
      Masterarbeit) erfolgreich zu bestehen. 
      <br/>
      Anders als im echten Leben beginnst
      Du aus Fairnessgründen in allen Kategorien beim Wert 0. Bis zum ersten
      Schulpraktikum benötigst Du 3x Wissen, 5x Motivation, 1x Erfahrung und 1x
      Empowerment. 
      <br></br>
      Zu Beginn erhältst Du vier Karten. Dank der Symbole auf den
      Karten hast Du einen Überblick, wie viele Punkte Dir die jeweilige Karte
      in diesen vier Bereichen ermöglicht. Aber Achtung, Du kannst nicht alles
      gleichzeitig erlernen oder nicht gleichzeitig an verschiedenen Events
      teilnehmen. Drehe daher einige Karten um und verwende diese als Zeitkarte.
      Denn das Ausspielen aller Karten ist mit „Zeitkosten“ verbunden“. Diese
      „Zeitkosten“ sind durch ein Uhren-Symbol auf der Karte unten rechts
      dargestellt. Zum Beispiel „kostet“ das Ausspielen der Karte
      „Sitzungsmoderation“ 2 Zeitpunkte und sie kann nur gespielt werden, indem
      man zusätzlich zwei weitere Karten umdreht. Es gibt Einzelereignisse und
      Gruppenereignisse. Auch Deine virtuellen Mitspieler*innen können Dich
      beispielsweise zu einem Gruppenereignis einladen. Beachte daher immer den
      Spielverlauf Deiner Mitspieler*innen im Chat und habe Deinen Zeitvorrat
      gut im Blick. 
      <br/>
      Hat man ein Negativereignis auf der Hand (z.B. der Zweifel),
      muss die Karte gespielt werden. 
      <br/>
      Der Zug endet, wenn Du keine weiteren Karten mehr ausspielen kannst oder möchtest. 
      <br/>
      Nachdem der/die Erste den Master abgeschlossen hat, wird noch eine Runde gespielt. 
      Wer dann den Master und die höchste Gesamtsumme aller Werte hat, gewinnt das Spiel.
    </div>
  );
  return (
    <>
      <DialogBody>
        {body}
      </DialogBody>
    </>
  );
}
