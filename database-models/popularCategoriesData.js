const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const popularCategoriesSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
});

const popularCategoriesModel = model(
  "popularCategoriesData",
  popularCategoriesSchema
);

module.exports = popularCategoriesModel;
