const  User  = require("../models/user-model.js");


exports.getUser = async (req, res) => {
  try {
    //  console.log(req.user.email);
    const loguserId = req.user.id
    // console.log(loguserId)
    // const filterUsers = await User.find().select("-password")
    const filterUsers = await User.find({ _id: { $ne: loguserId }}).select("-password")
    // filter ค้นหาทั้งหมด ยกเว้น id ที่ตรงกับ req.user.id และไม่ส่ง password
    res.status(200).json(filterUsers)
  } catch (error) {
    console.log("Error in getUser", error);
    res.status(500).json({ error: error });
  }
};

exports.current_user = async (req, res) => {
  try {
    const currentUserId = req.user.id
    const user = await User.findById(currentUserId).select("-password")
    res.status(200).json({name:user.username, photo:user.photo})
  } catch (error) {
    console.log("Error in getUser", error);
    res.status(500).json({ error: error });
  }
};