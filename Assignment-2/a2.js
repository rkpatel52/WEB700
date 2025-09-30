/********************************************************************************
*  WEB700 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Rahulkumar Kalidas Patel
*  Student ID: 127490241
*  Date: 26/09/2025
*
********************************************************************************/

const setData = require("./data/setData.json");
const themeData = require("./data/themeData.json");

class LegoData {
  constructor() {
    this.sets = [];
  }

  // initialize: load and merge data
  initialize() {
    return new Promise((resolve, reject) => {
      try {
        this.sets = [];

        setData.forEach(sd => {
          // find theme name matching theme_id
          let themeObj = themeData.find(td => td.id == sd.theme_id);
          let themeName = themeObj ? themeObj.name : "Unknown";

          // create new object with "theme" property
          this.sets.push({
            ...sd,
            theme: themeName
          });
        });

        resolve(); // no data, just confirms complete
      } catch (err) {
        reject(`Initialization failed: ${err}`);
      }
    });
  }

  // return all sets
  getAllSets() {
    return new Promise((resolve, reject) => {
      if (this.sets.length > 0) {
        resolve(this.sets);
      } else {
        reject("No sets available.");
      }
    });
  }

  // find set by set_num
  getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      const found = this.sets.find(s => s.set_num === setNum);
      if (found) {
        resolve(found);
      } else {
        reject(`Unable to find set with number: ${setNum}`);
      }
    });
  }

  // find sets by theme (case-insensitive, partial match)
  getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
      const themeLower = theme.toLowerCase();
      const results = this.sets.filter(s => 
        s.theme.toLowerCase().includes(themeLower)
      );

      if (results.length > 0) {
        resolve(results);
      } else {
        reject(`Unable to find sets with theme: ${theme}`);
      }
    });
  }
}

let data = new LegoData();

data.initialize()
  .then(() => {
    console.log(`Number of Sets: ${data.sets.length}`);

    return data.getSetByNum("0012-1");
  })
  .then(set => {
    console.log(set);

    return data.getSetsByTheme("tech");
  })
  .then(techSets => {
    console.log(`Number of 'tech' sets: ${techSets.length}`);
  })
  .catch(err => {
    console.log("Error:", err);
  });