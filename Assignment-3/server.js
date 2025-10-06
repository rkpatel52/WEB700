/********************************************************************************
*  WEB700 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Rahulkumar Kalidas Patel  Student ID: 127490241  Date: 10/06/2025
*
*  Published URL: https://github.com/rkpatel52/WEB700/tree/main/Assignment-3
*
********************************************************************************/

const express = require("express");
const path = require("path");
const LegoData = require("./modules/legoSets");
const legoData = new LegoData();
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

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

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// Initialize data and then start server
legoData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server running at http://localhost:${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
  });