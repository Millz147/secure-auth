//Modules
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

//Model
const userModel = require("../models/user.model");

//Main Class
class users {
  //Signup Inputs Validator
  static signupValidator = [
    check("email")
      .notEmpty()
      .withMessage("Email Cannot Be Empty")
      .isEmail()
      .withMessage("Invalid Email Input"),
    check("fullname")
      .notEmpty()
      .withMessage("Fullname cannot be empty")
      .isLength({ min: 5 })
      .withMessage("Fullname Should be Upto 5 Letters")
      .isString()
      .withMessage("Fullname Must Contain Only String Values"),
    check("gender")
      .isIn(["M", "F", "Male", "Female"])
      .withMessage("Gender Should be Male/Female")
      .notEmpty()
      .withMessage("Gender is Required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password Must be Minimum of 6 Characters")
      .notEmpty()
      .withMessage("Password is required"),
    check("username")
      .isAlphanumeric()
      .withMessage("Username Must Contain Only Alphanumeric, No Space")
      .notEmpty()
      .withMessage("Username Cannot be Empty"),
  ];
  //Login Inputs Validator
  static loginValidator = [
    check("email")
      .isEmail()
      .withMessage("Invalid Email Address!!!")
      .notEmpty()
      .withMessage("Email Cannot be Empty"),
    check("password").notEmpty().withMessage("Password Cannot Be Empty"),
  ];
  //Authentication
  static auth = async (req, res, next) => {
    let inputToken = await req.cookies.userToken;

    try {
      if (inputToken != null) {
        await jwt.verify(inputToken, process.env.JWT_SECRET, (err, User) => {
          if (err) {
            res.json("Invalid Token");
            return;
          }
          req.user = User;
          return next();
        });
      } else {
        return res.status(500).json("Please go back and Login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Availability
  static avail = async (req, res, next) => {
    //Email Availability
    const verEmail = await userModel.findOne({ email: req.body.email });
    if (verEmail) {
      res.status(500).json("Email already Exist");
      return;
    }
    //Username Availability
    const verUsername = await userModel.findOne({
      username: req.body.username,
    });
    if (verUsername) {
      res.status(500).json("Username is Taken");
      return;
    }
    return next();
  };
}

module.exports = users;
