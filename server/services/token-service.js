const jwt = require("jsonwebtoken");
const { tokenModel } = require("../models");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "10s" });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "1m" });
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findById(userId);
    const existToken = await tokenModel.findOne(item => item.refreshToken === refreshToken);

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenModel.update(tokenData);
    }

    if (existToken) {
      await tokenModel.delete(existToken.id);
    }

    return await tokenModel.create({ user: userId, refreshToken });
  }

  async removeToken(refreshToken) {
    const token = await tokenModel.findOne(item => item.refreshToken === refreshToken);
    return await tokenModel.delete(token.id);
  }

  async findToken(refreshToken) {
    return await tokenModel.findOne(item => item.refreshToken === refreshToken);
  }

  async validateAccessToken(token) {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET);

    } catch (e) {
      return null;
    }

  }

  async validateRefreshToken(token) {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET);
      
    } catch (e) {
      return null;
    }

  }
}

module.exports = new TokenService();