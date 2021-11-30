# generate server certificate
openssl req \
	-x509 \
	-newkey rsa:4096 \
	-keyout server_key.pem \
	-out server_cert.pem \
	-nodes \
	-days 365 \
	-subj "/CN=localhost/O=Client\ Certificate\ Demo"