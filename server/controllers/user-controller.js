const userService = require("../services/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation Error", errors.array()));
      }

      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.json(userData);
    } catch (e) {
      next(e);
    }

  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.json(userData);

    } catch (e) {
      next(e);
    }

  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      console.log('pizdec', req.cookies);
      const token = await userService.logout(refreshToken);
      console.log("token", token);
      res.clearCookie("refreshToken");
      return res.json(token);

    } catch (e) {
      next(e);
    }
    
  }

  async activate(req, res, next) {
    try {
      const { link } = req.params;
      await userService.activate(link);
      return res.redirect(process.env.API_URL);

    } catch (e) {
      next(e);
    }

  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      console.log("refreshiii", req.cookies.refreshToken);
      const userData = await userService.refresh(refreshToken);
      console.log("refreshUserData", userData);
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly : true });
      return res.json(userData);

    } catch (e) {
      next(e);
    }

  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getUsers();
      return res.status(200).json(users);

    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = new UserController();