  const express = require("express");
  const router = express.Router(); 



const authController =require('../controllers/userController')


router.get("/index-view", authController.loadSignUp);
router.post("/index-view", authController.signUp);
router.get("/homepage",authController.loadHome)



module.exports = router;