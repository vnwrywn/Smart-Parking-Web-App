export const requireAdmin = (req, res, next) => {
  if (!req.session.adminId)
    return res.status(403).json({ status: "error", message: "Forbidden." });
  next();
};
