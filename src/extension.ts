"use strict";

import {
  commands,
  window,
  ExtensionContext,
  StatusBarAlignment,
  workspace,
} from "vscode";

const runTestFileItem = window.createStatusBarItem(StatusBarAlignment.Left, -1);
const runTestLineItem = window.createStatusBarItem(StatusBarAlignment.Left, -2);
const runDBRemigrateItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -3
);
const runDBSeedItem = window.createStatusBarItem(StatusBarAlignment.Left, -4);
const startInteractiveConsoleItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -5
);
const startWebServerItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -6
);

// Adjust here to add more items
const TEST_ITEMS = [runTestFileItem, runTestLineItem];
const BAR_ITEMS = [
  runDBRemigrateItem,
  runDBSeedItem,
  startInteractiveConsoleItem,
  startWebServerItem,
  ...TEST_ITEMS,
];

const sendToTerminal = (thisText: any) => {
  let terminal = undefined;

  if (window.activeTerminal) {
    terminal = window.activeTerminal;
  } else {
    terminal = window.createTerminal("Test Runner");
  }

  terminal.show();

  terminal.sendText(thisText);
};

// Adjust here to add more items
const isTestFile = (filePath: any) => {
  return isRubyTestFile(filePath) || isElixirTestFile(filePath);
};

const isRubyTestFile = (filePath: any) => {
  return filePath.includes("_spec.rb");
};

const isElixirTestFile = (filePath: any) => {
  return filePath.includes("_test.exs");
};

const onUpdatePath = () => {
  const editor = window.activeTextEditor;

  if (editor === undefined) {
    hideTestItems();
  } else {
    const filePath = editor.document.fileName;

    if (isTestFile(filePath)) {
      showTestItems();
    } else {
      hideTestItems();
    }
  }
};

const hideTestItems = () => {
  TEST_ITEMS.forEach((item) => {
    item.hide();
  });
};

const showTestItems = () => {
  showItems(TEST_ITEMS);
};

const showItems = (items: any) => {
  items.forEach((item: any) => {
    item.show();
  });
};

const setupItem = (
  item: any,
  thisText: any,
  thisTooltip: any,
  thisCommand: any
) => {
  item.text = thisText;
  item.tooltip = thisTooltip;
  item.command = thisCommand;
};

export function activate(context: ExtensionContext) {
  // Adjust here to add more items
  setupItem(
    runTestFileItem,
    "🚀 test:FILE (⌃a) 🚀",
    "Click to run the current test file.",
    "barHelper.runTestFile"
  );
  setupItem(
    runTestLineItem,
    "1️⃣ test:LINE (⌃z) 1️⃣",
    "Click to run the current test line.",
    "barHelper.runTestLine"
  );
  setupItem(
    runDBRemigrateItem,
    "🔧 db:REMIGRATION 🔧",
    "Click to run db:drop db:create db:migrate.",
    "barHelper.runDBRemigrate"
  );
  setupItem(
    runDBSeedItem,
    "🌱 db:SEED 🌱",
    "Click to run db:seed.",
    "barHelper.runDBSeed"
  );
  setupItem(
    startInteractiveConsoleItem,
    "⛑️ console:START ⛑️",
    "Click to start the interactive console.",
    "barHelper.startInteractiveConsole"
  );
  setupItem(
    startWebServerItem,
    "🚁 server:START 🚁",
    "Click to start the web server.",
    "barHelper.startWebServer"
  );

  showItems([
    runDBRemigrateItem,
    runDBSeedItem,
    startInteractiveConsoleItem,
    startWebServerItem,
  ]);

  const runTestFileCommand = commands.registerCommand(
    "barHelper.runTestFile",
    () => {
      const editor = window.activeTextEditor;

      if (editor === undefined) {
        return;
      } else {
        const filePath = editor.document.fileName;
        const relativePath = workspace.asRelativePath(filePath, false);

        if (isRubyTestFile(filePath)) {
          sendToTerminal(`bundle exec rspec ${relativePath}`);
        } else if (isElixirTestFile(filePath)) {
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

        if (isRubyTestFile(filePath)) {
          sendToTerminal(`bundle exec rspec ${relativePath}:${lineNumber}`);
        } else if (isElixirTestFile(filePath)) {
          sendToTerminal(`mix test ${relativePath}:${lineNumber}`);
        }
      }
    }
  );

  const runDBRemigrateCommand = commands.registerCommand(
    "barHelper.runDBRemigrate",
    () => {
      // TODO: Support Elixir
      sendToTerminal("bundle exec rails db:drop db:create db:migrate");
    }
  );

  const runDBSeedCommand = commands.registerCommand(
    "barHelper.runDBSeed",
    () => {
      // TODO: Support Elixir
      sendToTerminal("bundle exec rails db:seed");
    }
  );

  const startInteractiveConsoleCommand = commands.registerCommand(
    "barHelper.startInteractiveConsole",
    () => {
      // TODO: Support Elixir
      sendToTerminal("bundle exec rails console");
    }
  );

  const startWebServerCommand = commands.registerCommand(
    "barHelper.startWebServer",
    () => {
      // TODO: Support Elixir
      sendToTerminal("foreman start -f Procfile.dev");
    }
  );

  onUpdatePath();

  const textEditorDisposable = window.onDidChangeActiveTextEditor(onUpdatePath);

  // Adjust here to add more items
  context.subscriptions.concat([
    textEditorDisposable,
    runTestFileCommand,
    runTestLineCommand,
    runDBRemigrateCommand,
    runDBSeedCommand,
    startInteractiveConsoleCommand,
    startWebServerCommand,
  ]);
}

export function deactivate() {
  BAR_ITEMS.forEach((item) => {
    item.dispose();
  });
}
