const jwt = require("jsonwebtoken");

const jwtAuthAdmin = (request, response, next) => {
  let jwtToken;

  const authHeaders = request.headers["authorization"];

  if (authHeaders !== undefined) {
    jwtToken = authHeaders.split(" ")[1];
  }

  if (authHeaders === undefined) {
    return response.status(401).json({ message: "No JWT token provided" });
  } else {
    jwt.verify(jwtToken, "FDB_ADMIN_LOGIN", async (error, payload) => {
      if (error) {
        return response.status(401).json({ message: "Invalid JWT token" });
      } else {
        request.adminId = payload.id;
        next();
      }
    });
  }
};

module.exports = jwtAuthAdmin;
