'use strict';
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/UserModel');
const Credential = require('../models/CredentialModel');
const generator = require('generate-password');
const bcrypt = require('bcryptjs');
const jwtGenerator = require('../utils/jwtGenerator');
const sendEmail = require('./../utils/sendEmail');


exports.registerUser = catchAsync(async (req, res, next) => {
  const { email, reg_no, name } = req.body;
  let user = await User.findOne({
    where: {
      reg_no
    }
  });
  if (user)
    return next(new AppError('User Already Exist!', 405));
  const randompassword = generator.generate({
    length: 10,
    numbers: true
  });
  const message = `<div>Hey ${name}, Your account is created for Swe Society.Your first time password is <h1>${randompassword}</h1><br> 
                          Please change this password after first login.</div>`;

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(randompassword, salt);
  const batch = reg_no.substring(0, 4);
  const credential = await Credential.create({
    reg_no,
    email,
    password
  });
  user = await User.create({
    name,
    reg_no,
    batch,
  });
  sendEmail(email, 'Greetings from Swe Society', message);
  res.status(201).json({
    status: 'success',
    pass: randompassword,
    user
  });
});


exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Credential.findOne({
    where: {
      email
    }
  });
  // console.log(user);
  if (user == null)
    return next(new AppError('Wrong Email', 404));
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass)
    return next(new AppError('Wrong Password', 401));
  const jwtToken = jwtGenerator({ reg_no: user.reg_no }, process.env.jwtSessionTokenExpire);
  res.status(200).json({
    status: 'success',
    token: jwtToken
  });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const user = await User.findAll();
  if (user.length == 0)
    next(new AppError(`No user found!`, 404));
  res.status(200).json({
    status: 'success',
    user
  });
});


exports.getSingleUser = catchAsync(async (req, res, next) => {
  const reg_no = req.params.reg_no;
  const user = await User.findOne({
    where: {
      reg_no
    }
  });
  if (user == null)
    return next(new AppError(`User with Registration number : ${reg_no} not found!`, 404));

  res.status(200).json({
    status: 'success',
    user
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const reg_no = req.user.reg_no;
  const user = await User.update(req.body,
    {
      where: { reg_no },
      returning: true
    });
  res.status(200).json({
    status: 'success',
    user: user[1][0]
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const reg_no = req.params.reg_no;
  const user = await User.findOne({
    where: {
      reg_no
    }
  });
  if (user == null)
    return next(new AppError(`User does not exist`, 404));
  User.destroy({
    where: {
      reg_no
    }
  });
  res.status(200).json({
    status: 'success',
    message: 'User deleted'
  });
});

exports.setAdmin = catchAsync(async (req, res, next) => {
  const { role, reg_no } = req.body;
  let user = await User.findOne({
    where: {
      reg_no
    }
  });
  if (user == null)
    return next(new AppError(`User does not exist`, 404));
  user = await Credential.update({ role },
    {
      where: { reg_no },
      returning: true
    });
  res.status(200).json({
    status: 'success',
    message: `User has been made ${role}`
  });
});





// ,
//     include: [{
//       model: Credential,
//     }],