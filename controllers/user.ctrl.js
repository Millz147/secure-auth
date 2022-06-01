const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

//Model
const userModel = require("../models/user.model");


dotenv.config();

class user {
  //Main Class
  static signUp = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const validator = errors.errors.map((err) => err.msg);

        res.status(500).json({ error: validator });
        return;
      }

      let { fullname, username, gender, email, password } = req.body;

      let hashedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.CRYPTO_SECRET
      ).toString();

      let regUser = await new userModel({
        fullname,
        username,
        gender,
        email,
        password: hashedPassword,
      });

      regUser = regUser.save();

      res.status(200).json("User Successfully Registered");
    } catch (error) {
      console.log(error.message);
    }
  };
  //Login Ctrl
  static login = async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const validator = errors.errors.map((err) => err.msg);
        res.status(400).json({ error: validator });
        return;
      }
      const validInfo = await userModel.findOne({
        email: req.body.email,
      });
      if (!validInfo) {
        res.status(500).json("Invalid Email Address");
        return;
      }

      let OriginalPassword = CryptoJS.AES.decrypt(
        validInfo.password,
        process.env.CRYPTO_SECRET
      ).toString(CryptoJS.enc.Utf8);
      OriginalPassword !== req.body.password &&
        res.status(500).json("Invalid Password");

      const Token = jwt.sign(
        { email: validInfo.email, password: OriginalPassword },
        process.env.JWT_SECRET,
        { expiresIn: "30 days" }
      );
      res.cookie("userToken", Token, {
        httpOnly: true,
        secure: false,
        maxAge: 300000,
      });

      console.log("User Registered");

      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  //Logout Ctrl
  static logout = async (req, res) => {
    try {
      return res.clearCookie("userToken").json("Successfully Logout");
    } catch (error) {
      console.log("error: " + error.code);
    }
  };
  //Dashboard Ctrl
  static dashboard = (req, res) => {
    res.json("Welcome " + req.user.email);
  };
}

module.exports = user;
