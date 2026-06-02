import * as FileCheckHelpers from "../fileCheckHelpers";
import { showItems } from "../utils";
import * as BarItems from "./1_definition";

export const hideAllPerFileType = () => {
  hideTestItems();
  hideRubyItems();
};

export const showPerFileType = (editor: any) => {
  const filePath = editor.document.fileName;

  controlTestItems(filePath);
  controlRubyItems(filePath);
};

const controlTestItems = (filePath: any) => {
  if (FileCheckHelpers.isTestFile(filePath)) {
    showTestItems();
  } else {
    hideTestItems();
  }
};

const TEST_ITEMS = [BarItems.runTestFileItem, BarItems.runTestLineItem];

const hideTestItems = () => {
  TEST_ITEMS.forEach((item) => item.hide());
};

const showTestItems = () => {
  showItems(TEST_ITEMS);
};

const RUBY_ITEMS = [BarItems.switchBetweenFileAndSpecItem];

const controlRubyItems = (filePath: any) => {
  if (FileCheckHelpers.isRubyFile(filePath)) {
    showItems(RUBY_ITEMS);
  } else {
    hideRubyItems();
  }
};

const hideRubyItems = () => {
  RUBY_ITEMS.forEach((item) => item.hide());
};
