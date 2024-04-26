const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const servicesCategoryDataSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const servicesCategoryDataModel = model(
  "servicesCategoryData",
  servicesCategoryDataSchema
);

module.exports = servicesCategoryDataModel;
