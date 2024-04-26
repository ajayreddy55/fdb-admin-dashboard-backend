const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reviewsDataSchema = new Schema({
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  dateOfReview: {
    type: Date,
    required: true,
  },
});

const reviewsDataModel = model("reviewsData", reviewsDataSchema);

module.exports = reviewsDataModel;
