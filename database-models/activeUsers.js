const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const activeUsersDataSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  dateActive: {
    type: Date,
    required: true,
  },
});

const activeUsersDataModel = model("activeUsersData", activeUsersDataSchema);

module.exports = activeUsersDataModel;
