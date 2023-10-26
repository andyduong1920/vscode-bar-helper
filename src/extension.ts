"use strict";

import { window, ExtensionContext } from "vscode";

import * as FileCheckHelpers from "./fileCheckHelpers";
import * as Utils from "./utils";
import * as BarItems from "./editableArea/1_definition";
import { setupItemBehaviors } from "./editableArea/4_behaviors";
import * as Commands from "./editableArea/3_commands";
import { defaultShowItems } from "./editableArea/2_defaultShow";

const onUpdatePath = () => {
  const editor = window.activeTextEditor;

  if (editor === undefined) {
    Utils.hideTestItems();
  } else {
    const filePath = editor.document.fileName;

    if (FileCheckHelpers.isTestFile(filePath)) {
      Utils.showTestItems();
    } else {
      Utils.hideTestItems();
    }
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
