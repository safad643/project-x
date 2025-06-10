  const express = require("express");
  const router = express.Router(); 


const authMiddleware=require("../middleware/auth")
const authController =require('../controllers/userController')


router.get("/index-view", authMiddleware.preventAuthAccess, authController.loadSignUp);
router.post("/index-view", authMiddleware.preventAuthAccess,authController.signUp);
router.get("/",authMiddleware.protect,authController.loadHome)
router.get("/logout",authController.logOut)



module.exports = router;