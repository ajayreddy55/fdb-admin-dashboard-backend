const express = require("express");
const mongoose = require("mongoose");
const usersDataModel = require("../database-models/registeredUsers");
const activeUsersDataModel = require("../database-models/activeUsers");
const usersSessionDataModel = require("../database-models/userSessionDur");
const jwtAuthAdmin = require("../middleware/jwtAuthAdmin");

const router = express.Router();

router.post("/user-data", jwtAuthAdmin, async (request, response) => {
  try {
    const { dateRegistered, name } = request.body;

    const user = new usersDataModel({
      name: name,
      dateRegistered: new Date(dateRegistered),
    });

    await user.save();
    return response.status(200).json({ message: "User Added Successfully" });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

router.get(
  "/user-count-registered",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      await usersDataModel
        .aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$dateRegistered" },
              },
              registeredUsersCount: { $count: {} },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ])
        .then((dataObject) => {
          return response.status(200).json({ usersCount: dataObject });
        })
        .catch((error) => {
          console.log(error.message);
          return response.status(400).json({ message: "Something Went Wrong" });
        });
    } catch (error) {
      console.log(error.message);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/count-all-reg-users", jwtAuthAdmin, async (request, response) => {
  try {
    await usersDataModel
      .countDocuments()
      .then((dataObject) => {
        return response.status(200).json({ usersCount: dataObject });
      })
      .catch((error) => {
        console.log(error.message);
        return response.status(400).json({ message: "Something Went Wrong" });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

router.get(
  "/user-active-count-graph",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      await activeUsersDataModel
        .aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$dateActive" },
              },
              activeUsersCount: { $count: {} },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ])
        .then((dataObject) => {
          return response.status(200).json({ activeUsersCount: dataObject });
        })
        .catch((error) => {
          console.log(error.message);
          return response.status(400).json({ message: "Something Went Wrong" });
        });
    } catch (error) {
      console.log(error.message);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get(
  "/count-all-active-users",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      await activeUsersDataModel
        .distinct("userId")
        .then((dataObject) => {
          return response.status(200).json({ usersCount: dataObject.length });
        })
        .catch((error) => {
          console.log(error.message);
          return response.status(400).json({ message: "Something Went Wrong" });
        });
    } catch (error) {
      console.log(error.message);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get(
  "/user-avg-session-graph",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      await usersSessionDataModel
        .aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$sessionDate" },
              },
              avgUsersDuration: { $avg: "$sessionDuration" },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ])
        .then((dataObject) => {
          return response.status(200).json({ avgUsersDuration: dataObject });
        })
        .catch((error) => {
          console.log(error.message);
          return response.status(400).json({ message: "Something Went Wrong" });
        });
    } catch (error) {
      console.log(error.message);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/user-avg-all-session", jwtAuthAdmin, async (request, response) => {
  try {
    await usersSessionDataModel
      .aggregate([
        {
          $group: {
            _id: null,
            avgUsersDuration: { $avg: "$sessionDuration" },
          },
        },
      ])
      .then((dataObject) => {
        return response.status(200).json({ avgUsersDuration: dataObject });
      })
      .catch((error) => {
        console.log(error.message);
        return response.status(400).json({ message: "Something Went Wrong" });
      });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
