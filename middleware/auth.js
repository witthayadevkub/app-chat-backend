const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    const token = req.headers.authorization
    // console.log(token)
    if(!token){
        return res.status(401).json({ message:'No token'});
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // console.log(decoded)
    req.user = decoded.User
    // console.log(req.user)
    next()
  } catch (err) {
    console.error(err)
    res.send('server error: ' + err).status(500)
  }
};
