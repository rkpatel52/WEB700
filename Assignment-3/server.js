/********************************************************************************
*  WEB700 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Rahulkumar Kalidas Patel  Student ID:  Date: ______________
*
*  Published URL: 
*
********************************************************************************/

const express = require("express");
const path = require("path");

// Assignment 3 module wiring
const LegoData = require("./modules/legoSets");
const legoData = new LegoData();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Serve static assets in /views (optional if you want images/css later)
app.use(express.static("views"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

// GET /lego/sets  (optionally filter by ?theme=...)
app.get("/lego/sets", async (req, res) => {
  try {
    const { theme } = req.query;
    if (theme) {
      const filtered = await legoData.getSetsByTheme(theme);
      res.json(filtered);
    } else {
      const all = await legoData.getAllSets();
      res.json(all);
    }
  } catch (err) {
    res.status(404).json({ error: String(err) });
  }
});

// GET /lego/sets/:set_num
app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const one = await legoData.getSetByNum(req.params.set_num);
    res.json(one);
  } catch (err) {
    res.status(404).json({ error: String(err) });
  }
});

// Custom 404 → serve views/404.html
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// Initialize data, then start server
legoData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: http://localhost:${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Failed to initialize data: ${err}`);
  });