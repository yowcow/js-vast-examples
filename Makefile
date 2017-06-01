.PHONY: install run test clean

APP_PATH       := /usr/src/app
IMAGE_NAME     := node:latest
CONTAINER_NAME := vast-server
CID_FILE       := vast-server.cid

all: install public/files/file-640x360.mp4

install:
	docker run --rm \
		--name $(CONTAINER_NAME) \
		-v "$$PWD":$(APP_PATH) \
		-w $(APP_PATH) \
		$(IMAGE_NAME) \
		npm install

public/files/file-640x360.mp4: public/files
	curl -L https://d1235ca2z646oc.cloudfront.net/videos/processed/921/342574553.mp4.mp4 -o $@

public/files:
	mkdir -p $@

run:
	docker run --rm \
		--cidfile $(CID_FILE) \
		--name $(CONTAINER_NAME) \
		-v "$$PWD:$(APP_PATH)" \
		-w $(APP_PATH) \
		-p 5000:5000 \
		$(IMAGE_NAME) \
		node app.js || rm $(CID_FILE)

test:
	docker run -it --rm \
		--name $(CONTAINER_NAME) \
		-v "$$PWD:$(APP_PATH)" \
		-w $(APP_PATH) \
		$(IMAGE_NAME) \
		npm test

clean:
	rm -rf public/files node_modules
