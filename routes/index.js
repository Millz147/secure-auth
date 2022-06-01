//Modules
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

//Model
const conn = require("../models/conn");
const userModel = require("../models/user.model");

//Middleware
const users = require("../middleware/user.js");

//Controller
const user = require("../controllers/user.ctrl");

router.use(cookieParser());
router.use(express.urlencoded({ extended: false }));

//Regiter Route
router.route("/register").post(users.signupValidator, users.avail, user.signUp);
//Login Route
router.route("/login").post(users.loginValidator, user.login);
//Dashboard Route
router.route("/dashboard").get(users.auth, user.dashboard);
//Logout Route
router.route("/logout").get(user.logout);

module.exports = router;
