const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
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
//     const user = new usersSessionDataModel({
//       userId: data.userId,
//       sessionDate: new Date(data.sessionDate),
//       sessionDuration: Number(data.sessionDuration),
//     });

//     await user.save();
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// for (let data of usersSessionData) {
//   addUsers(data);
// }

app.listen(port, () => {
  console.log(`Server is Running at port ${port}`);
});
