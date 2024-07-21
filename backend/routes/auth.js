import express from "express";
import User from "../models/User.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import fetchUser from "../middleware/fetchUser.js";
import bcrypt from "bcryptjs";
const router = express.Router();

//* ROUTE 1 : Create a User using: POST "/api/auth/signup". No login required
router.post("/signup", async (req, res) => {
  //* data comimg from body(frontend)
  const { name, email, password } = req.body; //Req.body se hume ye 3 data mil rhe h

  try {
    //* Validation
    if (!name || !email || !password) {
      //Agar name,email,password me se koi si bhi field khhaali rhi toh error message dikhega
      return res.status(400).json({ error: "All fields are required" });
    }

    //* Email Validation
    if (!email.includes("@")) {
      //Agar @ nhi mila toh error denge
      return res.status(400).json({ error: "Please enter a valid email" });
    }

    //* Find Unique User with email
    const user = await User.findOne({ email }); //Jo email hum enter kar rhe h agar wo already entered h toh error dikhega

    if (user) {
      res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);

    //* Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    //* Save Data into database
    const newUser = await User({
      //Taking use of User model
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log(newUser);
    res.status(201).json({ success: "Signup Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//* ROUTE 2 : Login a User using: POST "/api/auth/login". No login required
router.post("/login", async (req, res) => {
  //* data comimg from body(frontend)
  const { email, password } = req.body;

  try {
    //* Validation
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    //* Email Validation
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }

    //* Find Unique User with email
    const user = await User.findOne({ email });

    console.log(user);

    //* if user not exists with that email
    if (!user) {
      res.status(400).json({ error: "User Not Found" });
    }

    //* matching user password to hash password with bcrypt.compare()
    const doMatch = await bcrypt.compare(password, user.password);
    console.log(doMatch);

    //* if match password then generate token
    if (doMatch) {
      const token = jwt.sign({ userId: user.id },""+ process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(201).json({ token,success : "Login Successfull" });
    } else {
      res.status(404).json({ error: "Email And Password Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.get("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.userId;
    console.log("getuser Id", userId);
    const user = await User.findById(userId).select("-password");
    res.send(user);
    console.log("getuser", user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});



export default router;
