import * as Utils from "../utils";
import * as BarItems from "./1_definition";

export const setupItemBehaviors = () => {
  // Left side
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

  // Right side
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
};
