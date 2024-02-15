install:
	npm ci
	
lint:
	npx eslint .

prod:
	rm -rf dist
	npx webpack --mode production

dev:
	rm -rf dist
	npx webpack --mode development

server:
	npx webpack serve --mode development