import { Router } from "express";
import { authverify } from "../Middleware/auth.middleware.js";
import { isSeller } from "../Middleware/seller.middleware.js";
import { upload } from "../Config/Multer.js";
import { ProductValidator } from "../Validation/Product.validator.js";
import {
  CreateProduct,
  ProducFetch,
  SingleProduct,
  UpdateProduct,
  deleteProduct,
} from "../Controller/Product.controller.js";

const productRoutes = Router();

/**
 * @method POST
 * @route /api/products/
 * @description creates the product and save its data into the DB, images will be store on imagekit.
 * @access seller
 * req.body=>{title,description:price:{amount,currency},sizes:[{size,stock},{si–ze,stock}]}
 */
productRoutes.post(
  "/",
  authverify,
  isSeller,
  upload.array("images"),
  (req, res, next) => {
    if (typeof req.body.price === "string") {
      req.body.price = JSON.parse(req.body.price);
    }

    if (typeof req.body.sizes === "string") {
      req.body.sizes = JSON.parse(req.body.sizes);
    }
    next();
  },
  ProductValidator,
  CreateProduct,
);

productRoutes.get("/", ProducFetch);
productRoutes.get("/:id", SingleProduct);
productRoutes.put("/:id", authverify, isSeller, UpdateProduct);
productRoutes.delete("/:id", authverify, isSeller, deleteProduct);
export default productRoutes;
