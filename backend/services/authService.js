// services/authService.js
const User = require('../models/User');
const JWTUtil = require('../utils/jwt');
const PasswordUtil = require('../utils/passwordUtils');
const EmailService = require('../utils/emailService');
const APIError = require('../utils/apiError');

class AuthService {
  async register(userData) {
    try {
      // Check if user exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new APIError('Email already registered', 400);
      }

      // Create new user
      const user = new User(userData);
      await user.save();

      // Send welcome email
      await EmailService.sendWelcomeEmail(user);

      // Generate tokens
      const accessToken = JWTUtil.generateToken({ userId: user._id });
      const refreshToken = JWTUtil.generateRefreshToken({ userId: user._id });

      return {
        user: user.toJSON(),
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      // Find user
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new APIError('Invalid credentials', 401);
      }

      // Verify password
      const isValidPassword = await PasswordUtil.comparePassword(
        password,
        user.password
      );
      if (!isValidPassword) {
        throw new APIError('Invalid credentials', 401);
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const accessToken = JWTUtil.generateToken({ userId: user._id });
      const refreshToken = JWTUtil.generateRefreshToken({ userId: user._id });

      return {
        user: user.toJSON(),
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = JWTUtil.verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new APIError('User not found', 404);
      }

      const newAccessToken = JWTUtil.generateToken({ userId: user._id });
      const newRefreshToken = JWTUtil.generateRefreshToken({ userId: user._id });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new APIError('User not found with this email', 404);
      }

      // Generate reset token
      const resetToken = PasswordUtil.generateResetToken();
      const hashedToken = await PasswordUtil.hashResetToken(resetToken);

      // Save reset token
      user.passwordResetToken = hashedToken;
      user.passwordResetExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // Send reset email
      await EmailService.sendPasswordResetEmail(user, resetToken);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const hashedToken = await PasswordUtil.hashResetToken(token);
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new APIError('Invalid or expired reset token', 400);
      }

      // Update password
      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();