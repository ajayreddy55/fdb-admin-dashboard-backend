const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const adminDataSchema = new Schema({
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
  password: {
    type: String,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  isPhoneNumberVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const adminDataModel = model("adminData", adminDataSchema);

module.exports = adminDataModel;
