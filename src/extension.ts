"use strict";

import { commands, window, ExtensionContext, workspace } from "vscode";

import * as Helpers from "./helpers";
import * as Items from "./items";

const onUpdatePath = () => {
  const editor = window.activeTextEditor;

  if (editor === undefined) {
    hideTestItems();
    Items.formatCodeFileItem.hide();
  } else {
    const filePath = editor.document.fileName;

    // Always show the format item on any file
    Items.formatCodeFileItem.show();

    if (Helpers.isTestFile(filePath)) {
      showTestItems();
    } else {
      hideTestItems();
    }
  }
};

const hideTestItems = () => {
  Items.TEST_ITEMS.forEach((item) => {
    item.hide();
  });
};

const showTestItems = () => {
  Helpers.showItems(Items.TEST_ITEMS);
};

export function activate(context: ExtensionContext) {
  // Adjust here to add more items
  Helpers.setupItem(
    Items.runTestFileItem,
    "🔥⌃a",
    "Test file",
    "barHelper.runTestFile"
  );
  Helpers.setupItem(
    Items.runTestLineItem,
    "1️⃣ ⌃z",
    "Test line",
    "barHelper.runTestLine"
  );
  Helpers.setupItem(
    Items.runDBRemigrateItem,
    "⭕ reMIGRATION",
    "db:drop db:create db:migrate && db:seed",
    "barHelper.runDBRemigrate"
  );
  Helpers.setupItem(
    Items.startInteractiveConsoleItem,
    "⛑️⌃i",
    "Start the interactive console",
    "barHelper.startInteractiveConsole"
  );
  Helpers.setupItem(
    Items.startWebServerItem,
    "🚁⌃s",
    "Start the web server",
    "barHelper.startWebServer"
  );
  Helpers.setupItem(
    Items.formatCodeFileItem,
    "🎨 ⌃f",
    "format the file",
    "barHelper.formatCodeFile"
  );
  Helpers.setupItem(
    Items.runDBMigrateItem,
    "⬆️ ⌃m",
    "db:migrate",
    "barHelper.runDBMigrate"
  );
  Helpers.setupItem(
    Items.gitPushItem,
    "🚀⌃u",
    "git push --force",
    "barHelper.runGitPush"
  );
  Helpers.setupItem(Items.gitFetchItem, "⏬ FETCH", "git fetch.", "git.fetch");
  Helpers.setupItem(
    Items.gitRebaseContinueItem,
    "🏃 rebase:CONTINUE",
    "git add . && git rebase --continue.",
    "barHelper.runGitRebaseContinue"
  );
  Helpers.setupItem(
    Items.gitRebaseSkipItem,
    "👋 rebase:SKIP",
    "git rebase --skip.",
    "barHelper.runGitRebaseSkip"
  );

  Helpers.showItems([
    Items.runDBRemigrateItem,
    Items.runDBMigrateItem,
    Items.startInteractiveConsoleItem,
    Items.startWebServerItem,
    Items.gitPushItem,
    Items.gitFetchItem,
    Items.gitRebaseContinueItem,
    Items.gitRebaseSkipItem,
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
  Items.BAR_ITEMS.forEach((item) => {
    item.dispose();
  });
}
