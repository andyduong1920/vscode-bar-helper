import { window } from "vscode";

import * as BarItems from "./barItems/definition";

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

const TEST_ITEMS = [BarItems.runTestFileItem, BarItems.runTestLineItem];

export const hideTestItems = () => {
  TEST_ITEMS.forEach((item) => {
    item.hide();
  });
};

export const showTestItems = () => {
  showItems(TEST_ITEMS);
};
