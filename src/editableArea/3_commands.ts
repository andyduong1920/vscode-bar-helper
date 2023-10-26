import { commands, window, workspace } from "vscode";
import * as FileCheckHelpers from "../fileCheckHelpers";
import * as Utils from "../utils";

// Left side

export const runTestFileCommand = commands.registerCommand(
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

export const runTestLineCommand = commands.registerCommand(
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
        Utils.sendToTerminal(`bundle exec rspec ${relativePath}:${lineNumber}`);
      } else if (FileCheckHelpers.isElixirTestFile(filePath)) {
        Utils.sendToTerminal(`mix test ${relativePath}:${lineNumber}`);
      }
    }
  }
);

export const runDBRemigrateCommand = commands.registerCommand(
  "barHelper.runDBRemigrate",
  () => {
    // TODO: Support Elixir
    Utils.sendToTerminal(
      "bin/rails db:environment:set RAILS_ENV=development && bin/rails db:drop db:setup"
    );
  }
);

export const runDBMigrateCommand = commands.registerCommand(
  "barHelper.runDBMigrate",
  () => {
    // TODO: Support Elixir
    Utils.sendToTerminal("bundle exec rails db:migrate");
  }
);

export const startInteractiveConsoleCommand = commands.registerCommand(
  "barHelper.startInteractiveConsole",
  () => {
    // TODO: Support Elixir
    Utils.sendToTerminal("bundle exec rails console");
  }
);

export const startWebServerCommand = commands.registerCommand(
  "barHelper.startWebServer",
  () => {
    // TODO: Support Elixir
    Utils.sendToTerminal("foreman start -f Procfile.dev");
  }
);

export const formatCodeFileCommand = commands.registerCommand(
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

export const runGitPushCommand = commands.registerCommand(
  "barHelper.runGitPush",
  () => {
    Utils.sendToTerminal("ggpush -f");
  }
);

export const runGitStatusCommand = commands.registerCommand(
  "barHelper.runGitStatus",
  () => {
    Utils.sendToTerminal("gst");
  }
);

export const runGitCheckoutDevelopPullAndFetchItemCommand =
  commands.registerCommand(
    "barHelper.runGitCheckoutDevelopPullAndFetchItem",
    () => {
      Utils.sendToTerminal("gco develop && g pull && g fetch");
    }
  );

// Right side

export const runGitRebaseContinueCommand = commands.registerCommand(
  "barHelper.runGitRebaseContinue",
  () => {
    Utils.sendToTerminal("ga . && g rebase --continue");
  }
);

export const runGitRebaseSkipCommand = commands.registerCommand(
  "barHelper.runGitRebaseSkip",
  () => {
    Utils.sendToTerminal("g rebase --skip");
  }
);
