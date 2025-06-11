const bcrypt = require("bcrypt");
const userSchema = require("../models/User");
const { generateOTPToken } = require("../config/jwt");
const jwt = require("jsonwebtoken");

const { verifyOTPToken } = require("../config/jwt");
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
      console.log(user);

      if (!user) {
        return res
          .status(200)
          .json({ success: false, message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(200)
          .json({ success: false, message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      });
    }

    // =================================================
    if (req.body.name === "signUp") {
      console.log("signUp");

      const { fullName, email, password, confirmPassword, subscriptionIn } =
        req.body;

      const existingUser = await userSchema.findOne({ email });
      console.log(existingUser);

      if (existingUser && existingUser.email_verifired) {
         return res
          .status(200)
          .json({ success: false, message: "User already exists." });
      }

      if(password !== confirmPassword){
         return res
          .status(200)
          .json({ success: false, message: "password not match" });

      }

      if (password.length < 8) {
  return res
    .status(200)
    .json({ success: false, message: "Password must be at least 8 characters long" });
}

      const otp = generateOTP();

      const otpToken = generateOTPToken(email, otp, "signup");
      const hashedPassword = await bcrypt.hash(password, 10);

      if(!existingUser){
           const newUser = await new userSchema({
        email,
        password: hashedPassword,
        name: fullName,
      }).save();

      }
      

      res.cookie("otpToken", otpToken, {
        httpOnly: true,
        email: email,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1 * 60 * 1000,
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
        return res
          .status(200)
          .json({ success: false, message: "OTP Not Sended " });
      }

      const decoded = verifyOTPToken(otpToken);

      if (!decoded) {
        return res
          .status(200)
          .json({ success: false, message: "Invalid or expired OTP token." });
      }

      const { email, otp: storedOTP, type } = decoded;
      console.log(userEnteredOTP, storedOTP, email);

      if (userEnteredOTP != storedOTP) {
        console.log("mmm");

        return res
          .status(200)
          .json({ success: false, message: "Invalid or expired OTP token." });
      }

      const User = await userSchema.findOne({ email });
      console.log(User);
      User.email_verifired = true;
      await User.save();

      res.clearCookie("otpToken");

      const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
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





const resendOtp = async (req, res) => {
 try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.email_verifired) {
      return res.status(400).json({ success: false, message: "Email already verified" });
    }

    const newOtp = generateOTP();
    const newOtpToken = generateOTPToken(email, newOtp, "signup");

    res.cookie("otpToken", newOtpToken, {
      httpOnly: true,
      email: email,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 60 * 1000,
    });

    await sendOtpEmail(email, newOtp);

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email",
    });

  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resending the OTP",
    });
  }
};

const logOut = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};
module.exports = {
  loadSignUp,
  signUp,
  logOut,
  resendOtp,
  loadHome,
};
