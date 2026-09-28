import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [15, "Name must not exceed 15 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "seller"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  refreshToken: {
    type: String,
    default: null,
  },
});

const UserModel = mongoose.model("Users", userSchema);

export default UserModel;
