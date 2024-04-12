const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const usersSessionDataSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  sessionDate: {
    type: Date,
    required: true,
  },
  sessionDuration: {
    type: Number,
    required: true,
  },
});

const usersSessionDataModel = model("usersSessionData", usersSessionDataSchema);

module.exports = usersSessionDataModel;
