import * as Utils from "../utils";
import * as BarItems from "./1_definition";

export const defaultShowItems = () => {
  Utils.showItems([
    BarItems.formatCodeFileItem,
    BarItems.runDBRemigrateItem,
    BarItems.runDBMigrateItem,
    BarItems.startInteractiveConsoleItem,
    BarItems.startWebServerItem,
    BarItems.gitPushItem,
    BarItems.gitCheckoutDevelopPullAndFetchItem,
    BarItems.gitRebaseContinueItem,
    BarItems.gitRebaseSkipItem,
  ]);
};
