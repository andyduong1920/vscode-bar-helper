"use strict";

import { commands, window, ExtensionContext, workspace } from "vscode";

import * as Helpers from "./helpers";
import * as BarItems from "./barItems";
import * as Utils from "./utils";

const onUpdatePath = () => {
  const editor = window.activeTextEditor;

  if (editor === undefined) {
    Utils.hideTestItems();
    BarItems.formatCodeFileItem.hide();
  } else {
    const filePath = editor.document.fileName;

    // Always show the format item on any file
    BarItems.formatCodeFileItem.show();

    if (Helpers.isTestFile(filePath)) {
      Utils.showTestItems();
    } else {
      Utils.hideTestItems();
    }
  }
};

export function activate(context: ExtensionContext) {
  // Adjust here to add more items
  Utils.setupItem(
    BarItems.runTestFileItem,
    "🔥⌃a",
    "Test file",
    "barHelper.runTestFile"
  );
  Utils.setupItem(
    BarItems.runTestLineItem,
    "1️⃣ ⌃z",
    "Test line",
    "barHelper.runTestLine"
  );
  Utils.setupItem(
    BarItems.runDBRemigrateItem,
    "⭕ reMIGRATION",
    "db:drop db:create db:migrate && db:seed",
    "barHelper.runDBRemigrate"
  );
  Utils.setupItem(
    BarItems.startInteractiveConsoleItem,
    "⛑️⌃i",
    "Start the interactive console",
    "barHelper.startInteractiveConsole"
  );
  Utils.setupItem(
    BarItems.startWebServerItem,
    "🚁⌃s",
    "Start the web server",
    "barHelper.startWebServer"
  );
  Utils.setupItem(
    BarItems.formatCodeFileItem,
    "🎨 ⌃f",
    "format the file",
    "barHelper.formatCodeFile"
  );
  Utils.setupItem(
    BarItems.runDBMigrateItem,
    "⬆️ ⌃m",
    "db:migrate",
    "barHelper.runDBMigrate"
  );
  Utils.setupItem(
    BarItems.gitPushItem,
    "🚀⌃u",
    "git push --force",
    "barHelper.runGitPush"
  );
  Utils.setupItem(BarItems.gitFetchItem, "⏬ FETCH", "git fetch.", "git.fetch");
  Utils.setupItem(
    BarItems.gitRebaseContinueItem,
    "🏃 rebase:CONTINUE",
    "git add . && git rebase --continue.",
    "barHelper.runGitRebaseContinue"
  );
  Utils.setupItem(
    BarItems.gitRebaseSkipItem,
    "👋 rebase:SKIP",
    "git rebase --skip.",
    "barHelper.runGitRebaseSkip"
  );

  Utils.showItems([
    BarItems.runDBRemigrateItem,
    BarItems.runDBMigrateItem,
    BarItems.startInteractiveConsoleItem,
    BarItems.startWebServerItem,
    BarItems.gitPushItem,
    BarItems.gitFetchItem,
    BarItems.gitRebaseContinueItem,
    BarItems.gitRebaseSkipItem,
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
          Utils.sendToTerminal(`bundle exec rspec ${relativePath}`);
        } else if (Helpers.isElixirTestFile(filePath)) {
          Utils.sendToTerminal(`mix test ${relativePath}`);
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
          Utils.sendToTerminal(
            `bundle exec rspec ${relativePath}:${lineNumber}`
          );
        } else if (Helpers.isElixirTestFile(filePath)) {
          Utils.sendToTerminal(`mix test ${relativePath}:${lineNumber}`);
        }
      }
    }
  );

  const runDBRemigrateCommand = commands.registerCommand(
    "barHelper.runDBRemigrate",
    () => {
      // TODO: Support Elixir
      Utils.sendToTerminal(
        "bin/rails db:environment:set RAILS_ENV=development && bin/rails db:drop db:setup"
      );
    }
  );

  const runDBMigrateCommand = commands.registerCommand(
    "barHelper.runDBMigrate",
    () => {
      // TODO: Support Elixir
      Utils.sendToTerminal("bundle exec rails db:migrate");
    }
  );

  const startInteractiveConsoleCommand = commands.registerCommand(
    "barHelper.startInteractiveConsole",
    () => {
      // TODO: Support Elixir
      Utils.sendToTerminal("bundle exec rails console");
    }
  );

  const startWebServerCommand = commands.registerCommand(
    "barHelper.startWebServer",
    () => {
      // TODO: Support Elixir
      Utils.sendToTerminal("foreman start -f Procfile.dev");
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
          Utils.sendToTerminal(`bundle exec rubocop -a ${relativePath}`);
        } else if (Helpers.isElixirFile(filePath)) {
          Utils.sendToTerminal(`mix format ${relativePath}`);
        } else if (Helpers.isJSFile(filePath)) {
          // TODO: Support npm
          Utils.sendToTerminal(`yarn eslint --color --fix ${relativePath}`);
        }
      }
    }
  );

  const runGitPushCommand = commands.registerCommand(
    "barHelper.runGitPush",
    () => {
      Utils.sendToTerminal("ggpush -f");
    }
  );

  const runGitRebaseContinueCommand = commands.registerCommand(
    "barHelper.runGitRebaseContinue",
    () => {
      Utils.sendToTerminal("ga . && g rebase --continue");
    }
  );

  const runGitRebaseSkipCommand = commands.registerCommand(
    "barHelper.runGitRebaseSkip",
    () => {
      Utils.sendToTerminal("g rebase --skip");
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
  BarItems.BAR_ITEMS.forEach((item) => {
    item.dispose();
  });
}
