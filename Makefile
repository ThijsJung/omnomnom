push-www:
	push-html
	push-css
	push-js

push-html:
	aws s3 cp recipe.html s3://thijsjung.nl/omnomnom/
	aws s3 cp create_recipe.html s3://thijsjung.nl/omnomnom/
	aws s3 cp index.html s3://thijsjung.nl/omnomnom/

push-css:
	aws s3 cp www/static/style.css s3://thijs-test-runalytics/static/

push-js:
	aws s3 cp www/static/data_loading.js s3://thijs-test-runalytics/static/