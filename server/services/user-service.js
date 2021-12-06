const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const { userModel, tokenModel } = require("../models");
const emailService = require("./email-service");
const tokenService = require("./token-service");
const ApiError = require("../exceptions/api-error");

class UserService {
  async registration(email, password) {
    const candidate = await userModel.findOne(item => item?.email === email);
    if (candidate) {
      throw ApiError.BadRequest("User Already Exist");
    }

    const hashedPass = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    await emailService.sendActivationMail(email, process.env.API_URL + "/activate/" + activationLink);
    const newUser = await userModel.create({ email, password: hashedPass, activationLink, activated : false });

    const tokens = tokenService.generateTokens({ email });
    await tokenService.saveToken(newUser.id, tokens.refreshToken);

    return {
      ...tokens,
      user : newUser
    }

  }

  async activate(activationLink) {
    const user = await userModel.findOne(item => item.activationLink === activationLink);
    if (!user) {
      throw ApiError.BadRequest("Can't find user by Activation Link");
    }

    await userModel.update({ ...user, activated : true });
  }

  async login(email, password) {
    const user = await userModel.findOne(item => item?.email == email);

    if (!user) {
      throw ApiError.BadRequest("User doensn't exist");
    }

    const equalPass = await bcrypt.compare(password, user.password);

    if (!equalPass) {
      throw ApiError.BadRequest("Password's dont match");
    }

    const tokens = await tokenService.generateTokens({ email });

    await tokenService.saveToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user
    }

  }

  async logout(refreshToken) {
    return await tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await userModel.findById(tokenFromDb.user);
    const tokens = tokenService.generateTokens({email : user.email})
    await tokenService.removeToken(refreshToken);
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user
    }
  }

  async getUsers() {
    return await userModel.findAll();
  }
}

module.exports = new UserService();