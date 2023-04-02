compile:
	rm -rf out
	npm run compile

package:
	vsce package

install:
	code --install-extension bar-helper-0.1.0.vsix
	rm bar-helper-0.1.0.vsix
