const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
// const reviewsDataModel = require("./database-models/reviewsData");
// const { reviewsDataObject, paymentsDataObject } = require("./usersObject");
// const paymentsDataModel = require("./database-models/paymentsData");
// const servicesCategoryDataModel = require("./database-models/servicesCategory");
// const { servicesCategoryObject, servicesDataObject } = require("./usersObject");
// const servicesDataModel = require("./database-models/servicesData");
// const usersDataModel = require("./database-models/registeredUsers");
// const { usersObjectData } = require("./usersObject");

const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config({ path: "./.env" });
app.use(helmet());

const port = 5030 || process.env.PORT;

mongoose
  .connect(process.env.MONGO_CONNECTION_URL)
  .then(() => console.log("Db Connected"))
  .catch((error) => console.log(error.message));

app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));

// const addUsers = async (data) => {
//   try {
//     const user = new paymentsDataModel({
//       userId: data.userId,
//       serviceId: data.serviceId,
//       paymentId: data.paymentId,
//       status: data.status,
//       price: data.price,
//       dateOfPayment: new Date(Date.now()),
//     });

//     await user.save();
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// for (let data of paymentsDataObject) {
//   addUsers(data);
// }

app.listen(port, () => {
  console.log(`Server is Running at port ${port}`);
});
