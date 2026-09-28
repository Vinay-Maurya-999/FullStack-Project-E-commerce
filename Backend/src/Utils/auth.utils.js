import jwt from "jsonwebtoken";
import config from "../Config/configUrl.js";

export const GenerateToken = async ({ userId, role }) => {
  // Generate access token
  const AccessToken = jwt.sign({ userId, role }, config.access_token, {
    expiresIn: "15m",
  });

  // Generate refresh token
  const RefreshToken = jwt.sign({ userId, role }, config.refresh_token, {
    expiresIn: "7d",
  });

  return {
    AccessToken,
    RefreshToken,
  };
};

export const readAccesstoken = (Token) => {
  const readAccess = jwt.verify(Token, config.access_token);
  return readAccess;
};

export const readRefreshtoken = (Token) => {
  const readRefresh = jwt.verify(Token, config.refresh_token);
  return readRefresh;
};
