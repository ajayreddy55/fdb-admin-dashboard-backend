const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const serviceClicksDataSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  serviceId: {
    type: String,
    required: true,
  },
  dateClicked: {
    type: Date,
    required: true,
  },
});

const serviceClicksDataModel = model(
  "serviceClicksData",
  serviceClicksDataSchema
);

module.exports = serviceClicksDataModel;
