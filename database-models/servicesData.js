const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const servicesDataSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    required: true,
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  dateRegistered: {
    type: Date,
    required: true,
  },
});

const servicesDataModel = model("servicesData", servicesDataSchema);

module.exports = servicesDataModel;
