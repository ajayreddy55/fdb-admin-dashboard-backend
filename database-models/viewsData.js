const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const viewsDataSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  dateViewed: {
    type: Date,
    required: true,
  },
});

const serviceViewsDataModel = model("serviceViewsData", viewsDataSchema);

module.exports = serviceViewsDataModel;
