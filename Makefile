push-www:
	$(MAKE) push-html
	$(MAKE) push-css
	$(MAKE) push-js

push-html:
	aws s3 cp . $(SITE_BUCKET) --recursive --exclude "*" --include "*.html"

push-css:
	aws s3 cp . $(SITE_BUCKET)/css --recursive --exclude "*" --include "*.css"

push-js:
	aws s3 cp js/ $(SITE_BUCKET)/js --recursive --exclude "*" --include "*.js"