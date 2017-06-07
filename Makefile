.PHONY: install run test clean

APP_PATH       := /usr/src/app
IMAGE_NAME     := node:latest
CONTAINER_NAME := vast-server

all: install public/files public/files/index.html public/files/file-640x360.mp4 public/files/50x300_static.jpg public/files/50x450_static.jpg

install:
	docker run -it --rm \
		--name $(CONTAINER_NAME)-install \
		-v "$$PWD":$(APP_PATH) \
		-w $(APP_PATH) \
		$(IMAGE_NAME) \
		npm install

public/files/index.html:
	echo "<h1>Hello world</h1>" > $@

public/files/file-640x360.mp4:
	curl -L https://d1235ca2z646oc.cloudfront.net/videos/processed/921/342574553.mp4.mp4 -o $@

public/files/50x300_static.jpg:
	curl -L http://demo.tremormedia.com/proddev/vast/50x300_static.jpg -o $@

public/files/50x450_static.jpg:
	curl -L http://demo.tremormedia.com/proddev/vast/50x450_static.jpg -o $@

public/files:
	mkdir -p $@

run:
	docker run --rm \
		--name $(CONTAINER_NAME) \
		-v "$$PWD:$(APP_PATH)" \
		-w $(APP_PATH) \
		-p 5000:5000 \
		$(IMAGE_NAME) \
		node app.js

test:
	docker run -it --rm \
		--name $(CONTAINER_NAME)-test \
		-v "$$PWD:$(APP_PATH)" \
		-w $(APP_PATH) \
		$(IMAGE_NAME) \
		npm test

clean:
	rm -rf public/files node_modules
