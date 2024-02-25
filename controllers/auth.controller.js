const User = require("../models/user-model.js");
const bcrypt = require("bcryptjs");
const generateTokenAndSetCookie = require("../utils/token");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { email, username, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ err: "passwords don't match" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ err: "user already login" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const photoBoy = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const photogirl = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = {
      email: email,
      username: username,
      password: hashedPassword,
      confirmPassword: confirmPassword,
      gender: gender,
      photo: gender === "male" ? photoBoy : photogirl,
    };
    if (newUser) {
      // await newUser.save()
      const newdata = await User.create(newUser);

      //generate jwt token
      // generateTokenAndSetCookie(newdata._id, res);

      res.status(200).json(newdata);
    } else {
      res.status(404).json({ error: "INvalid user" });
    }
  } catch (err) {
    console.log("Error in signup" + err);
    res.status(500).json({ error: "sever error" + err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(403).json({ error: "Ivalid email or password" });
    }

    // console.log(user._id);
    // generateTokenAndSetCookie(user._id, res)
    var payload = {
      User: {
        email: user.email,
        id: user._id,
        photo: user.photo
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    // console.log(token)

    // res.cookie("token", token, {
    //   maxAge: 15 * 24 * 60 * 60 * 1000,
    //   httpOnly: true,
    //   secure: true,
    //   // sameSite: "strict",
    //   sameSite: "none",
    //   secure: process.env.NODE_ENV !== "development",
    // });

    // const token = res.cookie()
    // console.log(req.cookies.token);
    res.status(200).json({token:token, id:user._id});
    // res.status(200).json({ id: user.id, message: "login successfully",token: token });
  } catch (err) {
    console.log("Error in signup" + err);
    res.status(500).json({ error: "sever error" + err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    // console.log(res.cookie("jwt","", { maxAge: 0}))
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logout successfully" });
  } catch (err) {
    console.log("Error in loguot" + err);
    res.status(500).json({ error: "sever error" + err.message });
  }
};
