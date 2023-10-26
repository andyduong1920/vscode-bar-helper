"use strict";

import { commands, window, ExtensionContext, workspace } from "vscode";

import * as FileCheckHelpers from "./fileCheckHelpers";
import * as BarItems from "./barItems/definition";
import { setupItems } from "./barItems/setup";
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

    if (FileCheckHelpers.isTestFile(filePath)) {
      Utils.showTestItems();
    } else {
      Utils.hideTestItems();
    }
  }
};

export function activate(context: ExtensionContext) {
  setupItems();

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

        if (FileCheckHelpers.isRubyTestFile(filePath)) {
          Utils.sendToTerminal(`bundle exec rspec ${relativePath}`);
        } else if (FileCheckHelpers.isElixirTestFile(filePath)) {
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

        if (FileCheckHelpers.isRubyTestFile(filePath)) {
          Utils.sendToTerminal(
            `bundle exec rspec ${relativePath}:${lineNumber}`
          );
        } else if (FileCheckHelpers.isElixirTestFile(filePath)) {
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

        if (FileCheckHelpers.isRubyFile(filePath)) {
          Utils.sendToTerminal(`bundle exec rubocop -a ${relativePath}`);
        } else if (FileCheckHelpers.isElixirFile(filePath)) {
          Utils.sendToTerminal(`mix format ${relativePath}`);
        } else if (FileCheckHelpers.isJSFile(filePath)) {
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
  Object.values(BarItems).forEach((item) => {
    item.dispose();
  });
}
