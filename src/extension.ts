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
const formatCodeFileItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -3
);
const runDBMigrateItem = window.createStatusBarItem(StatusBarAlignment.Left, -4);
const startInteractiveConsoleItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -5
);
const startWebServerItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -6
);
const runDBRemigrateItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -7
);
const runDBSeedItem = window.createStatusBarItem(StatusBarAlignment.Left, -8);
const gitFetchItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -9
);
const gitPushItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -10
);

// Right side
const gitRebaseSkipItem = window.createStatusBarItem(
  StatusBarAlignment.Right,
  1
);
const gitRebaseContinueItem = window.createStatusBarItem(
  StatusBarAlignment.Right,
  2
);

// Adjust here to add more items
const TEST_ITEMS = [runTestFileItem, runTestLineItem];
const BAR_ITEMS = [
  runDBRemigrateItem,
  runDBMigrateItem,
  runDBSeedItem,
  startInteractiveConsoleItem,
  startWebServerItem,
  formatCodeFileItem,
  gitPushItem,
  gitFetchItem,
  gitRebaseContinueItem,
  gitRebaseSkipItem,
  ...TEST_ITEMS,
];

const sendToTerminal = (thisText: string) => {
  let terminal = undefined;

  if (window.activeTerminal) {
    terminal = window.activeTerminal;
  } else {
    terminal = window.createTerminal("Bar Helper");
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

const isRubyFile = (filePath: any) => {
  return filePath.includes(".rb");
};

const isElixirFile = (filePath: any) => {
  return filePath.includes(".exs") || filePath.includes(".ex");
};

const isJSFile = (filePath: any) => {
  return filePath.includes(".js");
};

const onUpdatePath = () => {
  const editor = window.activeTextEditor;

  if (editor === undefined) {
    hideTestItems();
    formatCodeFileItem.hide();
  } else {
    const filePath = editor.document.fileName;

    // Always show the format item on any file
    formatCodeFileItem.show();

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
    "🔥⌃a",
    "Test file",
    "barHelper.runTestFile"
  );
  setupItem(
    runTestLineItem,
    "1️⃣ ⌃z",
    "Test line",
    "barHelper.runTestLine"
  );
  setupItem(
    runDBRemigrateItem,
    "⭕ reMIGRATION",
    "db:drop db:create db:migrate.",
    "barHelper.runDBRemigrate"
  );
  setupItem(
    runDBSeedItem,
    "🌱 SEED",
    "db:seed.",
    "barHelper.runDBSeed"
  );
  setupItem(
    startInteractiveConsoleItem,
    "⛑️⌃i",
    "Click to start the interactive console.",
    "barHelper.startInteractiveConsole"
  );
  setupItem(
    startWebServerItem,
    "🚁⌃s",
    "Click to start the web server.",
    "barHelper.startWebServer"
  );
  setupItem(
    formatCodeFileItem,
    "🎨 ⌃f",
    "format",
    "barHelper.formatCodeFile"
  );
  setupItem(
    runDBMigrateItem,
    "⬆️ ⌃m",
    "db:migrate.",
    "barHelper.runDBMigrate"
  );
  setupItem(
    gitPushItem,
    "🚀⌃u",
    "g push --force",
    "barHelper.runGitPush"
  );
  setupItem(
    gitFetchItem,
    "⏬ FETCH",
    "g fetch.",
    "git.fetch"
  );
  setupItem(
    gitRebaseContinueItem,
    "🏃 rebase:CONTINUE",
    "g add . && g rebase --continue.",
    "barHelper.runGitRebaseContinue"
  );
  setupItem(
    gitRebaseSkipItem,
    "👋 rebase:SKIP",
    "g rebase --skip.",
    "barHelper.runGitRebaseSkip"
  );

  showItems([
    runDBRemigrateItem,
    runDBMigrateItem,
    runDBSeedItem,
    startInteractiveConsoleItem,
    startWebServerItem,
    gitPushItem,
    gitFetchItem,
    gitRebaseContinueItem,
    gitRebaseSkipItem
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

  const runDBMigrateCommand = commands.registerCommand(
    "barHelper.runDBMigrate",
    () => {
      // TODO: Support Elixir
      sendToTerminal("bundle exec rails db:migrate");
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

  const formatCodeFileCommand = commands.registerCommand(
    "barHelper.formatCodeFile",
    () => {
      const editor = window.activeTextEditor;

      if (editor === undefined) {
        return;
      } else {
        const filePath = editor.document.fileName;
        const relativePath = workspace.asRelativePath(filePath, false);

        if (isRubyFile(filePath)) {
          sendToTerminal(`bundle exec rubocop -a ${relativePath}`);
        } else if (isElixirFile(filePath)) {
          sendToTerminal(`mix format ${relativePath}`);
        } else if (isJSFile(filePath)) {
          // TODO: Support npm
          sendToTerminal(`yarn eslint . --color --fix ${relativePath}`);
        }
      }
    }
  );

  const runGitPushCommand = commands.registerCommand(
    "barHelper.runGitPush",
    () => {
      sendToTerminal("ggpush -f");
    }
  );

  const runGitRebaseContinueCommand = commands.registerCommand(
    "barHelper.runGitRebaseContinue",
    () => {
      sendToTerminal("ga . && g rebase --continue");
    }
  );

  const runGitRebaseSkipCommand = commands.registerCommand(
    "barHelper.runGitRebaseSkip",
    () => {
      sendToTerminal("g rebase --skip");
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
    runDBMigrateCommand,
    runDBSeedCommand,
    startInteractiveConsoleCommand,
    startWebServerCommand,
    formatCodeFileCommand,
    runGitPushCommand,
    runGitRebaseContinueCommand,
    runGitRebaseSkipCommand,
  ]);
}

export function deactivate() {
  BAR_ITEMS.forEach((item) => {
    item.dispose();
  });
}
