//Modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//User Schema
const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
