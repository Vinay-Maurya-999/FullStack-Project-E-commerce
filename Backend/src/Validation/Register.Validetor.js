import { body, validationResult } from "express-validator";

export const registerValidator = [
  // Validate name
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 2 })
    .withMessage("Name must be between 2 and 15 characters")
    .bail(),

  // Validate email
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Please enter a valid email")
    .bail()
    .normalizeEmail(),

  // Validate password
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6, max: 50 })
    .withMessage("Password must be between 6 and 50 characters")
    .bail(),

  // Validate confirm password
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }

      return true;
    })
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid Request",
        errors: errors.array(),
      });
    }
    next();
  },
];
