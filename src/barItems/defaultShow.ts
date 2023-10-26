import * as Utils from "../utils";
import * as BarItems from "./definition";

export const defaultShowItems = () => {
  Utils.showItems([
    BarItems.formatCodeFileItem,
    BarItems.runDBRemigrateItem,
    BarItems.runDBMigrateItem,
    BarItems.startInteractiveConsoleItem,
    BarItems.startWebServerItem,
    BarItems.gitPushItem,
    BarItems.gitFetchItem,
    BarItems.gitRebaseContinueItem,
    BarItems.gitRebaseSkipItem,
  ]);
};
