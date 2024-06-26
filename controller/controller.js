const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const nodemailer = require("nodemailer");
const { isValidPhoneNumber } = require("libphonenumber-js");
const adminDataModel = require("../database-models/adminData");

const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{6,12}$/;

  if (passwordRegex.test(password)) {
    return true;
  }

  return false;
};

const validatePhoneNumber = (number) => {
  const splitedNum = number.split("-");
  const joinedNum = splitedNum.join("");
  return isValidPhoneNumber(joinedNum);
};

const sendEmailToVerify = (mailContent, email, name, mailSubject) => {
  const transporter = nodemailer.createTransport({
    service: "outlook",
    secure: false,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.USER_EMAIL}`,
    to: `${email}`,
    subject: mailSubject,
    text: email,
    html: mailContent,
  };

  const messageRes = transporter
    .sendMail(message)
    .then((msg) => {
      console.log(msg);
    })
    .catch((error) => {
      console.log(error.message);
    });
  return;
};

const generateVerificationToken = (user) => {
  const emailVerificationToken = jwt.sign(
    { userId: user._id },
    process.env.EMAIL_VERIFICATION_TOKEN,
    { expiresIn: "1d" }
  );

  return emailVerificationToken;
};

exports.signup = async (request, response) => {
  const { email, password, name, phoneNumber } = request.body;
  if (!email) {
    return response.status(422).json({ message: "Email is Empty" });
  }

  try {
    const isMailExists = await adminDataModel.findOne({ email: email }).exec();
    const isPhoneNumberExists = await adminDataModel.findOne({
      phoneNumber: phoneNumber,
    });

    if (isMailExists) {
      return response.status(400).json({ message: "Email Already Exists" });
    } else if (isPhoneNumberExists) {
      return response
        .status(400)
        .json({ message: "Phone Number Already Exists" });
    } else {
      if (validator.isEmail(email) && validatePhoneNumber(phoneNumber)) {
        const isPasswordValid = validatePassword(password);
        if (isPasswordValid) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const userDetails = new adminDataModel({
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            password: hashedPassword,
          });

          const isSaved = await userDetails.save();

          const verificationToken = generateVerificationToken(isSaved);
          const mailContentFormat = `<p>Hi ${name}, Please Verify Your Mail. The token expires in 24 hours.</p><a href=${`http://localhost:3000/admin-signup-verify-page/${verificationToken}`}>Click Here</a>`;
          const mailSubject = "Regarding Your Mail Verification";
          sendEmailToVerify(mailContentFormat, email, name, mailSubject);
          return response
            .status(200)
            .json({ message: `Mail sent to ${email}, Please Verify` });
        } else {
          return response.status(400).json({
            message:
              "Password must contain at least one lowercase alphabet, uppercase alphabet, Numeric digit and special character, Length between 6 and 12",
          });
        }
      } else {
        return response.status(400).json({
          message: "Invalid Email or Phone Number",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

exports.adminSignupMailVerify = async (request, response) => {
  try {
    let jwtToken;

    const authHeaders = request.headers["authorization"];

    if (authHeaders !== undefined) {
      jwtToken = authHeaders.split(" ")[1];
    }

    if (authHeaders === undefined) {
      return response
        .status(401)
        .json({ message: "UnAuthorized Request, No Token Provided" });
    } else {
      jwt.verify(
        jwtToken,
        process.env.EMAIL_VERIFICATION_TOKEN,
        async (error, payload) => {
          if (error) {
            return response
              .status(401)
              .json({ message: "UnAuthorized Request, Token Invalid" });
          } else {
            const userResponse = await adminDataModel.findOne({
              _id: payload.userId,
            });

            if (userResponse) {
              await adminDataModel.updateOne(
                { _id: userResponse._id },
                { $set: { isEmailVerified: true } }
              );
              const mailContentFormat = `<p>Hi ${userResponse.name}, Your Mail Verification Success.</p>`;
              const mailSubject = "Regarding Your Mail Verification";
              sendEmailToVerify(
                mailContentFormat,
                userResponse.email,
                userResponse.name,
                mailSubject
              );
              return response
                .status(200)
                .json({ message: "Admin Mail Verification Success" });
            } else {
              return response
                .status(400)
                .json({ message: "Something Went wrong, Mail not Verified" });
            }
          }
        }
      );
    }
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

exports.adminLogin = async (request, response) => {
  try {
    const { email, password } = request.body;

    let checkUser = await adminDataModel.findOne({
      email: email,
    });

    if (checkUser !== null) {
      const comparePassword = await bcrypt.compare(
        password,
        checkUser.password
      );
      if (comparePassword) {
        const payload = {
          id: checkUser._id,
        };

        const jwtToken = jwt.sign(payload, "FDB_ADMIN_LOGIN", {
          expiresIn: "24hr",
        });

        return response
          .status(200)
          .json({ token: jwtToken, message: "Successfully Logged in" });
      } else {
        return response
          .status(400)
          .json({ message: "Please Enter Correct Password" });
      }
    } else {
      return response.status(400).json({ message: "Invalid Email" });
    }
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: "Internal server error" });
  }
};
