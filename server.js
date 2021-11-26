const express = require("express");
const { join } = require("path");
const app = express();

// Serve static assets from the /public folder
app.use(express.static(join(__dirname, "public")));

// Endpoint to serve the configuration file
app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"));
});

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

// Listen on port 3000
app.listen(3000, () => console.log("Application running on port 3000"));