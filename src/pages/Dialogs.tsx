import { Dialog } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import React from "react";
import { SelectCardsDialog } from "./SelectCardsDialog";
import { GroupCardDialog } from "./GroupCardDialog";
import {InstructionsDialog} from "./InstructionsDialog";

export function Dialogs() {
  const [dialogData, setDialogData] = useState<
    { dialog: string; data: any } | undefined
  >();

  const setDialogDataByEvent = (e: Event, dialog: string) => {
    const ce = e as CustomEvent;
    setDialogData({
      dialog: dialog,
      data: ce.detail.data,
    });
  };

  useEffect(() => {
    const onInstructionsDialog= (e: Event) => setDialogDataByEvent(e, "InstructionsDialog");
    const onSelectGroupCardsDialog = (e: Event) => setDialogDataByEvent(e, "GroupCardDialog");
    const onSelectCardsDialog = (e: Event) => setDialogDataByEvent(e, "SelectCardsDialog");
    const confirm = setDialogData.bind(null, undefined);
    document.addEventListener("InstructionsDialog", onInstructionsDialog);
    document.addEventListener("GroupCardDialog", onSelectGroupCardsDialog);
    document.addEventListener("SelectCardsDialog", onSelectCardsDialog);
    document.addEventListener("confirm", confirm);
    return () => {
      document.removeEventListener("InstructionsDialog", onInstructionsDialog);
      document.removeEventListener("GroupCardDialog", onSelectGroupCardsDialog);
      document.removeEventListener("SelectCardsDialog", onSelectCardsDialog);
      document.addEventListener("confirm", confirm);
    };
  }, []);

  const onClickClose = () => {
    setDialogData(undefined);
    document.dispatchEvent(new Event("close"));
  };

  return (
    <Dialog
      canOutsideClickClose
      onClose={onClickClose}
      isOpen={dialogData ? true : false}
      title="Information"
      icon="info-sign"
    >
      {dialogData?.dialog === "InstructionsDialog" && (
        <InstructionsDialog />
      )}
      {dialogData?.dialog === "SelectCardsDialog" && (
        <SelectCardsDialog card={dialogData?.data.card} />
      )}

      {dialogData?.dialog === "GroupCardDialog" && (
        <GroupCardDialog
          total={dialogData?.data.total}
          color={dialogData?.data.color}
        />
      )}
    </Dialog>
  );
}
