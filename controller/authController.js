const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");

const signToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const { name, surname, eCode, userType } = user;
  const data = {
    name,
    surname,
    eCode,
    userType,
  };
  const token = signToken(data);

  res.status(statusCode).json({
    status: "sucess",
    token,
    user,
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, surname, password, userType } = req.body;
    if (!name || !surname || !password || !userType) {
      return res.status(404).json({
        status: "fail",
        message: "Please Fill all the details",
      });
    }
    let random = Math.floor(1000 + Math.random() * 9000);
    console.log(await User.find({ eCode: random }));

    let check;
    do {
      if (await User.find({ eCode: random })) {
        console.log(random);
        random = Math.floor(1000 + Math.random() * 9000);
        check = true;
      }
      check = false;
    } while (check);

    const newUser = new User({
      name,
      surname,
      password,
      userType,
      eCode: random,
    });
    await newUser.save();

    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { eCode, password } = req.body;
    if (!eCode || !password) {
      return res.status(404).json({
        status: "fail",
        message: "Please provide ECode and password",
      });
      // return next(new AppError("Please provide ECode and password", 404));
    }

    const user = await User.findOne({ eCode });
    if (!user) {
      // return next(AppError(`Ecode ${eCode} not found`, 404));
      return res.status(404).json({
        status: "fail",
        message: `Ecode ${eCode} not found`,
      });
    }
    const correct = await user.correctPassword(password, user.password);

    if (!correct) {
      // return next(new AppError("Wrong password", 404));
      return res.status(404).json({
        status: "fail",
        message: "Wrong password",
      });
    }
    createSendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
