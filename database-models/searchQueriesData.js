const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const searchQueriesSchema = new Schema({
  searchInput: {
    type: String,
    required: true,
  },
});

const searchQueriesDataModel = model("searchQueriesData", searchQueriesSchema);

module.exports = searchQueriesDataModel;
