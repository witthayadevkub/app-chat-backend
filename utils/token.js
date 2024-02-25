const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userID, res) =>{
    const token =jwt.sign({userID}, process.env.JWT_SECRET,{
        expiresIn: "5d"
    })

    res.cookie("jwt", token,{
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        // sameSite: "none",
        secure: process.env.NODE_ENV !== "development"
    })
}

module.exports = generateTokenAndSetCookie