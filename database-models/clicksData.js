const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const serviceClicksDataSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  serviceId: {
    type: Schema.Types.ObjectId,
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
