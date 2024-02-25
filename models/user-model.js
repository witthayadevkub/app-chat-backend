const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    username:{
        type: String,
        require: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 6
    },
    photo:{
        type: String,
        default: ''
    },
    gender:{
        type: String,
        require: true,
        enum:['male','female']
    },
    role:{
      type: String,
      default: 'user'
    },
    friend:{
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
