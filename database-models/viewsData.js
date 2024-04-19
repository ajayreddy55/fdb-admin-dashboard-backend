const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const viewsDataSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  serviceId: {
    type: String,
    required: true,
  },
  dateViewed: {
    type: Date,
    required: true,
  },
});

const serviceViewsDataModel = model("serviceViewsData", viewsDataSchema);

module.exports = serviceViewsDataModel;
