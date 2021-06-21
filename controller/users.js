const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

module.exports.signUp = async function (req, res) {
 const errors = validationResult(req)
 if (!errors.isEmpty()) {
  return res.status(400).json({
   errors: errors.array()
  });
 }

 const { username, email, password } = req.body;
 try {
  let user = await User.findOne({
   email
  })

  if (user) {
   return res.status(400).json({
    status: 400,
    message: "User already exists"
   })
  }

  user = new User({
   username, email, password
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt)
  await user.save();

  const payload = {
   user: {
    id: user.id
   }
  }

  jwt.sign(payload,
   "randomString", {
   expiresIn: 10000
  },
   (err, token) => {
    if (err) throw err;
    res.status(200).json({
     token,
     id: user.id
    })
   }
  )
 } catch (error) {
  res.status(500).json({
   status: 500,
   message: "Error while processing your request. Please try again later"
  })
 }
}

module.exports.login = async function (req, res) {
 const errors = validationResult(req);

 if (!errors.isEmpty()) {
  return res.status(400).json({
   status: 400,
   errors: errors.array()
  });
 }

 const { email, password } = req.body;
 try {
  let user = await User.findOne({
   email
  });

  if (!user)
   return res.status(400).json({
    status: 400,
    message: "User does not exist!"
   });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
   return res.status(400).json({
    status: 400,
    message: "Incorrect Password!"
   });

  const payload = {
   user: {
    id: user.id
   }
  };

  jwt.sign(
   payload,
   "randomString",
   {
    expiresIn: 36000
   },
   (err, token) => {
    if (err) throw err;
    res.status(200).json({
     id: user.id,
     token
    });
   }
  );
 } catch (e) {
  res.status(500).json({
   status: 500,
   message: "Error while processing your request. Please try again later"
  });
 }
}