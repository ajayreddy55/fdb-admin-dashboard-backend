const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
// const serviceClicksDataModel = require("./database-models/clicksData");
// const { clicksDataObject, viewsDataObject } = require("./usersObject");
// const serviceViewsDataModel = require("./database-models/viewsData");
// const popularCategoriesModel = require("./database-models/popularCategoriesData");
// const { popularCategoriesData, searchQueriesData } = require("./usersObject");
// const searchQueriesDataModel = require("./database-models/searchQueriesData");
// const activeUsersDataModel = require("./database-models/activeUsers");
// const { usersActiveObjectData, usersSessionData } = require("./usersObject");
// const usersSessionDataModel = require("./database-models/userSessionDur");

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
//     const user = new serviceViewsDataModel({
//       userId: data.userId,
//       serviceId: data.serviceId,
//       dateViewed: new Date(data.dateViewed),
//     });

//     await user.save();
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// for (let data of viewsDataObject) {
//   addUsers(data);
// }

app.listen(port, () => {
  console.log(`Server is Running at port ${port}`);
});
