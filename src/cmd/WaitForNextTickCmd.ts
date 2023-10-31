import { TickSource } from "models/PlayerData";

export async function WaitForNextTickCmd(src?: TickSource): Promise<void> {
  const tu: TickSource = "tickUser";
  const tn: TickSource = "tickNpc";

  return new Promise((resolve, reject) => {
    const f = () => {
      if (typeof src === "undefined") {
        document.removeEventListener(tu, f);
        document.removeEventListener(tn, f);
      }
      if (src === "tickUser") {
        document.removeEventListener(tu, f);
      }
      if (src === "tickNpc") {
        document.removeEventListener(tn, f);
      }
      resolve();
    };

    if (typeof src === "undefined") {
      document.addEventListener(tu, f);
      document.addEventListener(tn, f);
    }

    if (src === "tickUser") {
      document.addEventListener(tu, f);
    }
    if (src === "tickNpc") {
      document.addEventListener(tn, f);
    }
  });
}
