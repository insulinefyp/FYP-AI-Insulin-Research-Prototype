const { registerUser, loginUser } = require("../services/authService");
const pool = require("../config/database");

function validateCredentials(email, password) {
  if (!email || typeof email !== "string") {
    return "Email is required";
  }

  if (!password || typeof password !== "string") {
    return "Password is required";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "A valid email is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  return null;
}

async function register(req, res) {
  try {
    const { email, password } = req.body;

    const validationError = validateCredentials(email, password);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const user = await registerUser(email, password);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    if (error.code === "EMAIL_EXISTS") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create account",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const validationError = validateCredentials(email, password);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const result = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    if (error.code === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to log in",
    });
  }
}

async function getMe(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, email, is_active, created_at
       FROM users
       WHERE id = $1 AND is_active = TRUE`,
      [req.user.sub]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user",
    });
  }
}

module.exports = {
  register,
  login,
  getMe,
};
