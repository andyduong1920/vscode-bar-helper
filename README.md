Run the test from the `Status bar` or `Menu`

![vscode-bar-helper](https://user-images.githubusercontent.com/11751745/229404715-51f1b21e-b30a-4052-8cda-96406979dd26.png)

Install it on [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=andyduong1920.bar-helper)

### I/ Development

1. Clone the repo
2. Update the Node version in `.tool-versions`
3. Run `npm install`
4. Run `make package_and_install`
5. Test on VSCode

### II/ Add new Item
1. Define the bar item in `src/editableArea/1_definitions.ts`
2. Make it as default show by adding it to `src/editableArea/2_defaultShow.ts`
3. Define the command in `src/editableArea/3_commands.ts`
4. Setup the Item behavior in `src/editableArea/4_behaviors.ts` link to the command in step 3
5. Update the `src/editableArea/5_customShow.ts` to modify the Items per file Type, for example display only for Test files.
6. Edit the `package.json` to add the new command to the `contributes.commands` and `contributes.keybindings` sections

### III/ Publish

- Trigger the [publish workflow](https://github.com/andyduong1920/vscode-bar-helper/actions/workflows/publish.yml) on Github Actions.
