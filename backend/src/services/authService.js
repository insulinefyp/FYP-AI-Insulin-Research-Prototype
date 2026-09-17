const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const SALT_ROUNDS = 12;
const JWT_EXPIRES_IN = "7d";

async function registerUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [normalizedEmail]
  );

  if (existingUser.rowCount > 0) {
    const error = new Error("An account with this email already exists");
    error.code = "EMAIL_EXISTS";
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await pool.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email, is_active, created_at`,
    [normalizedEmail, passwordHash]
  );

  return result.rows[0];
}

async function loginUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  const result = await pool.query(
    `SELECT id, email, password_hash, is_active
     FROM users
     WHERE email = $1`,
    [normalizedEmail]
  );

  if (result.rowCount === 0) {
    const error = new Error("Invalid email or password");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const user = result.rows[0];

  if (!user.is_active) {
    const error = new Error("Invalid email or password");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      is_active: user.is_active,
    },
  };
}

module.exports = {
  registerUser,
  loginUser,
};
