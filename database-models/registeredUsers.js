const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const usersDataSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dateRegistered: {
    type: Date,
    required: true,
  },
});

const usersDataModel = model("usersData", usersDataSchema);

module.exports = usersDataModel;
