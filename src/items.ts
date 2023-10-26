import { window, StatusBarAlignment } from "vscode";

export const runTestFileItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -1
);
export const runTestLineItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -2
);
export const formatCodeFileItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -3
);
export const runDBMigrateItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -4
);
export const startInteractiveConsoleItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -5
);
export const startWebServerItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -6
);
export const runDBRemigrateItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -7
);
export const gitFetchItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -9
);
export const gitPushItem = window.createStatusBarItem(
  StatusBarAlignment.Left,
  -10
);

// Right side
export const gitRebaseSkipItem = window.createStatusBarItem(
  StatusBarAlignment.Right,
  1
);
export const gitRebaseContinueItem = window.createStatusBarItem(
  StatusBarAlignment.Right,
  2
);

// Adjust here to add more items
export const TEST_ITEMS = [runTestFileItem, runTestLineItem];
export const BAR_ITEMS = [
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
