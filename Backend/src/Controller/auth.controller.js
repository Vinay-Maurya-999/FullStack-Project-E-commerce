import UserModel from "../Models/auth.model.js";
import bcrypt from "bcryptjs";
import { GenerateToken, readRefreshtoken } from "../Utils/auth.utils.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

/**
 *@apitake -> { name, email, password, confirmPassword }
 *@api POST -> /api/auth/register
 *@description Register user in dataBase.
 */

export async function Register(req, res) {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Check all fields
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const { AccessToken, RefreshToken } = await GenerateToken({
      userId: user._id,
      role: user.role,
    });

    res.cookie("refreshToken", RefreshToken, {
      ...refreshCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await UserModel.findByIdAndUpdate(user._id, {
      refreshToken: RefreshToken,
    });

    return res.status(201).json({
      message: "User registered successfully",
      data: {
        user: {
          email: user.email,
          name: user.name,
          id: user._id,
          role: user.role,
        },
        AccessToken,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/**
 * @description Login api for login user in their account
 * @api POST -> /api/auth/login
 * @require -> {email,password}
 */

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "Email or Password is incorrect...",
    });
  }

  const passwordCheck = await bcrypt.compare(password, user.password);

  if (!passwordCheck) {
    return res.status(401).json({
      message: "Email or Password is incorrect...",
    });
  }

  const { AccessToken, RefreshToken } = await GenerateToken({
    userId: user._id,
    role: user.role,
  });

  res.cookie("refreshToken", RefreshToken, {
    ...refreshCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  await UserModel.findByIdAndUpdate(user._id, {
    refreshToken: RefreshToken,
  });

  res.status(201).json({
    message: "User login successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      AccessToken,
    },
  });
};

/**?
 * @description getme api for get user
 * @api POST -> /api/auth/me
 * @require -> {email , password}
 */

export const me = async (req, res) => {
  const data = req.user;

  const user = await UserModel.findById(data.userId);

  res.status(200).json({
    message: "User data fetch successfully",
    data: {
      user: {
        email: user.email,
        name: user.name,
        id: user._id,
        role:user.role
      },
    },
  });
};

/**
 * @description refreshtoken api to regenrate new access token and refresh token
 * @api POST -> /api/auth/refresh-token
 * @require -> {RefreshToken...Only}
 */

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      massage: "RefreshToken not found...",
    });
  }

  try {
    const decoded = readRefreshtoken(refreshToken);

    const user = await UserModel.findById(decoded.userId);

    if (refreshToken != user.refreshToken) {
      await UserModel.findByIdAndUpdate(user._id, {
        refreshToken: null,
      });
      return res.status(401).json({
        message: "Refresh token mismatch",
      });
    }

    const { AccessToken, RefreshToken } = await GenerateToken({
      userId: user._id,
      role: user.role,
    });

    res.cookie("refreshToken", RefreshToken, {
      ...refreshCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await UserModel.findByIdAndUpdate(user._id, {
      refreshToken: RefreshToken,
    });

    res.status(200).json({
      message: "Tokens rotated successfully.",
      data: {
        user: {
          email: user.email,
          name: user.name,
          id: user._id,
          role: user.role,
        },
        AccessToken,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      massage: "Refresh not performed...",
    });
  }
};

/**
 * @description Log out the user from this API
 * @api POST -> /api/auth/logout
 * @require -> {RefreshToken...Only}
 */

export const logout = async (req, res) => {
  try {
    const userId = req.user.userId;
    await UserModel.findByIdAndUpdate(userId, {
      refreshToken: null,
    });

    res.clearCookie("refreshToken", refreshCookieOptions);

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
