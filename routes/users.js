const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const users = require("../controller/users")

router.route("/sign-up").post(
 [
  check("username", "Please enter a valid username").not().isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").isLength({
   min: 6
  })
 ],
 users.signUp
)

router.route("/login").post(
 [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a valid password").isLength({
   min: 6
  })
 ],
 users.login
);

module.exports = router