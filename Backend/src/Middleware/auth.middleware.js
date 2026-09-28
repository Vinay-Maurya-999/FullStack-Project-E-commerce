import { decode } from "jsonwebtoken";
import { readAccesstoken } from "../Utils/auth.utils.js";

export const authverify = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "Access token is required",
      });
    }

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({
        message: "Invalid authorization header",
      });
    }

    const decoded = readAccesstoken(accessToken);

    req.user = decoded;

    console.log(decoded);

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};
