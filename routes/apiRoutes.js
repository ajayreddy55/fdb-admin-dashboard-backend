const express = require("express");
const mongoose = require("mongoose");
const usersDataModel = require("../database-models/registeredUsers");
const activeUsersDataModel = require("../database-models/activeUsers");
const usersSessionDataModel = require("../database-models/userSessionDur");
const jwtAuthAdmin = require("../middleware/jwtAuthAdmin");
const popularCategoriesModel = require("../database-models/popularCategoriesData");
const searchQueriesDataModel = require("../database-models/searchQueriesData");
const serviceClicksDataModel = require("../database-models/clicksData");
const serviceViewsDataModel = require("../database-models/viewsData");
const servicesDataModel = require("../database-models/servicesData");
const servicesCategoryDataModel = require("../database-models/servicesCategory");
const reviewsDataModel = require("../database-models/reviewsData");
const paymentsDataModel = require("../database-models/paymentsData");

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
  "/get-all-reg-users-data",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      const { limit = 10, offset = 0 } = request.query;

      await usersDataModel
        .find()
        .limit(limit)
        .skip(offset)
        .then((dataObject) => {
          return response.status(200).json({ usersData: dataObject });
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

router.get(
  "/popular-categories-admin",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      await popularCategoriesModel
        .find()
        .then((dataObject) => {
          return response.status(200).json({ popularCategories: dataObject });
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

router.get("/search-queries-admin", jwtAuthAdmin, async (request, response) => {
  try {
    await searchQueriesDataModel
      .find()
      .then((dataObject) => {
        return response.status(200).json({ searchQueries: dataObject });
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

router.get("/vendor-clicks-count", async (request, response) => {
  try {
    await serviceClicksDataModel
      .countDocuments()
      .then((dataObject) => {
        return response.status(200).json({ clicksCount: dataObject });
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

router.get("/vendor-views-count", async (request, response) => {
  try {
    await serviceViewsDataModel
      .countDocuments()
      .then((dataObject) => {
        return response.status(200).json({ viewsCount: dataObject });
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

router.get("/vendor-service-clicks-graph", async (request, response) => {
  try {
    await serviceClicksDataModel
      .aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$dateClicked" },
            },
            clicksCount: { $count: {} },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .then((dataObject) => {
        return response.status(200).json({ clickCount: dataObject });
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

router.get("/vendor-service-views-graph", async (request, response) => {
  try {
    await serviceViewsDataModel
      .aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$dateViewed" },
            },
            viewsCount: { $count: {} },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .then((dataObject) => {
        return response.status(200).json({ viewsCount: dataObject });
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
  "/get-services-categories-data-admin",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      await servicesCategoryDataModel
        .find()
        .then((dataObject) => {
          return response
            .status(200)
            .json({ serviceCategoriesData: dataObject });
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
  "/get-services-all-data-admin",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      const {
        limit = 10,
        offset = 0,
        category = "",
        search = "",
      } = request.query;

      const queryObject = {};

      if (category !== "") {
        queryObject.categoryId = category;
      }

      if (search) {
        queryObject.name = { $regex: search, $options: "i" };
      }

      await servicesDataModel
        .find(queryObject)
        .limit(limit)
        .skip(offset)
        .then((dataObject) => {
          return response.status(200).json({ servicesData: dataObject });
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
  "/get-services-count-admin",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      const { category, search } = request.query;

      const queryObject = {};

      if (category !== "") {
        queryObject.categoryId = category;
      }

      if (search) {
        queryObject.name = { $regex: search, $options: "i" };
      }

      await servicesDataModel
        .countDocuments(queryObject)
        .then((dataObject) => {
          return response.status(200).json({ servicesCount: dataObject });
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

router.put(
  "/update-service-approval-admin/:serviceId",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      const { serviceId } = request.params;
      const { approvalStatus } = request.body;

      await servicesDataModel
        .updateOne(
          { _id: serviceId },
          { $set: { isApproved: !approvalStatus } }
        )
        .then((dataObject) => {
          return response.status(200).json({ message: "Status Updated" });
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
  "/get-services-review-data-admin",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      const {
        limit = 10,
        offset = 0,
        category = "",
        search = "",
      } = request.query;

      const queryObject = {};

      if (category !== "") {
        queryObject.categoryId = category;
      }

      if (search) {
        queryObject.name = { $regex: search, $options: "i" };
      }

      await servicesDataModel
        .find({ ...queryObject, isApproved: true })
        .limit(limit)
        .skip(offset)
        .then((dataObject) => {
          return response.status(200).json({ servicesData: dataObject });
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
  "/get-services-review-count-admin",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      const { category, search } = request.query;

      const queryObject = {};

      if (category !== "") {
        queryObject.categoryId = category;
      }

      if (search) {
        queryObject.name = { $regex: search, $options: "i" };
      }

      await servicesDataModel
        .countDocuments({ ...queryObject, isApproved: true })
        .then((dataObject) => {
          return response.status(200).json({ servicesCount: dataObject });
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
  "/get-user-data/:userId",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      const { userId } = request.params;

      await usersDataModel
        .findOne({ _id: userId })
        .then((dataObject) => {
          return response.status(200).json({ user: dataObject });
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
  "/get-service-data/:serviceId",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      const { serviceId } = request.params;

      await servicesDataModel
        .findOne({ _id: serviceId })
        .then((dataObject) => {
          return response.status(200).json({ service: dataObject });
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
  "/get-service-reviews-all-data/:serviceId",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      const { serviceId } = request.params;

      await reviewsDataModel
        .find({ serviceId: serviceId })
        .then((dataObject) => {
          return response.status(200).json({ reviews: dataObject });
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
  "/get-service-reviews-combined-all-data/:serviceId",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      const { serviceId } = request.params;
      await reviewsDataModel
        .aggregate([
          { $match: { serviceId: new mongoose.Types.ObjectId(serviceId) } },
          {
            $lookup: {
              from: "usersdatas",
              localField: "userId",
              foreignField: "_id",
              as: "userData",
            },
          },
          { $unwind: "$userData" },
          {
            $project: {
              _id: 1,
              review: 1,
              rating: 1,
              userId: 1,
              serviceId: 1,
              dateOfReview: 1,
              userName: "$userData.name",
              userEmail: "$userData.email",
            },
          },
        ])
        .then((dataObject) => {
          return response.status(200).json({ reviews: dataObject });
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
  "/get-service-payments-combined-all-data",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      const {
        category = "",
        search = "",
        limit = 10,
        offset = 0,
      } = request.query;

      const queryObject = {};

      if (category !== "") {
        queryObject.categoryId = category;
      }

      if (search) {
        queryObject.name = { $regex: search, $options: "i" };
      }

      await paymentsDataModel
        .aggregate([
          {
            $lookup: {
              from: "usersdatas",
              localField: "userId",
              foreignField: "_id",
              as: "userData",
            },
          },
          { $unwind: "$userData" },

          {
            $lookup: {
              from: "servicesdatas",
              localField: "serviceId",
              foreignField: "_id",
              pipeline: [{ $match: queryObject }],
              as: "serviceData",
            },
          },
          { $unwind: "$serviceData" },
          {
            $project: {
              _id: 1,
              userId: 1,
              serviceId: 1,
              paymentId: 1,
              status: 1,
              price: 1,
              dateOfPayment: 1,
              userName: "$userData.name",
              userEmail: "$userData.email",
              serviceName: "$serviceData.name",
              serviceSubcategory: "$serviceData.subCategory",
              serviceCategoryId: "$serviceData.categoryId",
            },
          },
          { $skip: Number(offset) },
          { $limit: Number(limit) },
        ])
        .then((dataObject) => {
          return response.status(200).json({ paymentsData: dataObject });
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
  "/get-service-payments-count-combined-all-data",
  jwtAuthAdmin,
  async (request, response) => {
    try {
      const { category = "", search = "" } = request.query;

      const queryObject = {};

      if (category !== "") {
        queryObject.categoryId = category;
      }

      if (search) {
        queryObject.name = { $regex: search, $options: "i" };
      }

      await paymentsDataModel
        .aggregate([
          {
            $lookup: {
              from: "usersdatas",
              localField: "userId",
              foreignField: "_id",
              as: "userData",
            },
          },
          { $unwind: "$userData" },

          {
            $lookup: {
              from: "servicesdatas",
              localField: "serviceId",
              foreignField: "_id",
              pipeline: [{ $match: queryObject }],
              as: "serviceData",
            },
          },
          { $unwind: "$serviceData" },
          {
            $project: {
              _id: 1,
              userId: 1,
              serviceId: 1,
              paymentId: 1,
              status: 1,
              price: 1,
              dateOfPayment: 1,
              userName: "$userData.name",
              userEmail: "$userData.email",
              serviceName: "$serviceData.name",
              serviceSubcategory: "$serviceData.subCategory",
              serviceCategoryId: "$serviceData.categoryId",
            },
          },
          { $count: "paymentsCount" },
        ])
        .then((dataObject) => {
          return response
            .status(200)
            .json({
              paymentsCount:
                dataObject.length !== 0 ? dataObject[0].paymentsCount : 0,
            });
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

module.exports = router;
