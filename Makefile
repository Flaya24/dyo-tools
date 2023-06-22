.DEFAULT_GOAL := all

.PHONY: all
all: dist

.PHONY: check
check:
	npm run-script lint

.PHONY: checkfix
checkfix:
	npm run-script lint:fix

.PHONY: clean
clean: distclean
	rm -Rf node_modules/

dist: node_modules distclean
	npm run-script build:prod

.PHONY: distclean
distclean:
	rm -Rf dist/

node_modules:
	npm install

.PHONY: test
test:
	npm run-script test

.PHONY: verify
verify: dist check
	npm run-script test:coverage:verify
