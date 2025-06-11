  const express = require("express");
  const router = express.Router(); 


const authMiddleware=require("../middleware/auth")
const authController =require('../controllers/userController')


router.get("/login", authMiddleware.preventAuthAccess, authController.loadSignUp);
router.post("/login", authMiddleware.preventAuthAccess,authController.signUp);
router.get("/",authMiddleware.protect,authMiddleware.preventCache,authController.loadHome)
router.get("/logout",authController.logOut)
router.post("/rent_otp",authController.resendOtp)



module.exports = router;