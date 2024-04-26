const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const paymentsDataSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  dateOfPayment: {
    type: Date,
    required: true,
  },
});

const paymentsDataModel = model("paymentsData", paymentsDataSchema);

module.exports = paymentsDataModel;
