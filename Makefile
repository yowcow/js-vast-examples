.PHONY: pull install run test clean

APP_PATH       := /usr/src/app
IMAGE_NAME     := node:latest
CONTAINER_NAME := vast-server

all: pull install public/files public/files/index.html public/files/file-640x360.mp4 public/files/50x300_static.jpg public/files/50x450_static.jpg

pull:
	docker pull $(IMAGE_NAME)

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
	curl -L https://r6---sn-oguesnze.gvt1.com/videoplayback/id/a33fc5b2685eb16e/itag/15/source/gfp_video_ads/requiressl/yes/acao/yes/mime/video%2Fmp4/ip/0.0.0.0/ipbits/0/expire/1499157334/sparams/acao,expire,id,ip,ipbits,itag,mime,mip,mm,mn,ms,mv,pl,requiressl,source/signature/66E4F414198523BC92EB826F0BF7E1AB6609CFE5.058CE91DE6186CDB3A4747A6DD473DF2F2E8B328/key/cms1/mip/210.168.46.254/pl/17/redirect_counter/1/cm2rm/sn-ogudd7e/req_id/a4f68e6dc002a3ee/cms_redirect/yes/mm/34/mn/sn-oguesnze/ms/ltu/mt/1499135646/mv/u?file=file.mp4 -o $@

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
