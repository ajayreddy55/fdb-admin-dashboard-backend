const express = require("express");
const mongoose = require("mongoose");
const {
  signup,
  adminSignupMailVerify,
  adminLogin,
} = require("../controller/controller");
const adminDataModel = require("../database-models/adminData");
const jwtAuthAdmin = require("../middleware/jwtAuthAdmin");

const router = express.Router();

router.post("/register-admin", signup);

router.post("/verify-admin-email", adminSignupMailVerify);

router.post("/login-admin", adminLogin);

router.get("/profile-admin", jwtAuthAdmin, async (request, response) => {
  try {
    const { adminId } = request;
    let userInfo = await adminDataModel
      .findOne({ _id: adminId })
      .then((dataObject) => {
        return response.status(200).json({ adminData: dataObject });
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
