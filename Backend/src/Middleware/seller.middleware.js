export const isSeller = (req, res, next) => {
  if (req.user.role != "seller") {
    return res.status(403).json({
      massage: "user is not authorize to create products",
    });
  }
  next();
};
