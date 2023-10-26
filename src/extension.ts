"use strict";

import { window, ExtensionContext } from "vscode";

import * as Utils from "./utils";
import * as BarItems from "./editableArea/1_definition";
import { defaultShowItems } from "./editableArea/2_defaultShow";
import * as Commands from "./editableArea/3_commands";
import { setupItemBehaviors } from "./editableArea/4_behaviors";
import {
  showPerFileType,
  hideAllPerFileType,
} from "./editableArea/5_customShow";

const onUpdatePath = () => {
  const editor = window.activeTextEditor;

  if (editor === undefined) {
    hideAllPerFileType();
  } else {
    showPerFileType(editor);
  }
};

export function activate(context: ExtensionContext) {
  setupItemBehaviors();
  defaultShowItems();
  onUpdatePath();

  const textEditorDisposable = window.onDidChangeActiveTextEditor(onUpdatePath);

  context.subscriptions.concat([
    textEditorDisposable,
    ...Object.values(Commands),
  ]);
}

export function deactivate() {
  Object.values(BarItems).forEach((item) => {
    item.dispose();
  });
}
