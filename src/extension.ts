"use strict";

import {
  commands,
  window,
  ExtensionContext,
  StatusBarAlignment,
  workspace,
} from "vscode";

import * as Helpers from "./helpers";

const runTestFileItem = window.createStatusBarItem(StatusBarAlignment.Left, -1);
const runTestLineItem = window.createStatusBarItem(StatusBarAlignment.Left, -2);
const formatCodeFileItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -3
);
const runDBMigrateItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -4
);
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
const gitFetchItem = window.createStatusBarItem(StatusBarAlignment.Left, -9);
const gitPushItem = window.createStatusBarItem(StatusBarAlignment.Left, -10);

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
  startInteractiveConsoleItem,
  startWebServerItem,
  formatCodeFileItem,
  gitPushItem,
  gitFetchItem,
  gitRebaseContinueItem,
  gitRebaseSkipItem,
  ...TEST_ITEMS,
];

const onUpdatePath = () => {
  const editor = window.activeTextEditor;

  if (editor === undefined) {
    hideTestItems();
    formatCodeFileItem.hide();
  } else {
    const filePath = editor.document.fileName;

    // Always show the format item on any file
    formatCodeFileItem.show();

    if (Helpers.isTestFile(filePath)) {
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
  setupItem(runTestFileItem, "🔥⌃a", "Test file", "barHelper.runTestFile");
  setupItem(runTestLineItem, "1️⃣ ⌃z", "Test line", "barHelper.runTestLine");
  setupItem(
    runDBRemigrateItem,
    "⭕ reMIGRATION",
    "db:drop db:create db:migrate && db:seed",
    "barHelper.runDBRemigrate"
  );
  setupItem(
    startInteractiveConsoleItem,
    "⛑️⌃i",
    "Start the interactive console",
    "barHelper.startInteractiveConsole"
  );
  setupItem(
    startWebServerItem,
    "🚁⌃s",
    "Start the web server",
    "barHelper.startWebServer"
  );
  setupItem(
    formatCodeFileItem,
    "🎨 ⌃f",
    "format the file",
    "barHelper.formatCodeFile"
  );
  setupItem(runDBMigrateItem, "⬆️ ⌃m", "db:migrate", "barHelper.runDBMigrate");
  setupItem(gitPushItem, "🚀⌃u", "git push --force", "barHelper.runGitPush");
  setupItem(gitFetchItem, "⏬ FETCH", "git fetch.", "git.fetch");
  setupItem(
    gitRebaseContinueItem,
    "🏃 rebase:CONTINUE",
    "git add . && git rebase --continue.",
    "barHelper.runGitRebaseContinue"
  );
  setupItem(
    gitRebaseSkipItem,
    "👋 rebase:SKIP",
    "git rebase --skip.",
    "barHelper.runGitRebaseSkip"
  );

  showItems([
    runDBRemigrateItem,
    runDBMigrateItem,
    startInteractiveConsoleItem,
    startWebServerItem,
    gitPushItem,
    gitFetchItem,
    gitRebaseContinueItem,
    gitRebaseSkipItem,
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

        if (Helpers.isRubyTestFile(filePath)) {
          Helpers.sendToTerminal(`bundle exec rspec ${relativePath}`);
        } else if (Helpers.isElixirTestFile(filePath)) {
          Helpers.sendToTerminal(`mix test ${relativePath}`);
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

        if (Helpers.isRubyTestFile(filePath)) {
          Helpers.sendToTerminal(
            `bundle exec rspec ${relativePath}:${lineNumber}`
          );
        } else if (Helpers.isElixirTestFile(filePath)) {
          Helpers.sendToTerminal(`mix test ${relativePath}:${lineNumber}`);
        }
      }
    }
  );

  const runDBRemigrateCommand = commands.registerCommand(
    "barHelper.runDBRemigrate",
    () => {
      // TODO: Support Elixir
      Helpers.sendToTerminal(
        "bin/rails db:environment:set RAILS_ENV=development && bin/rails db:drop db:setup"
      );
    }
  );

  const runDBMigrateCommand = commands.registerCommand(
    "barHelper.runDBMigrate",
    () => {
      // TODO: Support Elixir
      Helpers.sendToTerminal("bundle exec rails db:migrate");
    }
  );

  const startInteractiveConsoleCommand = commands.registerCommand(
    "barHelper.startInteractiveConsole",
    () => {
      // TODO: Support Elixir
      Helpers.sendToTerminal("bundle exec rails console");
    }
  );

  const startWebServerCommand = commands.registerCommand(
    "barHelper.startWebServer",
    () => {
      // TODO: Support Elixir
      Helpers.sendToTerminal("foreman start -f Procfile.dev");
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

        if (Helpers.isRubyFile(filePath)) {
          Helpers.sendToTerminal(`bundle exec rubocop -a ${relativePath}`);
        } else if (Helpers.isElixirFile(filePath)) {
          Helpers.sendToTerminal(`mix format ${relativePath}`);
        } else if (Helpers.isJSFile(filePath)) {
          // TODO: Support npm
          Helpers.sendToTerminal(`yarn eslint --color --fix ${relativePath}`);
        }
      }
    }
  );

  const runGitPushCommand = commands.registerCommand(
    "barHelper.runGitPush",
    () => {
      Helpers.sendToTerminal("ggpush -f");
    }
  );

  const runGitRebaseContinueCommand = commands.registerCommand(
    "barHelper.runGitRebaseContinue",
    () => {
      Helpers.sendToTerminal("ga . && g rebase --continue");
    }
  );

  const runGitRebaseSkipCommand = commands.registerCommand(
    "barHelper.runGitRebaseSkip",
    () => {
      Helpers.sendToTerminal("g rebase --skip");
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
