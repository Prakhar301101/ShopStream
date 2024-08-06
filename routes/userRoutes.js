const express=require('express');
const router=express.Router();
const verifyAuth=require('../middleware/authentication');
const userController=require('../controllers/userController');

router.post('/api/user/register',userController.registerUser);
router.post('/api/user/login',userController.loginUser);
router.post('/api/user/logout',verifyAuth,userController.logoutUser)
router.get('/api/user/me',verifyAuth,userController.getDetails);
router.put('/api/user/update',verifyAuth,userController.updateDetails)

module.exports = router;
