const bcrypt = require("bcrypt");
const userSchema = require("../models/User");
const { generateOTPToken } = require("../config/jwt");
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
    console.log("jjjj");

    if (req.body.name === "login") {
      console.log("login");

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: "aswin",
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
      return res.status(400).redirect("/signup");
    }

    
    const decoded = verifyOTPToken(otpToken);
    
    if (!decoded) {
      req.flash("error", "Invalid or expired OTP token.");
      return res.status(400).redirect("/signup");
    }

    const { email, otp: storedOTP, type } = decoded;
console.log(userEnteredOTP,storedOTP);

   
    if (userEnteredOTP != storedOTP) {
        console.log("mmm");
        
      req.flash("error", "Invalid OTP. Please try again.");
      return res.status(400).redirect("/index-view");
    }

   
  
    res.clearCookie('otpToken');


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

const loadSignIn = (req, res) => {
  res.status(200).render("user/usersignin", {
    error: req.flash("error"),
    googleClientId: process.env.GOOGLE_CLIENT_ID,
  });
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) {
      req.flash("error", "User not found!");
      return res.status(404).redirect("/signin");
    }

    if (user.isBan) {
      req.flash("error", "User Banned By Admin!");
      return res.status(403).redirect("/signin");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      req.flash("error", "Incorrect Password!");
      return res.status(401).redirect("/signin");
    }

    req.session.details = { email };
    req.session.logged = true;
    res.status(302).redirect("/");
  } catch (error) {
    console.error("Signin error:", error);
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

module.exports = {
  loadSignUp,
  signUp,
  loadSignIn,
  signIn,
  Logout,
  loadOtp,
  resendOtp,
  loadHome,
};
