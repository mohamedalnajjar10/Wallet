const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { sanitizeUser } = require("../utils/sanitizeData");
const createToken = require("../utils/createToken");
const crypto = require("crypto");
const { Op } = require("sequelize");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const Wallet = require("../models/walletUserModel"); 
const Company = require("../models/companyModel");
const WalletCompany = require("../models/walletCompanyModel");


exports.signup = async (req, res, next) => {
  try {
    const { type } = req.body; 
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (type === 'user') {
      const user = await User.create({
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        nationalId: req.body.nationalId,
        gender: req.body.gender,
        password: hashedPassword,
      });

      await Wallet.create({
        userId: user.id,
        balance: 0,
      });

      const token = createToken(user.id);
      return res.status(201).json({ data: sanitizeUser(user), token });
    }

    if (type === 'company') {
      const company = await Company.create({
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        categoryId: req.body.categoryId,
        password: hashedPassword,
      });

      await WalletCompany.create({
        companyId: company.id,
        balance: 0,
      });

      const token = createToken(company.id); 
      return res.status(201).json({ data: company, token });
    }

    return res.status(400).json({ message: "Invalid user type :(user Or company)" });
  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  const user = await User.findOne({ where: { mobile: req.body.mobile } });
  if (!user || !(await bcrypt.compareSync(req.body.password, user.password))) {
    return next(new ApiError("Incoreect password or email "));
  }

  const token = createToken(user.id);

  res.status(200).send({ data: user, token });
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new ApiError("No token provided", 401));
    }
    res.status(200).send({ message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findByPk(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }
  // التحقق من وقت تغيير كلمة المرور
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    const tokenIssuedAt = Math.floor(Date.now() / 1000); // وقت إنشاء التوكن
    if (passChangedTimestamp > tokenIssuedAt) {
      return next(
        new ApiError("Password was recently changed. Please login again.", 401)
      );
    }
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
};

exports.allowedTo = (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route ", 403)
      );
    }
    next();
  };

exports.forgetPassword = async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email : ${req.body.email}`, 404)
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  const message = `Hi ${user.name},\n We received a request to reset the password on your Wallet Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The Wallet Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    console.error("detiels error", err); 
    return next(new ApiError("There is an error in sending email", 500));
  }
  res.status(200).send({
    status: "Success",
    message: " A recovery code has been sent to your email",
  });
};

exports.verifyPassResetCode = async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  // Check if the reset code is valid and not expired
  const user = await User.findOne({
    where: {
      passwordResetCode: hashedResetCode,
      passwordResetExpires: {
        [Op.gt]: Date.now(),
      },
      passwordResetVerified: false,
    },
  });

  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).send({
    status: "Success",
  });
};

exports.resetPassword = async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }
  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }
  const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

  user.password = hashedPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  const token = createToken(user.id);

  res.status(200).send({ token });
};
