const user = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/user/register
// @access  Public

module.exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    console.log('Please provide all user details');
    res.status(400).json({ message: 'Please provide all user details' });
  }
  try {
    const userExists = await user.find({ username, email });
    if (userExists) {
      console.log('try different details');
      return res
        .status(400)
        .json({ message: 'User already exists, try with different details' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const userDoc = await user.create({
      username,
      password: hashedPass,
      email,
      role,
    });
    if (userDoc) {
      const token = generateToken(userDoc._id, userDoc.username, userDoc.role);
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      return res.status(200).json({
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
      });
    } else {
      return res.status(400).json({
        message: 'Invalid user',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    login user
// @route   POST /api/user/login
// @access  Public

module.exports.loginUser=async(req,res)=>{
    const { username, password } = req.body;
    if (!username || !password) {
      console.log('Please provide all user details');
      res.status(400).json({ message: 'Please provide all user details' });
    }
    try{
        const userDoc=await user.find({username});
        if (userDoc && (await bcrypt.compare(password, userDoc.password))) {
            const token = generateToken(userDoc._id, userDoc.name,userDoc.role);
            res.cookie('jwt', token, {
              expires: new Date(Date.now() + 25892000000),
              httpOnly: true,
              sameSite: 'none',
              secure: true,
            });
            return res.status(200).json({
              _id: user._id,
              name: user.name,
            });
          } else {
            return res.status(400).json({
              message: 'Invalid credentials',
            });
          }
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Server error' });    
    }
}


// @desc    logout user
// @route   POST /api/user/logout
// @access  Private

module.exports.logoutUser=async (req,res)=>{
        res.cookie('jwt', '', {
          httpOnly: true,
        })
        .json({message:'Logout Successful'});
    }

// @desc    Get user details
// @route   POST /api/user/me
// @access  Private

module.exports.getDetails=async (req,res)=>{
    try {
        const user = await user.findById(req.user.id);
        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }
        return res.status(200).json({
          email: user.email,
          username: user.name,
          id: user._id,
          role:user.role
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
}

// @desc    Update user details like (name and email)
// @route   POST /api/user/update
// @access  Private
module.exports.updateDetails=async (req,res)=>{
    const data=req.body;
    try {
        const userDoc = await user.findById(req.user.id);
        if (!userDoc) {
          return res.status(400).json({ message: 'User not found' });
        }
        if(data.username) userDoc.username=data.username;
        if(data.email) userDoc.email=data.email;
        await userDoc.save();
        res.status(200).json({message:'Changes saved successfully'});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
}


const generateToken = (id, name, role) => {
  return jwt.sign({ id, name, role }, process.env.SECRET, { expiresIn: '30d' });
};
