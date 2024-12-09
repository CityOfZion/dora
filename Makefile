
all: dora.tar.gz

dora.tar:
	docker build --output type=tar,dest=$@ .

dora.tar.gz: dora.tar
	gzip -f $<

clean:
	rm -f dora.tar.gz dora.tar

.PHONY: clean dora.tar
