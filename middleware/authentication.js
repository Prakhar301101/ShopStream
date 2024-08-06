//User Authentication middleware

const jwt = require('jsonwebtoken');
const user = require('../models/User');

const verifyAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      const userId = decoded.id;
      req.user = await user.findById(userId).select('-password');
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized,no token' });
  }
};

module.exports=verifyAuth;
