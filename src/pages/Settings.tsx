import { Colors } from "@blueprintjs/core";
import { TheoryGroup } from "../models/PlayerData";

export class Settings {
  static readonly FADE_TIME = 1000 / 3;
  static readonly CALLBACK_DELAY = 1000;
}

export const LilaRGB = "rgb(157,19,128)";
export const EventCardColor = Colors.RED4;
export const TheoryCardColor = Colors.BLUE1;
export const NegativeCardColor = Colors.DARK_GRAY4;

export class CommonColors {
  static groupColorToHex(groupColor: TheoryGroup): string {
    switch (groupColor) {
      case "blue": //soft blue
        return Colors.BLUE3;
      case "green":
        return Colors.GREEN4;
      case "darkgreen":
        return Colors.GREEN2;
      case "violet":
        return Colors.VIOLET3;
      case "rose":
        return Colors.ROSE3;
      case "grey":
        return Colors.GRAY2;
      case "orange":
        return Colors.ORANGE2;
      case "yellow":
        return Colors.ORANGE4;
      default:
        return "#000000";
    }
  }
}
