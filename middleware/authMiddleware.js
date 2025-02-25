const { decodeToken } = require("../utils/jwt/jwt.utils");

const validateAndDecodeToken = ({ req }) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return null;
    }
    return decodeToken(token);

  } catch (error) {
    return null;
  }
}

module.exports = {
  validateAndDecodeToken,
};
