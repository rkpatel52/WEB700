/********************************************************************************
*  WEB700 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Rahulkumar Kalidas Patel  Student ID: 127490241  Date: 10/27/2025
*
*  Published URL: https://web-700-nyin.vercel.app/
*
********************************************************************************/

const express = require("express");
const path = require("path");

// ---- Express app ----
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// serve static files from /public  (REQUIRED in A4)
app.use(express.static(path.join(__dirname, "public")));

// ---- Lego data module ----
const LegoData = require("./modules/legoSets");
const legoData = new LegoData();

// ---- basic routes ----
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

// show sets (simple JSON for demo)
app.get("/lego/sets", async (req, res) => {
  try {
    const sets = await legoData.getSets();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    const rows = sets
      .map(
        (s) => `
        <tr>
          <td>${s.set_num}</td>
          <td>${s.name}</td>
          <td>${s.year}</td>
          <td>${s.theme_id}</td>
          <td>${s.num_parts}</td>
          <td><img src="${s.img_url}" alt="img ${s.set_num}" style="height:60px"></td>
        </tr>`
      )
      .join("");
    res.send(`
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Lego Sets</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="/css/theme.css">
      </head>
      <body class="p-4">
        <h1 class="mb-3">Lego Sets</h1>
        <a class="btn btn-dark mb-3" href="/lego/add-test">Add Test Set</a>
        <div class="table-responsive">
        <table class="table table-dark table-striped align-middle">
          <thead><tr><th>Set #</th><th>Name</th><th>Year</th><th>Theme</th><th>Parts</th><th>Image</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        </div>
        <p><a href="/">Home</a> · <a href="/about">About</a></p>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

/**
 * A4 Step 3 test route:
 * Adds a new set if set_num does not exist, else returns 422 (as required).
 * Visit: http://localhost:${HTTP_PORT}/lego/add-test
 */
app.get("/lego/add-test", async (req, res) => {
  const testSet = {
    set_num: "123",
    name: "testSet name",
    year: "2024",
    theme_id: "366",
    num_parts: "123",
    img_url: "https://fakeimg.pl/375x375?text=[+Lego+]"
  };

  try {
    await legoData.addSet(testSet);
    // success => redirect to /lego/sets
    res.redirect("/lego/sets");
  } catch (err) {
    // if already exists => 422 with message (A4 requirement)
    res.status(422).send(err);
  }
});

// 404 last
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(HTTP_PORT, () => {
  console.log(`Server listening on: http://localhost:${HTTP_PORT}`);
});