import dotenv from "dotenv";

dotenv.config();

const config = {
  mongoose_url: process.env.MONGOOSE_URL,
  access_token: process.env.ACCESSTOKEN,
  refresh_token: process.env.REFRESHTOKEN,
  PORT: process.env.PORT,
  imagekit_public: process.env.IMG_PUBLIC,
  imagekit_private: process.env.IMG_PRIVATE,
  imagekit_end_point: process.env.IMG_END_POINT,
};

export default config;
