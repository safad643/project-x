const bcrypt = require("bcrypt");
const userSchema = require("../models/User");
const { generateOTPToken } = require("../config/jwt");
const jwt = require('jsonwebtoken');

const { verifyOTPToken } = require('../config/jwt');
const cookieParser = require("cookie-parser");

const { generateOTP, sendOtpEmail } = require("./helpers");

const loadSignUp = (req, res) => {
  res.status(200).render("pages/index");
};

const loadHome = (req, res) => {
  res.status(200).render("pages/homepage");
};

const signUp = async (req, res) => {
  try {
  

    if (req.body.name === "login") {
      console.log("login");

       const { email, password } = req.body;
    
  
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
   
    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
   
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token
      });
    }


// =================================================
    if (req.body.name === "signUp") {
      console.log("signUp");

      const {
        fullName,
        email,
        password,
        confirmPassword,
        subscriptionIn ,
      } = req.body;

      const otp = generateOTP();

      const otpToken = generateOTPToken(email, otp, "signup");
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await new userSchema({
        email,
        password: hashedPassword,
        name:fullName,
      }).save();

     

      res.cookie('otpToken', otpToken, {
      httpOnly: true,
      email:email,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60 * 1000 
    });

      sendOtpEmail(email, otp);


      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: "aswin",
      });
    }

// =================================================
    if (req.body.name === "otp") {
      console.log(req.body);

       const { otp: userEnteredOTP } = req.body;
    const otpToken = req.cookies.otpToken;

    if (!otpToken) {
      req.flash("error", "OTP session expired. Please try again.");
      return res.status(400).redirect("/index-view");
    }

    
    const decoded = verifyOTPToken(otpToken);
    
    if (!decoded) {
      req.flash("error", "Invalid or expired OTP token.");
      return res.status(400).redirect("/signup");
    }
 
    const { email, otp: storedOTP, type } = decoded;
console.log(userEnteredOTP,storedOTP,email);


   
    if (userEnteredOTP != storedOTP) {
        console.log("mmm");
        
      req.flash("error", "Invalid OTP. Please try again.");
      return res.status(400).redirect("/index-view");
    }

    
  const User = await userSchema.findOne({ email });
  console.log(User);
  User.email_verifired = true
    await User.save()
  
    res.clearCookie('otpToken');

        const token = jwt.sign(
        { id: User._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: "aswin",
      });
    }

   
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send("Server Error");
  }
};




const Logout = (req, res) => {
  req.session.destroy();
  res.status(302).redirect("/");
};

const loadOtp = (req, res) => {
  res.status(200).render("user/otpverify", { OTP: req.flash("OTP") });
};

const resendOtp = async (req, res) => {
  const newOtp = generateOTP();
  req.session.otp = newOtp;
  req.session.timestamp = Date.now();
  await sendOtpEmail(req.session.details?.email, newOtp);
  res.status(302).redirect("/otp");
};


const logOut = async(req,res)=>{
    res.clearCookie("token");
  res.redirect("/index-view");
}
module.exports = {
  loadSignUp,
  signUp,
  loadSignIn,
  logOut,
  loadOtp,
  resendOtp,
  loadHome,
};
