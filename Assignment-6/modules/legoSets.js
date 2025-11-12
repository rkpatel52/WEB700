require('dotenv').config();
require('pg');

const Sequelize = require('sequelize');

class LegoData {
  constructor() {
    this.sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
      host: process.env.PGHOST,
      dialect: 'postgres',
      dialectModule: require('pg'),
      logging: false
    });

    this.Theme = this.sequelize.define('Theme', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING }
    }, { timestamps: false });

    this.Set = this.sequelize.define('Set', {
      set_num: { type: Sequelize.STRING, primaryKey: true },
      name: { type: Sequelize.STRING },
      year: { type: Sequelize.INTEGER },
      num_parts: { type: Sequelize.INTEGER },
      theme_id: { type: Sequelize.INTEGER },
      img_url: { type: Sequelize.STRING }
    }, { timestamps: false });

    this.Set.belongsTo(this.Theme, { foreignKey: 'theme_id' });
  }

  async initialize() {
    await this.sequelize.sync();
  }

  async getAllSets() {
    return this.Set.findAll({ include: [this.Theme] });
  }

  async getSetByNum(setNum) {
    const res = await this.Set.findAll({ where: { set_num: setNum }, include: [this.Theme] });
    if (!res || res.length === 0) throw "Unable to find requested set";
    return res[0];
  }

  async getSetsByTheme(theme) {
    const { Op } = Sequelize;
    const res = await this.Set.findAll({ 
      include: [this.Theme],
      where: { '$Theme.name$': { [Op.iLike]: `%${theme}%` } }
    });
    if (!res || res.length === 0) throw "Unable to find requested sets";
    return res;
  }

  async getAllThemes() {
    return this.Theme.findAll();
  }

  async addSet(newSet) {
    try {
      await this.Set.create({
        set_num: String(newSet.set_num),
        name: String(newSet.name),
        year: Number(newSet.year),
        num_parts: Number(newSet.num_parts),
        theme_id: Number(newSet.theme_id),
        img_url: String(newSet.img_url)
      });
    } catch (err) {
      if (err && err.errors && err.errors[0] && err.errors[0].message) { throw err.errors[0].message; }
      throw (err && err.message) || "Failed to add set"
    }
  }

  async deleteSetByNum(setNum) {
    try {
      const count = await this.Set.destroy({ where: { set_num: setNum } });
      if (count === 0) throw "Set not found";
    } catch (err) {
      if (err && err.errors && err.errors[0] && err.errors[0].message) { throw err.errors[0].message; }
      throw (err && err.message) || "Failed to delete set"
    }
  }
}

module.exports = LegoData;
