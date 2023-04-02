Phony: compile package install package_and_install

compile:
	rm -rf out
	npm run compile

package:
	printf "Y\n" | vsce package

install:
	code --install-extension bar-helper-0.1.0.vsix
	rm bar-helper-0.1.0.vsix

package_and_install: package install
