SHELL := /usr/bin/zsh # needed for prettyurls
BUNDLE := bundle
YARN := yarn
ASSETS_DIR = assets
VENDOR_DIR = $(ASSETS_DIR)/vendor/
JEKYLL := $(BUNDLE) exec jekyll
PROJECT_DEPS := Gemfile package.json

.PHONY: all clean install update

all : serve

check:
	$(JEKYLL) doctor

install: $(PROJECT_DEPS)
	$(BUNDLE) install
	$(YARN) install

update: $(PROJECT_DEPS)
	$(BUNDLE) update
	$(YARN) upgrade

include-yarn-deps:
	mkdir -p $(VENDOR_DIR)
	# cp node_modules/@fortawesome/fontawesome-free/css/all.min.css $(VENDOR_DIR)
	# cp node_modules/@fortawesome/fontawesome-free/js/all.min.js $(VENDOR_DIR)
	# cp -r node_modules/@fortawesome/fontawesome-free/webfonts $(ASSETS_DIR)
	cp node_modules/webfontloader/webfontloader.js $(VENDOR_DIR)
	cp node_modules/lodash/lodash.min.js $(VENDOR_DIR)
	cp node_modules/chart.js/dist/Chart.bundle.min.js $(VENDOR_DIR)

build-deps: clean install include-yarn-deps
build: build-deps
	JEKYLL_ENV=production $(JEKYLL) build

serve: build-deps
	JEKYLL_ENV=development $(JEKYLL) serve --livereload

clean:
	rm -fr _site/
	rm -fr $(VENDOR_DIR) #from yarn
	rm -fr $(ASSETS_DIR)/webfonts #fontawesome dependency
	rm -fr .sass_cache