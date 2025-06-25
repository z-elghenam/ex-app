const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("../generated/prisma/index");
const { validateRegister, validateLogin } = require("../utils/validation");

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const { email, password, firstName, lastName, phone, dateOfBirth } =
      req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User already exists with this email",
      });
    }
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        emailVerificationToken,
        emailVerificationExpires,
      },
    });

    res.status(201).json({
      status: "success",
      message:
        "User registered successfully. Please check your email for verification.",
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during registration",
    });
  }
};

// @route POST /api/auth/login
// @desc Login user
// @access Public
const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Check user status
    if (user.status !== "ACTIVE") {
      return res.status(400).json({
        status: "error",
        message: "Account is suspended or inactive",
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    res.json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profileImage: user.profileImage,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during login",
    });
  }
};

// @route GET /api/auth/me
// @desc Get current user
// @access Private
const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        profileImage: true,
        role: true,
        status: true,
        isEmailVerified: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

module.exports = { register, login, getUserProfile };
