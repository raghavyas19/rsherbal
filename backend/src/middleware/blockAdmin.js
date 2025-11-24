module.exports = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return res.status(403).json({ message: 'Admins are not allowed to access this resource' });
  }
  next();
};
