const express = require("express");
const { join } = require("path");
const app = express();
const https = require('https');
const fs = require('fs');
const path = require('path');

// Serve static assets from the /public folder
app.use(express.static(join(__dirname, "public")));

// Endpoint to serve the configuration file
app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"));
});

const opts = {
	key: fs.readFileSync(path.join(__dirname, 'server_key.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'server_cert.pem')),
	requestCert: false,
	rejectUnauthorized: false, // so we can do own error handling
	ca: [
	]
};

// Open Redirector
app.get("/302", (req, res) => {  
  res.redirect(302, req.query["redirect"])
});
app.get("/303", (req, res) => {
  res.redirect(303, req.query["redirect"])
});
app.get("/307", (req, res) => {
  res.redirect(307, req.query["redirect"])
});

// Serve the index page for all other requests
app.get("/*", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

// Listen on http
app.listen(3000, () => console.log("Application running on port 3000"));

// listens on https
https.createServer(opts, app).listen(4433, () => {
	console.log("Application running on port 4433")
});
