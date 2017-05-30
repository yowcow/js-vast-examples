.PHONY: install run clean

all: install public/files/file-640x360.mp4

install:
	npm install

public/files/file-640x360.mp4: public/files
	curl -L https://d1235ca2z646oc.cloudfront.net/videos/processed/921/342574553.mp4.mp4 -o $@

public/files:
	mkdir -p $@

run:
	node app.js

clean:
	rm -rf public/files
