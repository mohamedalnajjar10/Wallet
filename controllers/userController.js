const slugify = require("slugify");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const ApiError = require("../utils/ApiError");
const createToken = require("../utils/createToken");
const Wallet = require("../models/walletUserModel");

exports.createUser = async (req, res) => {
  try {
    const { name, mobile, nationalId, gender, email, password } = req.body;

    const hashedPassword = await bcrypt.hashSync(password, 10);

    const user = await User.create({
      name,
      mobile,
      nationalId,
      gender,
      email,
      password: hashedPassword,
      slug: slugify(name),
      role: req.body.role || "user",
    });

    // Automatically create a wallet for the new user
    const wallet = await Wallet.create({
      userId: user.id,
      balance: 0, // Initialize wallet balance to 0
    });

    res.status(201).send({ data: { user, wallet } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllUsers = async (_, res) => {
  const users = await User.findAll({});
  res.status(200).send({ results: users.length, data: users });
};

exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) {
    return next(new ApiError(`No Document For This Id ${id}`, 404));
  }
  res.status(200).send({ data: user });
};

exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.update(req.body, { where: { id: id } });
  if (!user) {
    return next(new ApiError(`No Document For This Id ${id}`, 404));
  }
  const newUser = await User.findByPk(id);
  res.status(200).send({ data: newUser });
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) {
    return next(new ApiError(`No Document For This Id ${id}`, 404));
  }
  await user.destroy();
  res.status(204).send({});
};

exports.getLoggedUserData = async (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateLoggedUserData = async (req, res, next) => {
  const userId = req.user.id;
  const updateData = {
    name: req.body.name,
    mobile: req.body.mobile,
    gender: req.body.gender,
    email: req.body.email,
    nationalId: req.body.nationalId,
  };
  const user = await User.update(updateData, { where: { id: userId } });
  if (!user) {
    return next(new ApiError(`No Document For This Id ${userId}`, 404));
  }
  const newUser = await User.findByPk(userId);
  const token = createToken(userId);

  res.status(200).send({ data: newUser, token });
};

exports.updateLoggedPassword = async (req, res, next) => {
  const { id } = req.user;
  const updateData = { password: req.body.password };

  if (updateData.password) {
    const hashedPassword = await bcrypt.hashSync(updateData.password, 10);
    updateData.password = hashedPassword;
  }

  // تحديث حقل passwordChangedAt
  updateData.passwordChangedAt = new Date();

  const Document = await User.update(updateData, {
    where: { id: id },
  });
  if (Document[0] === 0) {
    return next(new ApiError(`No Document For This Id ${id}`, 404));
  }

  const document = await User.findByPk(id);
  const token = createToken(id);
  res.status(200).send({ data: document, token });
  next();
};
