import { window } from "vscode";

import * as Items from "./items";

export const sendToTerminal = (thisText: string) => {
  let terminal = undefined;

  if (window.activeTerminal) {
    terminal = window.activeTerminal;
  } else {
    terminal = window.createTerminal("Bar Helper");
  }

  terminal.show();

  terminal.sendText(thisText);
};

export const showItems = (items: any) => {
  items.forEach((item: any) => {
    item.show();
  });
};

export const setupItem = (
  item: any,
  thisText: any,
  thisTooltip: any,
  thisCommand: any
) => {
  item.text = thisText;
  item.tooltip = thisTooltip;
  item.command = thisCommand;
};

export const hideTestItems = () => {
  Items.TEST_ITEMS.forEach((item) => {
    item.hide();
  });
};

export const showTestItems = () => {
  showItems(Items.TEST_ITEMS);
};
