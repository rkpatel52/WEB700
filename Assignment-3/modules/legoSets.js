// modules/legoSets.js
const setData = require("../data/setData");
const themeData = require("../data/themeData");

class LegoData {
  constructor() {
    this.sets = [];
    this.themes = [];
  }

  async initialize() {
    this.sets = setData;
    this.themes = themeData;
    return true;
  }

  getAllSets() {
    return new Promise((resolve, reject) => {
      if (this.sets?.length) resolve(this.sets);
      else reject("No set data available");
    });
  }

  getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      const found = this.sets.find(s => String(s.set_num).toLowerCase() === String(setNum).toLowerCase());
      if (found) resolve(found);
      else reject(`No set found with set_num: ${setNum}`);
    });
  }

  getSetsByTheme(themeQuery) {
    return new Promise((resolve, reject) => {
      if (!themeQuery) return reject("Theme query missing");
      const q = themeQuery.toLowerCase();

      // Try to match by theme name or theme code fragment
      const themeIds = this.themes
        .filter(t => t.name?.toLowerCase().includes(q) || String(t.theme_url || "").toLowerCase().includes(q))
        .map(t => t.id);

      const results = this.sets.filter(s => themeIds.includes(s.theme_id));
      if (results.length) resolve(results);
      else reject(`No sets found for theme: ${themeQuery}`);
    });
  }
}

module.exports = LegoData;