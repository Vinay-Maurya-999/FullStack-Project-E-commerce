import productModel from "../Models/Product.model.js";
import { uploadImage } from "../Services/Strorage.service.js";
import mongoose from "mongoose";

// POST /api/products
// Authenticated API
// Create a new product with images, title, description, price, and sizes

export const CreateProduct = async (req, res) => {
  const filesurl = [];

  for (let i = 0; i < req.files.length; i++) {
    const response = await uploadImage({
      Buffer: req.files[i].buffer,
      fileName: req.files[i].originalname,
    });
    filesurl.push(response.url);
  }

  const product = await productModel.create({
    title: req.body.title,
    description: req.body.description,
    price: {
      amount: req.body.price.amount,
      currency: req.body.price.currency,
    },
    sizes: req.body.sizes,
    images: filesurl,
    seller: req.user.userId,
  });

  res.status(201).json({
    message: "Product created successfully",
    data: {
      product,
    },
  });
};

// GET /api/products
// Public API
// Fetch all products

export const ProducFetch = async (req, res) => {
  const products = await productModel.find();

  res.status(200).json({
    message: "Products data fetched successfully",
    data: {
      products,
    },
  });
};

// GET /api/products/:id
// Public API
// Fetch a single product by ID

export const SingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// PUT /api/products/:id
// Authenticated API
// Update a product by ID

export const UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const { title, description, price, sizes } = req.body;

    if (title !== undefined) {
      product.title = title;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (price !== undefined) {
      product.price = price;
    }

    if (sizes !== undefined) {
      product.sizes = sizes;
    }

    const updatedProduct = await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE /api/products/:id
// Authenticated API
// Delete a product by ID

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const DeleteProduct = await productModel.findById(id);

    if (!DeleteProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await productModel.deleteOne({ _id: id });

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("DELETE PRODUCT API ---> ", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
