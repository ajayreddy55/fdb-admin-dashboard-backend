const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const activeUsersDataSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  dateActive: {
    type: Date,
    required: true,
  },
});

const activeUsersDataModel = model("activeUsersData", activeUsersDataSchema);

module.exports = activeUsersDataModel;
