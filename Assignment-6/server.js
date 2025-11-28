/********************************************************************************
*  WEB700 – Assignment 06
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: ______________________ Student ID: ______________ Date: ______________
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/

const express = require("express");
const path = require("path");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* Lego data module (Sequelize-based for A6) */
const LegoData = require("./modules/legoSets");
const legoData = new LegoData();

/* HOME */
app.get("/", (req, res) => res.render("home"));

/* ABOUT */
app.get("/about", (req, res) => res.render("about"));

/* ADD SET (form) */
app.get("/lego/addSet", async (req, res) => {
  try {
    const themes = await legoData.getAllThemes();
    res.render("addSet", { themes });
  } catch (err) {
    res.status(500).render("500", { message: err.toString() });
  }
});

/* PROCESS ADD SET */
app.post("/lego/addSet", async (req, res) => {
  try {
    await legoData.addSet(req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(500).render("500", { message: err.toString() });
  }
});

/* COLLECTION (with optional ?theme=...) */
app.get("/lego/sets", async (req, res) => {
  try {
    const { theme } = req.query;
    const sets = theme ? await legoData.getSetsByTheme(theme) : await legoData.getAllSets();
    res.render("sets", { sets });
  } catch (err) {
    res.status(500).render("500", { message: err.toString() });
  }
});

/* SINGLE SET DETAILS */
app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.set_num);
    res.render("set", { set });
  } catch (err) {
    res.status(404).render("404", { message: err.toString() });
  }
});

/* DELETE SET */
app.get("/lego/deleteSet/:set_num", async (req, res) => {
  try {
    await legoData.deleteSetByNum(req.params.set_num);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(404).render("404", { message: err.toString() });
  }
});

/* 404 last */
app.use((req, res) => res.status(404).render("404"));

legoData.initialize()
  .then(() => { app.listen(HTTP_PORT, () => console.log(`Server running on http://localhost:${HTTP_PORT}`)); })
  .catch((err) => { console.error(err); process.exit(1); });

  require('dotenv').config();
