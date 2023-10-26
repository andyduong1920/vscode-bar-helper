import { window } from "vscode";

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

// Adjust here to add more items
export const isTestFile = (filePath: any) => {
  return isRubyTestFile(filePath) || isElixirTestFile(filePath);
};

export const isRubyTestFile = (filePath: any) => {
  return filePath.includes("_spec.rb");
};

export const isElixirTestFile = (filePath: any) => {
  return filePath.includes("_test.exs");
};

export const isRubyFile = (filePath: any) => {
  return filePath.includes(".rb");
};

export const isElixirFile = (filePath: any) => {
  return filePath.includes(".exs") || filePath.includes(".ex");
};

export const isJSFile = (filePath: any) => {
  return filePath.includes(".js");
};
