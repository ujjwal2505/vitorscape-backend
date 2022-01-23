const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    surname: {
      type: String,
      required: [true, "surname is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "phone number is required"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    // eCode: {
    //   type: String,
    //   required: [true, "Ecode is required"],
    //   unique: true,
    // },
    password: {
      type: String,
      required: [true, "Password is required"],
      // minlength: [8, "Password length should be atleast 8 characters"],
    },
    // userType: {
    //   type: String,
    //   required: [true, "user type is required"],
    //   enum: ["ADMIN", "EMPLOYEE"],
    // },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
