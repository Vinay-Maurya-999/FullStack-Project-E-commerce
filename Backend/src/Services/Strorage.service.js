import ImageKit, { toFile } from "@imagekit/nodejs";
import config from "../Config/configUrl.js";

const imagekit = new ImageKit({
  privateKey: config.imagekit_private,
});

export const uploadImage = async ({ Buffer, fileName }) => {
  try {
    const response = await imagekit.files.upload({
      file: await toFile(Buffer),
      fileName: fileName,
      folder: "snitch-ecommerce",
    });

    return response;
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw error;
  }
};
