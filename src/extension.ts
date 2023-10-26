"use strict";

import { window, ExtensionContext } from "vscode";

import * as FileCheckHelpers from "./fileCheckHelpers";
import * as BarItems from "./barItems/definition";
import * as Utils from "./utils";
import * as Commands from "./commands";
import { setupItemBehaviors } from "./barItems/behaviors";
import { defaultShowItems } from "./barItems/defaultShow";

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
