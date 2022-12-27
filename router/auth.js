const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const private_key = "X132441VFSJAGSJDGSJGSKGS7865296@FSJH";

function validateRequest(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, private_key);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
router
  .post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    // 1. check for existing user

    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    //2. hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create new user

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const isSaved = await newUser.save();
    if (!isSaved) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    res.status(201).json({ message: "User created successfully" });
  })
  .post("/login", async (req, res) => {
    const { email, password } = req.body;

    // 1. check for existing user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not exists with this email" });
    }

    // 2. Compare password

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid Password & Username" });
    }

    // 3. Generate token

    const token = jwt.sign({ id: user._id }, private_key, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  })
  .get("/me", validateRequest, async (req, res) => {
    const user = await User.findOne({ _id: req.user.id });
    const respObj = {};
    respObj.name = user.name;
    respObj.email = user.email;
    respObj.id = user._id;
    res.status(200).json({ message: "You are authorized", data: respObj });
  });

module.exports = router;
