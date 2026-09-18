const pool = require("../config/database");

async function getProfileByUserId(userId) {
  const result = await pool.query(
    `SELECT
       id,
       user_id,
       full_name,
       age,
       weight_kg,
       height_cm,
       notes,
       created_at,
       updated_at
     FROM patient_profiles
     WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0] || null;
}

async function createProfile(userId, profileData) {
  const {
    fullName,
    age,
    weightKg,
    heightCm,
    notes,
  } = profileData;

  const result = await pool.query(
    `INSERT INTO patient_profiles
      (user_id, full_name, age, weight_kg, height_cm, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING
       id,
       user_id,
       full_name,
       age,
       weight_kg,
       height_cm,
       notes,
       created_at,
       updated_at`,
    [
      userId,
      fullName,
      age,
      weightKg,
      heightCm,
      notes || null,
    ]
  );

  return result.rows[0];
}

async function updateProfile(userId, profileData) {
  const {
    fullName,
    age,
    weightKg,
    heightCm,
    notes,
  } = profileData;

  const result = await pool.query(
    `UPDATE patient_profiles
     SET
       full_name = $1,
       age = $2,
       weight_kg = $3,
       height_cm = $4,
       notes = $5,
       updated_at = NOW()
     WHERE user_id = $6
     RETURNING
       id,
       user_id,
       full_name,
       age,
       weight_kg,
       height_cm,
       notes,
       created_at,
       updated_at`,
    [
      fullName,
      age,
      weightKg,
      heightCm,
      notes || null,
      userId,
    ]
  );

  return result.rows[0] || null;
}

module.exports = {
  getProfileByUserId,
  createProfile,
  updateProfile,
};
