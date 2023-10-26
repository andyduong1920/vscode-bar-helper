// Adjust here to add more file check helpers
export const isTestFile = (filePath: any) => {
  return isRubyTestFile(filePath) || isElixirTestFile(filePath);
};

export const isRubyTestFile = (filePath: any) => {
  return filePath.includes("_spec.rb");
};

export const isElixirTestFile = (filePath: any) => {
  return filePath.includes("_test.exs");
};

export const isRubyFile = (filePath: any) => {
  return filePath.includes(".rb");
};

export const isElixirFile = (filePath: any) => {
  return filePath.includes(".exs") || filePath.includes(".ex");
};

export const isJSFile = (filePath: any) => {
  return filePath.includes(".js");
};
