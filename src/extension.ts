"use strict";

import { relative } from "path";
import { commands, window, ExtensionContext, StatusBarAlignment, workspace } from "vscode";

const runTestFileItem = window.createStatusBarItem(StatusBarAlignment.Left, -1);
const runTestLineItem = window.createStatusBarItem(StatusBarAlignment.Left, -2);

// Adjust here to add more items
const ITEMS = [
  runTestFileItem,
  runTestLineItem
]

const sendToTerminal = (thisText:any) => {
  let terminal = undefined;

  if (window.activeTerminal) {
    terminal = window.activeTerminal;
  } else {
    terminal = window.createTerminal('Test Runner');
  }

  terminal.show();

  terminal.sendText(thisText);
};

// Adjust here to add more items
const isTestFile = (filePath:any) => {
  return isRubyTestFile(filePath) || isElixirTestFile(filePath);
};

const isRubyTestFile = (filePath:any) => {
  return filePath.includes("_spec.rb");
};

const isElixirTestFile = (filePath:any) => {
  return filePath.includes("_test.exs");
};

const onUpdatePath = () => {
  const editor = window.activeTextEditor;

  if (editor === undefined) {
    hideItems();
  } else {
    const filePath = editor.document.fileName;

    if (isTestFile(filePath)) {
      showItems();
    } else {
      hideItems();
    }
  }
};

const hideItems = () => {
  ITEMS.forEach((item) => {
    item.hide();
  });
};

const showItems = () => {
  ITEMS.forEach((item) => {
    item.show();
  });
};

const setupItem = (item:any, thisText:any, thisTooltip:any, thisCommand:any) => {
  item.text = thisText;
  item.tooltip = thisTooltip;
  item.command = thisCommand;
};

export function activate(context: ExtensionContext) {
  // Adjust here to add more items
  setupItem(runTestFileItem, "🚀 Test FILE (⌃a) 🚀", "Click to run the current test file.", "barHelper.runTestFile");
  setupItem(runTestLineItem, "1️⃣ Test LINE (⌃z) 1️⃣", "Click to run the current test line.", "barHelper.runTestLine");

  const runTestFileCommand = commands.registerCommand(
    "barHelper.runTestFile",
    () => {
      const editor = window.activeTextEditor;

      if (editor === undefined) {
        return;
      } else {
        const filePath = editor.document.fileName;
        const relativePath = workspace.asRelativePath(filePath, false);

        if(isRubyTestFile(filePath)) {
          sendToTerminal(`bundle exec rspec ${relativePath}`);
        } else if(isElixirTestFile(filePath)) {
          sendToTerminal(`mix test ${relativePath}`);
        }
      }
    }
  );

  const runTestLineCommand = commands.registerCommand(
    "barHelper.runTestLine",
    () => {
      const editor = window.activeTextEditor;

      if (editor === undefined) {
        return;
      } else {
        const filePath = editor.document.fileName;
        const relativePath = workspace.asRelativePath(filePath, false);
        const lineNumber = editor.selection.active.line + 1;

        if(isRubyTestFile(filePath)) {
          sendToTerminal(`bundle exec rspec ${relativePath}:${lineNumber}`);
        } else if(isElixirTestFile(filePath)) {
          sendToTerminal(`mix test ${relativePath}:${lineNumber}`);
        }
      }
    }
  );

  onUpdatePath();

  const textEditorDisposable = window.onDidChangeActiveTextEditor(onUpdatePath);

  // Adjust here to add more items
  context.subscriptions.concat([
    textEditorDisposable,
    runTestFileCommand,
    runTestLineCommand
  ]);
}

export function deactivate() {
  ITEMS.forEach((item) => {
    item.dispose();
  });
}
