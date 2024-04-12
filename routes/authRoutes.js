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

router.get("/profile-admin/:id", jwtAuthAdmin, async (request, response) => {
  const { adminId } = request.params;
  let userInfo = await adminDataModel.findOne({ _id: adminId });

  response.status(200).json(userInfo);
});

module.exports = router;
