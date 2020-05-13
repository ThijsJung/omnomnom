push-www:
	$(MAKE) push-html
	$(MAKE) push-js

push-html:
	aws s3 cp . $(SITE_BUCKET) --recursive --exclude "*" --include "*.html"

push-js:
	aws s3 cp js/ $(SITE_BUCKET)/js --recursive --exclude "*" --include "*.js"