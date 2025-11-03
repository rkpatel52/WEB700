class LegoData {
  constructor() {
    // Starter in-memory sets (enough to show /lego/sets)
    this.sets = [
      {
        set_num: "75257",
        name: "Millennium Falcon",
        year: "2019",
        theme_id: "158",
        num_parts: "1351",
        img_url: "https://images.brickset.com/sets/images/75257-1.jpg"
      },
      {
        set_num: "21335",
        name: "Motorized Lighthouse",
        year: "2022",
        theme_id: "673",
        num_parts: "2065",
        img_url: "https://images.brickset.com/sets/images/21335-1.jpg"
      }
    ];
  }

  // Used by /lego/sets to render the table
  getSets() {
    return Promise.resolve(this.sets);
  }

  /**
   * A4 requirement: addSet(newSet) returns a Promise
   * - Reject if set_num already exists
   * - Else push and resolve()
   */
  addSet(newSet) {
    return new Promise((resolve, reject) => {
      const exists = this.sets.find((s) => s.set_num === newSet.set_num);
      if (exists) {
        return reject("Set already exists");
      }
      this.sets.push(newSet);
      resolve();
    });
  }
}

module.exports = LegoData;
